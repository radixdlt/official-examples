# 3. Create A Custom Resource

One of the greatest strengths of Scrypto as part of the Radix stack is it's use
of native assets. Native assets are the way things like tokens, NFTs, badges,
pool units (also known as “LP tokens”), and much more are represented on the
Network. In Radix Engine terms, native assets are called _resources_.

Resources are the basis of all transaction on the Radix network and have
guaranteed behaviors that are provided by the system, meaning they intuitively
follow the same behaviour as real-world physical objects.

This example shows how use Scrypto code and the Radix Engine simulator (`resim`)
to create and customise fungible resources.

- [Using the Component](#using-the-component)
- [Multiple Components from One Blueprint](#multiple-components-from-one-blueprint)

## Using the Component

We can publish the package and create components that produce resources with
custom names and symbols.

1. Clone the repository if you have not done so, and then change directory to
   this example.

   ```
   git clone https://github.com/radixdlt/official-examples.git

   cd official-examples/step-by-step/03-create-a-custom-resource
   ```

2. Publish the new package. First make sure you are in the correct directory.
   Then,

   ```
   resim publish .
   ```

   Save the package address.

3. Instantiate a new component with a custom name and symbol.

   ```
   resim call-function <PACKAGE_ADDRESS> Hello instantiate_hello "My Token" "MT"
   ```

   Save the `Component` and `Resource` addresses printed in the `New Entities`
   section of the output.

4. View the new resource metadata with,

   ```
   resim show <RESOURCE_ADDRESS>
   ```

   You should see the new name and symbol in `Metadata` section.

## Multiple Components from One Blueprint

Now that we have parameterized our blueprint, we can instantiate multiple
components from it that produce different resources.

5. Instantiate a second `Hello` component with a different token name and symbol

   ```
   resim call-function <PACKAGE_ADDRESS> Hello instantiate_hello "New Token" "NT"
   ```

   Again, save the component and resource addresses in `New Entities` section of
   the output. You may choose to inspect the metadata of the new resource too.

6. Send one of the new `NT` tokens to our account.

   ```
   resim call-method <NEW_COMPONENT_ADDRESS> free_token
   ```

7. Send one of the previous `MT` tokens to our account.

   ```
    resim call-method <FIRST_COMPONENT_ADDRESS> free_token
   ```

8. Check the account balances again.

   ```
   resim show <ACCOUNT_ADDRESS>
   ```

   You should see that you now have 1 of each of the new tokens in the
   `Owned Fungible Resources` section.

We have successfully created two different resources from two different
components from the same blueprint.
