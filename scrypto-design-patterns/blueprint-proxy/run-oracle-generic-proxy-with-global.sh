#!/bin/bash

set -e

echo -e "\n1. Publish  Oracle v1 and OracleGenericProxy components."
output=`resim publish oracle-generic-proxy-with-global`
echo "$output"
package=`echo "$output" | grep "New Package" | grep -o "package_.*"`
resim show $package
export oracle_generic_proxy_with_global_package=$package

output=`resim publish oracle-v1`
echo "$output"
package=`echo "$output" | grep "New Package" | grep -o "package_.*"`
resim show $package
export oracle_v1_package=$package

echo -e "\n2. Instantiate Oracle v1 and OracleGenericProxy components."

output=`oracle_package=${oracle_generic_proxy_with_global_package} \
  blueprint_name=OracleGenericProxy \
  manager_badge=${proxy_manager_badge} \
  resim run manifests/instantiate_component.rtm`
component=`echo "$output" | grep "Component:" | grep -o "component_.*"`
resim show $component
export oracle_generic_proxy_with_global_component=$component

output=`oracle_package=${oracle_v1_package} \
  blueprint_name=Oracle \
  manager_badge=${oracle_manager_badge} \
  resim run manifests/instantiate_component.rtm`
component=`echo "$output" | grep "Component:" | grep -o "component_.*"`
resim show $component
export oracle_v1_component=$component

echo -e "\n3. Set prices in Oracle v1."

oracle_component=${oracle_v1_component} \
  manager_badge_address=$oracle_manager_badge_address \
  manager_badge_id=$oracle_manager_badge_id \
  base=${xrd} quote=${usdt} price=30 \
  resim run manifests/set_prices_in_oracle.rtm

oracle_component=${oracle_v1_component} \
  manager_badge_address=$oracle_manager_badge_address \
  manager_badge_id=$oracle_manager_badge_id \
  base=${xrd} quote=${eth} price=20 \
  resim run manifests/set_prices_in_oracle.rtm

echo -e "\n4. Set Oracle address in OracleGenericProxy."

manager_badge_address=${proxy_manager_badge_address} \
  manager_badge_id=${proxy_manager_badge_id} \
  oracle_proxy_component=${oracle_generic_proxy_with_global_component} \
  oracle_component=${oracle_v1_component} \
  resim run manifests/set_oracle_address_in_oracle_proxy.rtm

echo -e "\n5. Get prices via OracleGenericProxy."

oracle_proxy_component=${oracle_generic_proxy_with_global_component} \
  base=${xrd} quote=${eth} \
  resim run manifests/get_prices_from_oracle_via_oracle_generic_proxy.rtm

echo -e "\n6. Publish Oracle v3 component."

output=`resim publish oracle-v3`
echo "$output"
package=`echo "$output" | grep "New Package" | grep -o "package_.*"`
resim show $package
export oracle_v3_package=$package

echo -e "\n7. Instantiate Oracle v3 component."

output=`oracle_package=${oracle_v3_package} \
  blueprint_name=Oracle \
  manager_badge=${oracle_manager_badge} \
  resim run manifests/instantiate_component.rtm`
component=`echo "$output" | grep "Component:" | grep -o "component_.*"`
resim show $component
export oracle_v3_component=$component

echo -e "\n8. Set prices and add symbols in Oracle v3."

oracle_component=${oracle_v3_component} \
  manager_badge_address=$oracle_manager_badge_address \
  manager_badge_id=$oracle_manager_badge_id \
  base=${xrd} base_symbol=XRD quote=${usdt} quote_symbol=USDT price=33 \
  resim run manifests/set_prices_and_add_symbols_in_oracle_v3.rtm

oracle_component=${oracle_v3_component} \
  manager_badge_address=$oracle_manager_badge_address \
  manager_badge_id=$oracle_manager_badge_id \
  base=${xrd} base_symbol=XRD quote=${eth} quote_symbol=ETH price=22 \
  resim run manifests/set_prices_and_add_symbols_in_oracle_v3.rtm

echo -e "\n9. Set Oracle v3 address in OracleGenericProxy."

manager_badge_address=${proxy_manager_badge_address} \
  manager_badge_id=${proxy_manager_badge_id} \
  oracle_proxy_component=${oracle_generic_proxy_with_global_component} \
  oracle_component=${oracle_v3_component} \
  resim run manifests/set_oracle_address_in_oracle_proxy.rtm

echo -e "\n10. Get symbol address via OracleGenericProxy."

oracle_proxy_component=${oracle_generic_proxy_with_global_component} \
  symbol=ETH \
  resim run manifests/get_symbol_address_from_oracle_v3_via_oracle_generic_proxy.rtm

echo -e "\n11. Get prices via OracleGenericProxy."

oracle_proxy_component=${oracle_generic_proxy_with_global_component} \
  base_symbol=XRD quote_symbol=ETH \
  resim run manifests/get_prices_from_oracle_v3_via_oracle_generic_proxy.rtm
