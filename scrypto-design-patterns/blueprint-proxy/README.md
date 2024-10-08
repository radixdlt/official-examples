# Blueprint Proxy

This folder includes Proxy blueprint examples for `Oracle` component (available in `oracle-v1`, `oracle-v2`
and `oracle-v3` blueprints).
It is assumed that `Oracle` component includes:

- public methods, eg. `get_price`
- protected methods, eg. `set_price`

Below examples take above into account.

Proxy blueprint examples:

- `oracle-proxy-with-global`

  - It assumes that signatures of `Oracle` component proxied methods will remain unchanged
    (thus not compliant with `oracle-v3`)
  - This proxy works with `Oracle` instantiated as a global component
  - It can call only public methods from `Oracle` component

- `oracle-proxy-with-owned`

  - It assumes that signatures of `Oracle` component proxied methods will remain unchanged
    (thus not compliant with `oracle-v3`)
  - It works with `Oracle` instantiated as an owned component (it must be instantiated by this proxy)
  - It can call any method from owned `Oracle` component

- `oracle-generic-proxy-with-global`
  - It is a generic proxy which can call any method with any arguments from configured component
  - It works with component instantiated as a global component
  - It can call only public methods from configured component

> NOTE!
> There is no `oracle-generic-proxy-with-owned` example because proxy generic `call_method()` shall be public. And since the proxy owns the component it can call any method of the owned component and this is not acceptable, since some methods eg. `set_price` shall be protected.

## Table of Contents

