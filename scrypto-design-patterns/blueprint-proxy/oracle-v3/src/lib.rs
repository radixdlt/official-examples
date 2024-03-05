use scrypto::prelude::*;

#[blueprint]
mod oracle {
    enable_method_auth! {
        roles {
            oracle_manager_auth => updatable_by: [];
        },
        methods {
            set_price => restrict_to: [oracle_manager_auth, OWNER];
            add_symbol => restrict_to: [oracle_manager_auth, OWNER];
            get_oracle_info => PUBLIC;
            get_price => PUBLIC;
            get_address => PUBLIC;
        }
    }

    struct Oracle {
        info: String,
        symbol_map: IndexMap<String, ResourceAddress>,
        prices: KeyValueStore<(String, String), Decimal>,
    }

    // Unlike "oracle_v1" and "oracle_v2" this Oracle has different interface,
    // which makes it incompatible with "oracle_proxy_basic"
    impl Oracle {
        pub fn instantiate_owned() -> Owned<Oracle> {
            info!("[Oracle v3] instantiate_owned()");
            Self {
                info: "Oracle v3".to_string(),
                symbol_map: indexmap!(),
                prices: KeyValueStore::new(),
            }
            .instantiate()
        }

        pub fn instantiate_and_globalize(
            owner_badge: NonFungibleGlobalId,
            manager_badge: NonFungibleGlobalId,
        ) -> Global<Oracle> {
            let owner_role = OwnerRole::Fixed(rule!(require(owner_badge)));
            let manager_rule = rule!(require(manager_badge));

            info!("[Oracle v3] instantiate_and_globalize()");
            Self::instantiate_owned()
                .prepare_to_globalize(owner_role)
                .roles(roles! {
                    oracle_manager_auth => manager_rule;
                })
                .globalize()
        }

        pub fn get_oracle_info(&self) -> String {
            info!("[Oracle v3] get_oracle_info()");
            let info = self.info.clone();
            info!("[Oracle v3] get_oracle_info() info = {:?}", info);
            info
        }

        pub fn add_symbol(&mut self, address: ResourceAddress, symbol: String) {
            info!(
                "[Oracle v3] add_symbol() address = {:?} symbol = {:?}",
                address, symbol
            );
            self.symbol_map.insert(symbol, address);
        }

        pub fn set_price(&mut self, base: String, quote: String, price: Decimal) {
            info!(
                "[Oracle v3] set_price() base = {:?} quote = {:?} price = {:?}",
                base, quote, price
            );
            self.prices.insert((base, quote), price);
        }

        pub fn get_price(&self, base: String, quote: String) -> Option<Decimal> {
            info!(
                "[Oracle v3] get_price() base = {:?} quote = {:?}",
                base, quote
            );
            let price = self.prices.get(&(base, quote)).map(|price| *price);
            info!("[Oracle v3] get_price() price = {:?}", price);
            price
        }

        pub fn get_address(&self, symbol: String) -> Option<ResourceAddress> {
            info!("[Oracle v3] get_address() symbol = {:?}", symbol);
            let address = self.symbol_map.get(&symbol).map(|v| *v);
            info!("[Oracle v3] get_address() price = {:?}", address);
            address
        }
    }
}
