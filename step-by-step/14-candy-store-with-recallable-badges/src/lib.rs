use scrypto::prelude::*;

#[derive(ScryptoSbor, Clone)]
enum Toy {
    Dinosaur,
    Unicorn,
    Dragon,
    Robot,
    Pony,
}

#[derive(ScryptoSbor, NonFungibleData, Clone)]
pub struct Egg {
    toy: Toy,
}

#[derive(ScryptoSbor, NonFungibleData, Clone)]
struct StaffBadge {
    employee_number: u64,
    employee_name: String,
}

#[blueprint]
mod candy_store {
    enable_method_auth! {
        // define auth rules
        roles {
            manager => updatable_by: [OWNER];
            staff => updatable_by: [manager, OWNER];
        },
        // decide which methods are public and which are restricted to certain roles
        methods {
            buy_candy => PUBLIC;
            buy_chocolate_egg => PUBLIC;
            get_prices => PUBLIC;
            set_candy_price => restrict_to: [manager, OWNER];
            set_chocolate_egg_price => restrict_to: [manager, OWNER];
            mint_staff_badge => restrict_to: [manager, OWNER];
            restock_store => restrict_to: [staff, manager, OWNER];
            withdraw_earnings => restrict_to: [OWNER];
        }
    }
    struct CandyStore {
        candy: FungibleVault,
        chocolate_eggs: NonFungibleVault,
        collected_xrd: FungibleVault,
        candy_price: Decimal,
        chocolate_egg_price: Decimal,
        candy_resource_manager: FungibleResourceManager,
        chocolate_egg_resource_manager: NonFungibleResourceManager,
        staff_badge_resource_manager: NonFungibleResourceManager,
    }

    impl CandyStore {
        // create a new CandyStore component, with a fixed price for each candy type.
        pub fn instantiate_candy_store(
            candy_price: Decimal,
            chocolate_egg_price: Decimal,
        ) -> (Global<CandyStore>, FungibleBucket, FungibleBucket) {
            // reserve an address for the component
            let (address_reservation, component_address) =
                Runtime::allocate_component_address(CandyStore::blueprint_id());

            // create an Owner Badge
            let owner_badge = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(
                    init {
                        "name" => "Candy Store Owner Badge", locked;
                    }
                ))
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1);