- [Using Blueprint Proxy](#using-blueprint-proxy)
  - [Initial setup](#initial-setup)
  - [Using Oracle Proxy with Oracle component as a global component](#using-oracle-proxy-with-oracle-component-as-a-global-component)
  - [Using Oracle Proxy with Oracle component as an owned component](#using-oracle-proxy-with-oracle-component-as-an-owned-component)
  - [Using Oracle Generic Proxy with Oracle component as a global component](#using-oracle-generic-proxy-with-oracle-component-as-a-global-component)
- [Cost overhead](#cost-overhead)

## Using Blueprint proxy

### Initial setup

1.  First, clone the repository if you have not done so, and then change
    directory to this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/scrypto-design-patterns/blueprint-proxy
    ```

2.  Initialize and setup `resim`.

    You can call a dedicated `setup.sh` script to setup using following command:

    ```sh
    source ./setup.sh

    ```

    Alternatively, you can run the commands in the script manually.

    1. Create a new account and export the account address and owner badge.

    ```sh
    resim reset
    resim new-account
    export account=account_sim1c956qr3kxlgypxwst89j9yf24tjc7zxd4up38x37zr6q4jxdx9rhma
    export owner_badge="resource_sim1nfzf2h73frult99zd060vfcml5kncq3mxpthusm9lkglvhsr0guahy:#1#"
    ```

    2. Create badges for managing the Oracle and Oracle Proxy components and export their addresses and ids.

    ```sh
    resim new-simple-badge --name 'Proxy Manager Badge'
    export proxy_manager_badge_address=<BADGE_RESOURCE_ADDRESS>
    export proxy_manager_badge_id="<BADGE_ID>"
    export proxy_manager_badge=${proxy_manager_badge_address}:${proxy_manager_badge_id}

    resim new-simple-badge --name 'Oracle Manager Badge'
    export oracle_manager_badge_address=<BADGE_RESOURCE_ADDRESS>
    export oracle_manager_badge_id="<BADGE_ID>"
    export oracle_manager_badge=${oracle_manager_badge_address}:${oracle_manager_badge_id}
    ```

    3. Mint some tokens and export their addresses.

    ```sh
    resim new-token-fixed --name "Ethereum" --symbol "ETH" 1000000
    export eth=<RESOURCE_ADDRESS>

    resim new-token-fixed --name "Usdt" --symbol "USDT" 1000000
    export usdt=<RESOURCE_ADDRESS>

    export xrd=resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3
    ```

### Using Oracle Proxy with Oracle component as a global component

You can call a dedicated `run-oracle-proxy-with-global.sh` script to get the idea how to use Oracle Proxy by using following command:

```sh
./run-oracle-proxy-with-global.sh

```

Alternatively, you can run the commands in the script manually.

1. Publish Oracle v1 and OracleProxy components.

   ```sh
   resim publish oracle-proxy-with-global
   export oracle_proxy_with_global_package=<PACKAGE_ADDRESS>

   resim publish oracle-v1
   export oracle_v1_package=<PACKAGE_ADDRESS>
   ```

2. Instantiate Oracle v1 and OracleProxy components.

   ```sh
   oracle_package=${oracle_proxy_with_global_package} \
     blueprint_name=OracleProxy \
     manager_badge=${proxy_manager_badge} \
     resim run manifests/instantiate_component.rtm
   export oracle_proxy_with_global_component=<COMPONENT_ADDRESS>

   oracle_package=${oracle_v1_package} \
     blueprint_name=Oracle \
     manager_badge=${oracle_manager_badge} \
     resim run manifests/instantiate_component.rtm
   export oracle_v1_component=<COMPONENT_ADDRESS>
   ```

3. Set prices in Oracle v1.

   ```sh
   oracle_component=${oracle_v1_component} \
     manager_badge_address=${oracle_manager_badge_address} \
     manager_badge_id=${oracle_manager_badge_id} \
     base=${xrd} quote=${usdt} price=30 \
     resim run manifests/set_prices_in_oracle.rtm

   oracle_component=${oracle_v1_component} \
     manager_badge_address=${oracle_manager_badge_address} \
     manager_badge_id=${oracle_manager_badge_id} \
     base=${xrd} quote=${eth} price=20 \
     resim run manifests/set_prices_in_oracle.rtm
   ```

4. Set Oracle v1 address in OracleProxy.

   ```sh
   manager_badge_address=${proxy_manager_badge_address} \
     manager_badge_id=${proxy_manager_badge_id} \
     oracle_proxy_component=${oracle_proxy_with_global_component} \
     oracle_component=${oracle_v1_component} \
     resim run manifests/set_oracle_address_in_oracle_proxy.rtm
   ```

5. Get prices via OracleProxy.

   ```sh
   oracle_proxy_component=${oracle_proxy_with_global_component} \
     base=${xrd} quote=${eth} \
     resim run manifests/get_prices_via_oracle_proxy.rtm
   ```

6. Publish Oracle v2 component.

   ```sh
   resim publish oracle-v2
   export oracle_v2_package=<PACKAGE_ADDRESS>
   ```

7. Instantiate Oracle v2 component.

   ```sh
   oracle_package=${oracle_v2_package} \
     blueprint_name=Oracle \
     manager_badge=${oracle_manager_badge} \
     resim run manifests/instantiate_component.rtm
   export oracle_v2_component=<COMPONENT_ADDRESS>
   ```

8. Set prices in Oracle v2.

   ```sh
   oracle_component=${oracle_v2_component} \
     manager_badge_address=${oracle_manager_badge_address} \
     manager_badge_id=${oracle_manager_badge_id} \
     base=${xrd} quote=${usdt} price=33 \
     resim run manifests/set_prices_in_oracle.rtm

   oracle_component=${oracle_v2_component} \
     manager_badge_address=${oracle_manager_badge_address} \
     manager_badge_id=${oracle_manager_badge_id} \
     base=${xrd} quote=${eth} price=22 \
     resim run manifests/set_prices_in_oracle.rtm
   ```

9. Set Oracle v2 address in OracleProxy.

   ```sh
   manager_badge_address=${proxy_manager_badge_address} \
     manager_badge_id=${proxy_manager_badge_id} \
     oracle_proxy_component=${oracle_proxy_with_global_component} \
     oracle_component=${oracle_v2_component} \
     resim run manifests/set_oracle_address_in_oracle_proxy.rtm
   ```

10. Get prices via OracleProxy.
    This is exactly the same call as in step 5, but Oracle v2 component is called by OracleProxy.

    ```sh
    oracle_proxy_component=${oracle_proxy_with_global_component} \
      base=${xrd} quote=${eth} \
      resim run manifests/get_prices_via_oracle_proxy.rtm
    ```

### Using Oracle Proxy with Oracle component as an owned component

You can call a dedicated `run-oracle-proxy-with-owned.sh` script to get the idea how to use Oracle Proxy by using following command:

```sh
./run-oracle-proxy-with-owned.sh

```

Alternatively, you can run the commands in the script manually.

1. Publish Oracle v1 and OracleProxy components.

   ```sh
   resim publish oracle-proxy-with-owned
   export oracle_proxy_with_owned_package=<PACKAGE_ADDRESS>

   resim publish oracle-v1
   export oracle_v1_package=<PACKAGE_ADDRESS>
   ```

2. Instantiate OracleProxy component.

   ```sh
   oracle_package=${oracle_proxy_with_owned_package} \
     blueprint_name=OracleProxy \
     manager_badge=${proxy_manager_badge} \
     resim run manifests/instantiate_component.rtm
   export oracle_proxy_with_owned_component=<COMPONENT_ADDRESS>
   ```

3. Initialize Oracle v1 in OracleProxy.

   OracleProxy instantiates Oracle v1 becoming its owner.

   ```sh
   manager_badge_address=${proxy_manager_badge_address} \
     manager_badge_id=${proxy_manager_badge_id} \
     oracle_proxy_component=${oracle_proxy_with_owned_component} \
     oracle_package=${oracle_v1_package} \
     resim run manifests/initialize_oracle_in_oracle_proxy.rtm
   ```

4. Set prices in Oracle v1 via OracleProxy.

   Note that the same manifest is used when setting prices directly in Oracle.
   We are just using OracleProxy component address and badge.

   ```sh
   manager_badge_address=${proxy_manager_badge_address} \
     manager_badge_id=${proxy_manager_badge_id} \
     oracle_component=${oracle_proxy_with_owned_component} \
     base=${xrd} quote=${usdt} price=30 \
     resim run manifests/set_prices_in_oracle.rtm

   manager_badge_address=${proxy_manager_badge_address} \
     manager_badge_id=${proxy_manager_badge_id} \
     oracle_component=${oracle_proxy_with_owned_component} \
     base=${xrd} quote=${eth} price=20 \
     resim run manifests/set_prices_in_oracle.rtm
   ```

5. Get prices via OracleProxy.

   ```sh
   oracle_proxy_component=${oracle_proxy_with_owned_component} \
     base=${xrd} quote=${eth} \
     resim run manifests/get_prices_via_oracle_proxy.rtm
   ```

6. Publish Oracle v2 component.

   ```sh
   resim publish oracle-v2
   export oracle_v2_package=<PACKAGE_ADDRESS>
   ```

7. Initialize Oracle v2 in OracleProxy.

   OracleProxy instantiates Oracle v2 becoming its owner.

   ```sh
   manager_badge_address=${proxy_manager_badge_address} \
     manager_badge_id=${proxy_manager_badge_id} \
     oracle_proxy_component=${oracle_proxy_with_owned_component} \
     oracle_package=${oracle_v2_package} \
     resim run manifests/initialize_oracle_in_oracle_proxy.rtm
   ```

8. Set prices in Oracle v2 via OracleProxy.

   Note that the same manifest is used when setting prices directly in Oracle.
   We are just using OracleProxy component address and badge.

   ```sh
   manager_badge_address=${proxy_manager_badge_address} \
     manager_badge_id=${proxy_manager_badge_id} \
     oracle_component=${oracle_proxy_with_owned_component} \
     base=${xrd} quote=${usdt} price=33 \
     resim run manifests/set_prices_in_oracle.rtm

   manager_badge_address=${proxy_manager_badge_address} \
     manager_badge_id=${proxy_manager_badge_id} \
     oracle_component=${oracle_proxy_with_owned_component} \
     base=${xrd} quote=${eth} price=22 \
     resim run manifests/set_prices_in_oracle.rtm
   ```

9. Get prices via OracleProxy.

   ```sh
   oracle_proxy_component=${oracle_proxy_with_owned_component} \
     base=${xrd} quote=${eth} \
     resim run manifests/get_prices_via_oracle_proxy.rtm
   ```

### Using Oracle Generic Proxy with Oracle component as a global component

You can call a dedicated `run-oracle-generic-proxy-with-global.sh` script to get the idea how to use Oracle Generic Proxy by using following command:

```sh
./run-oracle-generic-proxy-with-global.sh

```

Alternatively, you can run the commands in the script manually.

1. Publish Oracle v1 and OracleGenericProxy components.

   ```sh
   resim publish oracle-generic-proxy-with-global
   export oracle_generic_proxy_with_global_package=<PACKAGE_ADDRESS>

   resim publish oracle-v1
   export oracle_v1_package=<PACKAGE_ADDRESS>
   ```

2. Instantiate Oracle v1 and OracleGenericProxy components.

   ```sh
   oracle_package=${oracle_generic_proxy_with_global_package} \
     blueprint_name=OracleProxy \
     manager_badge=${proxy_manager_badge} \
     resim run manifests/instantiate_component.rtm
   export ooracle_generic_proxy_with_global_component=<COMPONENT_ADDRESS>

   oracle_package=${oracle_v1_package} \
     blueprint_name=Oracle \
     manager_badge=${oracle_manager_badge} \
     resim run manifests/instantiate_component.rtm
   export oracle_v1_component=<COMPONENT_ADDRESS>
   ```

3. Set prices in Oracle v1.

   ```sh
   oracle_component=${oracle_v1_component} \
     manager_badge_address=${oracle_manager_badge_address} \
     manager_badge_id=${oracle_manager_badge_id} \
     base=${xrd} quote=${usdt} price=30 \
     resim run manifests/set_prices_in_oracle.rtm

   oracle_component=${oracle_v1_component} \
     manager_badge_address=${oracle_manager_badge_address} \
     manager_badge_id=${oracle_manager_badge_id} \
     base=${xrd} quote=${eth} price=20 \
     resim run manifests/set_prices_in_oracle.rtm
   ```

4. Set Oracle address in OracleGenericProxy.

   ```sh
   manager_badge_address=${proxy_manager_badge_address} \
     manager_badge_id=${proxy_manager_badge_id} \
     oracle_proxy_component=${oracle_generic_proxy_with_global_component} \
     oracle_component=${oracle_v1_component} \
     resim run manifests/set_oracle_address_in_oracle_proxy.rtm
   ```

5. Get prices via OracleGenericProxy.

   ```sh
   oracle_proxy_component=${oracle_generic_proxy_with_global_component} \
     base=${xrd} quote=${eth} \
     resim run manifests/get_prices_from_oracle_via_oracle_generic_proxy.rtm
   ```

6. Publish Oracle v3 component.

   ```sh
   resim publish oracle-v3
   export oracle_v3_package=<PACKAGE_ADDRESS>
   ```

7. Instantiate Oracle v3 component.

   ```sh
   oracle_package=${oracle_v3_package} \
     blueprint_name=Oracle \
     manager_badge=${oracle_manager_badge} \
     resim run manifests/instantiate_component.rtm
   export oracle_v3_component=<COMPONENT_ADDRESS>
   ```

8. Set prices and add symbols in Oracle v3.
   Oracle v3 has additional methods:

   - to specify symbol and its address
   - get address of the specified symbol (see step 10.)

   ```sh
   oracle_component=${oracle_v3_component} \
     manager_badge_address=${oracle_manager_badge_address} \
     manager_badge_id=${oracle_manager_badge_id} \
     base=${xrd} base_symbol=XRD quote=${usdt} quote_symbol=USDT price=33 \
     resim run manifests/set_prices_and_add_symbols_in_oracle_v3.rtm

   oracle_component=${oracle_v2_component} \
     manager_badge_address=${oracle_manager_badge_address} \
     manager_badge_id=${oracle_manager_badge_id} \
     base=${xrd} base_symbol=XRD quote=${eth} quote_symbol=ETH price=22 \
     resim run manifests/set_prices_and_add_symbols_in_oracle_v3.rtm
   ```

9. Set Oracle v3 address in OracleGenericProxy.

   ```sh
   manager_badge_address=${proxy_manager_badge_address} \
     manager_badge_id=${proxy_manager_badge_id} \
     oracle_proxy_component=${oracle_generic_proxy_with_global_component} \
     oracle_component=${oracle_v3_component} \
     resim run manifests/set_oracle_address_in_oracle_proxy.rtm
   ```

10. Get symbol address via OracleGenericProxy.

    ```sh
    oracle_proxy_component=${oracle_generic_proxy_with_global_component} \
      symbol=ETH \
      resim run manifests/get_symbol_address_from_oracle_v3_via_oracle_generic_proxy.rtm
    ```

11. Get prices via OracleGenericProxy.

    ```sh
    oracle_proxy_component=${oracle_generic_proxy_with_global_component} \
      base_symbol=XRD quote_symbol=ETH \
      resim run manifests/get_prices_from_oracle_v3_via_oracle_generic_proxy.rtm
    ```

# Cost overhead

Below table shows the cost overhead of a singe `get_price` method call via proxy.

| Proxy                              | Cost overhead |
| :--------------------------------- | :------------ |
| `oracle-proxy-with-global`         | < 0.19 XRD    |
| `oracle-proxy-with-owned`          | < 0.19 XRD    |
| `oracle-generic-proxy-with-global` | < 0.19 XRD    |

NOTE!
The cost overhead highly depepends on the complexity of the arguments and return values of proxied methods,
which are decoded/encoded from/into ScryptoValue.

## License

The Radix Official Examples code is released under Radix Modified MIT License.

    Copyright 2024 Radix Publishing Ltd

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software for non-production informational and educational purposes without
    restriction, including without limitation the rights to use, copy, modify,
    merge, publish, distribute, sublicense, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    This notice shall be included in all copies or substantial portions of the
    Software.

    THE SOFTWARE HAS BEEN CREATED AND IS PROVIDED FOR NON-PRODUCTION, INFORMATIONAL
    AND EDUCATIONAL PURPOSES ONLY.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE, ERROR-FREE PERFORMANCE AND NONINFRINGEMENT. IN NO
    EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES,
    COSTS OR OTHER LIABILITY OF ANY NATURE WHATSOEVER, WHETHER IN AN ACTION OF
    CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE, MISUSE OR OTHER DEALINGS IN THE SOFTWARE. THE AUTHORS SHALL
    OWE NO DUTY OF CARE OR FIDUCIARY DUTIES TO USERS OF THE SOFTWARE.
