#!/bin/bash

set -e

echo -e "\n1. Publish  Oracle v1 and OracleProxy components."
output=`resim publish oracle-proxy-with-global`
echo "$output"
package=`echo "$output" | grep "New Package" | grep -o "package_.*"`
resim show $package
export oracle_proxy_with_global_package=$package

output=`resim publish oracle-v1`
echo "$output"
package=`echo "$output" | grep "New Package" | grep -o "package_.*"`
resim show $package
export oracle_v1_package=$package

echo -e "\n2. Instantiate Oracle v1 and OracleProxy components."

output=`oracle_package=${oracle_proxy_with_global_package} \
  blueprint_name=OracleProxy \
  manager_badge=${proxy_manager_badge} \
  resim run manifests/instantiate_component.rtm`
component=`echo "$output" | grep "Component:" | grep -o "component_.*"`
resim show $component
export oracle_proxy_with_global_component=$component

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

echo -e "\n4. Set Oracle address in OracleProxy."

manager_badge_address=${proxy_manager_badge_address} \
  manager_badge_id=${proxy_manager_badge_id} \
  oracle_proxy_component=${oracle_proxy_with_global_component} \
  oracle_component=${oracle_v1_component} \
  resim run manifests/set_oracle_address_in_oracle_proxy.rtm

echo -e "\n5. Get prices via OracleProxy."

oracle_proxy_component=${oracle_proxy_with_global_component} \
  base=${xrd} quote=${eth} \
  resim run manifests/get_prices_via_oracle_proxy.rtm

echo -e "\n6. Publish Oracle v2 component."

output=`resim publish oracle-v2`
echo "$output"
package=`echo "$output" | grep "New Package" | grep -o "package_.*"`
resim show $package
export oracle_v2_package=$package

echo -e "\n7. Instantiate Oracle v2 component."

output=`oracle_package=${oracle_v2_package} \
  blueprint_name=Oracle \
  manager_badge=${oracle_manager_badge} \
  resim run manifests/instantiate_component.rtm`
component=`echo "$output" | grep "Component:" | grep -o "component_.*"`
resim show $component
export oracle_v2_component=$component

echo -e "\n8. Set prices in Oracle v2."

oracle_component=${oracle_v2_component} \
  manager_badge_address=$oracle_manager_badge_address \
  manager_badge_id=$oracle_manager_badge_id \
  base=${xrd} quote=${usdt} price=33 \
  resim run manifests/set_prices_in_oracle.rtm

oracle_component=${oracle_v2_component} \
  manager_badge_address=$oracle_manager_badge_address \
  manager_badge_id=$oracle_manager_badge_id \
  base=${xrd} quote=${eth} price=22 \
  resim run manifests/set_prices_in_oracle.rtm

echo -e "\n9. Set Oracle v2 address in OracleProxy."

manager_badge_address=${proxy_manager_badge_address} \
  manager_badge_id=${proxy_manager_badge_id} \
  oracle_proxy_component=${oracle_proxy_with_global_component} \
  oracle_component=${oracle_v2_component} \
  resim run manifests/set_oracle_address_in_oracle_proxy.rtm

echo -e "\n10. Get prices via OracleProxy."

oracle_proxy_component=${oracle_proxy_with_global_component} \
  base=${xrd} quote=${eth} \
  resim run manifests/get_prices_via_oracle_proxy.rtm
