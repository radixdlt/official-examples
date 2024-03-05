#!/bin/bash

set -e

echo -e "\n1. Publish Oracle v1 and OracleProxy components."
output=`resim publish oracle-proxy-with-owned`
echo "$output"
package=`echo "$output" | grep "New Package" | grep -o "package_.*"`
resim show $package
export oracle_proxy_with_owned_package=$package

output=`resim publish oracle-v1`
echo "$output"
package=`echo "$output" | grep "New Package" | grep -o "package_.*"`
resim show $package
export oracle_v1_package=$package

echo -e "\n2. Instantiate OracleProxy component."

output=`oracle_package=${oracle_proxy_with_owned_package} \
  blueprint_name=OracleProxy \
  manager_badge=${proxy_manager_badge} \
  resim run manifests/instantiate_component.rtm`
component=`echo "$output" | grep "Component:" | grep -o "component_.*"`
resim show $component
export oracle_proxy_with_owned_component=$component

echo -e "\n3. Initialize Oracle v1 in OracleProxy."

# OracleProxy instantiates Oracle v1 becoming its owner.
manager_badge_address=${proxy_manager_badge_address} \
  manager_badge_id=${proxy_manager_badge_id} \
  oracle_proxy_component=${oracle_proxy_with_owned_component} \
  oracle_package=${oracle_v1_package} \
  resim run manifests/initialize_oracle_in_oracle_proxy.rtm

echo -e "\n4. Set prices in Oracle v1 via OracleProxy."

# Note that the same manifest is used when setting prices directly in Oracle.
# We are just using OracleProxy component address and badge.
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

echo -e "\n5. Get prices via OracleProxy."

oracle_proxy_component=${oracle_proxy_with_owned_component} \
  base=${xrd} quote=${eth} \
  resim run manifests/get_prices_via_oracle_proxy.rtm

echo -e "\n6. Publish Oracle v2 component."

output=`resim publish oracle-v2`
echo "$output"
package=`echo "$output" | grep "New Package" | grep -o "package_.*"`
resim show $package
export oracle_v2_package=$package

echo -e "\n7. Initialize Oracle v2 in OracleProxy."

# OracleProxy instantiates Oracle v1 becoming its owner.
manager_badge_address=${proxy_manager_badge_address} \
  manager_badge_id=${proxy_manager_badge_id} \
  oracle_proxy_component=${oracle_proxy_with_owned_component} \
  oracle_package=${oracle_v2_package} \
  resim run manifests/initialize_oracle_in_oracle_proxy.rtm

echo -e "\n8. Set prices in Oracle v2 via OracleProxy."

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

echo -e "\n9. Get prices via OracleProxy."

oracle_proxy_component=${oracle_proxy_with_owned_component} \
  base=${xrd} quote=${eth} \
  resim run manifests/get_prices_via_oracle_proxy.rtm