            // create a Manager Badge
            let manager_badge = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(
                    init {
                        "name" => "Manager Badge", locked;
                    }
                ))
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1);

            // create a new Staff Badge resource manager
            let staff_badges_manager =
                ResourceBuilder::new_integer_non_fungible::<StaffBadge>(OwnerRole::None)
                    .metadata(metadata!(
                        init {
                            "name" => "Staff Badge", locked;
                        }
                    ))
                    .mint_roles(mint_roles! {
                        minter => rule!(require(global_caller(component_address)));
                        minter_updater => rule!(deny_all);
                    })
                    .recall_roles(recall_roles! {
                        recaller => rule!(require_any_of(vec![
                                owner_badge.resource_address(),
                                manager_badge.resource_address(),
                            ]));
                        recaller_updater => rule!(deny_all);
                    })
                    .burn_roles(burn_roles! {
                        burner => rule!(require_any_of(vec![
                                owner_badge.resource_address(),
                                manager_badge.resource_address(),
                            ]));
                        burner_updater => rule!(deny_all);
                    })
                    // starting with no initial supply means a resource manger is produced instead of a bucket
                    .create_with_no_initial_supply();

            // create a new bucket of Candy
            let bucket_of_candy = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(
                    init {
                        "name" => "Candy", locked;
                        "symbol" => "CNDY", locked;
                        "description" => "A delicious sugary sweet", locked;
                    }
                ))
                .mint_roles(mint_roles! {
                    minter => rule!(require(global_caller(component_address)));
                    minter_updater => rule!(deny_all);
                })
                .mint_initial_supply(100);

            // create a new bucket of Chocolate Eggs
            let bucket_of_chocolate_eggs = ResourceBuilder::new_ruid_non_fungible(OwnerRole::None)
                .metadata(metadata!(
                    init {
                        "name" => "Chocolate Egg", locked;
                        "description" => "A chocolate egg with 1 of 5 toys inside", locked;
                    }
                ))
                .mint_roles(mint_roles! {
                    minter => rule!(require(global_caller(component_address)));
                    minter_updater => rule!(deny_all);
                })
                .mint_initial_supply([
                    Egg { toy: Toy::Dinosaur },
                    Egg { toy: Toy::Unicorn },
                    Egg { toy: Toy::Dragon },
                    Egg { toy: Toy::Robot },
                    Egg { toy: Toy::Pony },
                ]);

            // populate a CandyStore struct and instantiate a new component
            let component = Self {
                candy_resource_manager: bucket_of_candy.resource_manager(),
                chocolate_egg_resource_manager: bucket_of_chocolate_eggs.resource_manager(),
                candy_price,
                chocolate_egg_price,
                candy: FungibleVault::with_bucket(bucket_of_candy),
                chocolate_eggs: NonFungibleVault::with_bucket(bucket_of_chocolate_eggs),
                collected_xrd: FungibleVault::new(XRD),
                staff_badge_resource_manager: staff_badges_manager,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
                owner_badge.resource_address()
            ))))
            .roles(roles!(
                manager => rule!(require(manager_badge.resource_address()));
                staff => rule!(require(staff_badges_manager.address()));))
            .with_address(address_reservation)
            .globalize();

            // return the component, plus the badges
            (component, owner_badge, manager_badge)
        }

        pub fn get_prices(&self) -> (Decimal, Decimal) {
            info!("Candy price is {} XRD", self.candy_price);
            info!("Chocolate egg price is {} XRD", self.chocolate_egg_price);
            // return the current prices of candy and chocolate eggs
            (self.candy_price, self.chocolate_egg_price)
        }

        pub fn buy_candy(
            &mut self,
            mut payment: FungibleBucket,
        ) -> (FungibleBucket, FungibleBucket) {
            // calculate how much candy we can buy with the payment
            let candy_amount = payment
                .amount()
                .checked_div(self.candy_price)
                .unwrap()
                .checked_round(0, RoundingMode::ToZero)
                .unwrap();
            // calculate the total price of the candy
            let total_candy_price = (candy_amount.checked_mul(self.candy_price)).unwrap();
            // take our price in XRD out of the payment
            self.collected_xrd.put(payment.take(total_candy_price));
            // return a tuple of candy and the change left from the input payment (if any)
            (self.candy.take(candy_amount), payment)
        }
        pub fn buy_chocolate_egg(
            &mut self,
            mut payment: FungibleBucket,
        ) -> (NonFungibleBucket, FungibleBucket) {
            // take our price in XRD out of the payment
            self.collected_xrd
                .put(payment.take(self.chocolate_egg_price));
            // return a tuple containing a chocolate egg, plus whatever change is left (if any)
            (self.chocolate_eggs.take(1), payment)
        }

        pub fn set_candy_price(&mut self, new_price: Decimal) {
            // set a new price for candy. requires a manager or owner badge
            self.candy_price = new_price;
        }

        pub fn set_chocolate_egg_price(&mut self, new_price: Decimal) {
            // set a new price for chocolate eggs. requires a manager or owner badge
            self.chocolate_egg_price = new_price;
        }

        pub fn mint_staff_badge(&mut self, name: String, number: u64) -> NonFungibleBucket {
            // mint and receive a new staff badge. requires an owner or manager badge
            let staff_badge_bucket = self.staff_badge_resource_manager.mint_non_fungible(
                &NonFungibleLocalId::integer(number),
                StaffBadge {
                    employee_number: number,
                    employee_name: name,
                },
            );
            staff_badge_bucket
        }

        pub fn restock_store(&mut self) {
            // mint some more candy and chocolate egg tokens. requires an owner, manager or staff badge
            let candy_amount = 100 - self.candy.amount();
            self.candy
                .put(self.candy_resource_manager.mint(candy_amount));

            let eggs = [
                Egg { toy: Toy::Dinosaur },
                Egg { toy: Toy::Unicorn },
                Egg { toy: Toy::Dragon },
                Egg { toy: Toy::Robot },
                Egg { toy: Toy::Pony },
            ];
            // iterate over the array of eggs, mint each one and put it in the chocolate_eggs vault
            for egg in eggs.iter() {
                self.chocolate_eggs.put(
                    self.chocolate_egg_resource_manager
                        .mint_ruid_non_fungible(egg.clone()),
                )
            }
        }

        pub fn withdraw_earnings(&mut self) -> FungibleBucket {
            // withdraw all the XRD collected from sales. requires an owner badge
            self.collected_xrd.take_all()
        }
    }
}
