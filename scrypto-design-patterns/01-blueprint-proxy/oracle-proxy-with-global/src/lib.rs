use scrypto::prelude::*;

#[blueprint]
mod proxy {
    enable_method_auth! {
        roles {
            proxy_manager_auth => updatable_by: [];
        },
        methods {
            set_oracle_address => restrict_to: [proxy_manager_auth, OWNER];
            get_oracle_info => PUBLIC;
            get_price => PUBLIC;
        }
    }

    struct OracleProxy {
        oracle_global_address: Option<Global<AnyComponent>>,
    }

    // This example demostrate a proxy working with:
    // - Oracle as a global component
    //   Proxy can call only public methods of Oracle component
    impl OracleProxy {
        pub fn instantiate_and_globalize(
            owner_badge: NonFungibleGlobalId,
            manager_badge: NonFungibleGlobalId,
        ) -> Global<OracleProxy> {
            let owner_role = OwnerRole::Fixed(rule!(require(owner_badge)));
            let manager_rule = rule!(require(manager_badge));

            info!("[OracleProxy] instantiate_and_globalize() ");
            Self {
                oracle_global_address: None,
            }
            .instantiate()
            .prepare_to_globalize(owner_role)
            .roles(roles! {
                proxy_manager_auth => manager_rule;
            })
            .globalize()
        }

        // Specify Oracle global component address
        pub fn set_oracle_address(&mut self, address: Global<AnyComponent>) {
            info!("[OracleProxy] set_oracle_address() address = {:?}", address);
            self.oracle_global_address = Some(address);
        }

        pub fn get_oracle_info(&self) -> String {
            info!("[OracleProxy] get_oracle_info()");
            let result = ScryptoVmV1Api::object_call(
                self.oracle_global_address
                    .expect("Oracle address not set")
                    .handle()
                    .as_node_id(),
                "get_oracle_info",
                scrypto_args!(),
            );

            let info = scrypto_decode(&result).unwrap();
            info!("[OracleProxy] get_oracle_info() info = {:?}", info);
            info
        }

        pub fn get_price(&self, base: ResourceAddress, quote: ResourceAddress) -> Option<Decimal> {
            info!(
                "[OracleProxy] get_price() base = {:?} quote = {:?}",
                base, quote
            );
            let result = ScryptoVmV1Api::object_call(
                self.oracle_global_address
                    .expect("Oracle address not set")
                    .handle()
                    .as_node_id(),
                "get_price",
                scrypto_args!(base, quote),
            );

            let price = scrypto_decode(&result).unwrap();
            info!("[OracleProxy] get_price() price = {:?}", price);
            price
        }
    }
}
