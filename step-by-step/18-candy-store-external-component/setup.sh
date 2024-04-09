echo "Setting up Scrypto Environment and Package"

echo "\nResetting radix engine simulator..." 
resim reset

echo "\nCreating new account..."
temp_account=`resim new-account`
echo "$temp_account"
export account=`echo "$temp_account" | grep Account | grep -o "account_.*"`
export privatekey=`echo "$temp_account" | grep Private | sed "s/Private key: //"`
export account_badge=`echo "$temp_account" | grep Owner | grep -o "resource_.*"`
export xrd=`resim show $account | grep XRD | grep -o "resource_.\S*" | sed -e "s/://"`

echo "\nPublishing package 1..."
export package1=`resim publish ./1-gumball-machine | sed "s/Success! New Package: //"`

echo "\nInstantiating component 1..."
export component1=`resim run manifests/instantiate_gumball_machine.rtm | grep "Component" | grep -o "component_.*"`
export component1_badge=`resim show $account | grep 'Gumball Machine Owner Badge' | grep -o "resource_.\S*" | sed -e "s/://"`

echo "\nSetup Complete"
echo "--------------------------"
echo "Environment variables set:"
echo "account = $account"
echo "privatekey = $privatekey"
echo "account_badge = $account_badge"
echo "xrd = $xrd"
echo "package1 = $package1"
echo "component1 = $component1"
echo "component1_badge = $component1_badge"