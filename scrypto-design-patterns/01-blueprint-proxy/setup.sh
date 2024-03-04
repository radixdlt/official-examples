#!/bin/bash

echo -e "\n1. Create a new account and export the account address and owner badge."
#export account=account_sim1c956qr3kxlgypxwst89j9yf24tjc7zxd4up38x37zr6q4jxdx9rhma
#export owner_badge=resource_sim1nfzf2h73frult99zd060vfcml5kncq3mxpthusm9lkglvhsr0guahy:#1#

temp_account=`resim new-account`
echo "$temp_account"

export account=`echo "$temp_account" | grep Account | grep -o "account_.*"`
export privatekey=`echo "$temp_account" | grep Private | sed "s/Private key: //"`

export owner_badge=`echo "$temp_account" | grep Owner | grep -o "resource_.*"`
export owner_badge_address=`echo "$owner_badge" | cut -f1 -d":"`
export owner_badge_id=`echo "$owner_badge" | cut -f2 -d":"`

resim set-default-account $account $privatekey $owner_badge


echo -e "\n2. Create badges for managing the Oracle and Oracle Proxy components and export their addresses and ids."

resim new-simple-badge --name 'Proxy Manager Badge'
resim new-simple-badge --name 'Oracle Manager Badge'

export proxy_manager_badge_address=`resim show | grep "Proxy Manager Badge" | grep -o "resource_.*" | awk -F":" '{print $1}'`
export proxy_manager_badge_id=`resim show | grep -A1 "Proxy Manager Badge" | tail -n1 | awk '{print $2}'`
export proxy_manager_badge=${proxy_manager_badge_address}:${proxy_manager_badge_id}

export oracle_manager_badge_address=`resim show | grep "Oracle Manager Badge" | grep -o "resource_.*" | awk -F":" '{print $1}'`
export oracle_manager_badge_id=`resim show | grep -A1 "Oracle Manager Badge" | tail -n1 | awk '{print $2}'`
export oracle_manager_badge=${oracle_manager_badge_address}:${oracle_manager_badge_id}

echo -e "\n3. Mint some tokens and export their addresses."

echo "Mint ETH"
token=`resim new-token-fixed --name "Ethereum" --symbol "ETH" 1000000`
echo "Mint USDT"
token=`resim new-token-fixed --name "Usdt" --symbol "USDT" 1000000`

export xrd=`resim show $account | grep XRD | grep -o "resource_.*" | cut -f1 -d":"`
export eth=`resim show $account | grep ETH | grep -o "resource_.*" | cut -f1 -d":"`
export usdt=`resim show $account | grep USDT | grep -o "resource_.*" | cut -f1 -d":"`

echo -e "\n\nAccount details"
resim show
