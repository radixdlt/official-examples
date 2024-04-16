# 12. Hello Non-Fungible

So far this series of examples has only focused on fungible resources. This will
be our first look at non-fungibles.

By making some small changes to our starting Hello example, we can create it
with a non-fungible instead of a fungible resource. That resource can then be
obtained with the same `free_token` method as we used in the original example.

- [Running the Example](#running-the-example)

## Running the Example

Running the example is much the same as the running the original Hello example:

0.  First, (optionally) reset the simulator and create a new account.

    ```sh
    resim reset

    resim new-account

    resim show <ACCOUNT_ADDRESS>
    ```

1.  Clone the repository if you have not done so, and then change directory to
    this example.

    ```sh
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/11-hello-non-fungible
    ```

2.  Then, publish the package and save the package address.

    ```sh
    resim publish .
    ```

3.  Use the package address to instantiate the component.

    ```sh
    resim call-function <PACKAGE_ADDRESS> Hello instantiate_hello
    ```

4.  This is a good opportunity to check the state of the component. You should
    see the `HNF` non-fungibles with the initial supply of 5, each with a
    different local id.

    ```sh
    resim show <COMPONENT_ADDRESS>
    ```

5.  Now we can transfer one of the non-fungibles to our account.

    ```sh
    resim call-method <COMPONENT_ADDRESS> free_token
    ```

6.  Finally, we can check the state of our account to see that we now have the
    non-fungible.

        ```sh
        resim show <ACCOUNT_ADDRESS>
        ```

Unfortunately resim doesn't yet support showing individual non-fungibles and the
data on them. You will eventually be able to examine non-fungibles using their
global resource addresses (resource address followed by the local id) like so:

```sh
# Not yet supported
resim show <RESOURCE_ADDRESS>:<NON_FUNGIBLE_LOCAL_ID>
```
