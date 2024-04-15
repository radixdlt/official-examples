# 4. Build a Gumball Machine

A Radix favorite, this example covers the creation of a simple gumball machine,
which allows users to purchase a gumball in exchange for XRD.

In addition to the most basic operation, this particular example allows
instantiators to set the price (in XRD) of each gumball, and permits callers to
submit more than the exact price required. Callers will receive their change (if
any) in addition to their tasty gumball.

- [Using the Gumball Machine](#using-the-gumball-machine)
- [`resim` Makes Things Easy](#resim-makes-things-easy)

## Using the Gumball Machine

To use the Gumball machine in the Radix Engine Simulator, we'll need to:

1. Clone the repository if you have not done so, and then change directory to
   this example.

   ```
   git clone https://github.com/radixdlt/official-examples.git

   cd official-examples/step-by-step/04-gumball-machine
   ```

2. Publish the package

   ```
   resim publish .
   ```

3. Instantiate the gumball machine

   ```
   resim call-function <PACKAGE_ADDRESS> GumballMachine instantiate_gumball_machine <PRICE>

   resim show <COMPONENT_ADDRESS>

   ```

   Note the number of `GUM` tokens in the `Owned Fungible Resources` section of
   the output.

4. Fetch the price from the component

   ```
   resim call-method <COMPONENT_ADDRESS> get_price
   ```

   Look at the `Outputs` section of the response to see the price.

5. Buy a gumball

   ```
    resim call-method <COMPONENT_ADDRESS> buy_gumball <XRD_RESOURCE_ADDRESS>:<AMOUNT>

    resim show <ACCOUNT_ADDRESS>

    resim show <COMPONENT_ADDRESS>

   ```

   _where the `<XRD_RESOURCE_ADDRESS>` is
   `resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3`_

   You will see that one gumball has been transferred from the `GumaballMachine`
   component to your account, and the price of the gumball has been transferred
   from your account to the GumballMachine component. If you provided more XRD
   than the price of the gumball, you will also see that the change has been
   returned to your account.

## `resim` Makes Things Easy

To make things easy `resim` hides some steps from us, steps in the form of
transaction manifests. A transaction manifest is a list of instructions that
must be submitted to the network for the transaction to take place.

`resim` automatically generates and submits these manifest files for us. We will
revisit this in later examples but, if you'd like to see these hidden manifest
you can add the `--manifest` flag to the `resim` command.

Try it out with,

```
resim call-method <COMPONENT_ADDRESS> buy_gumball --manifest manifest.rtm
```

This will output the manifest file to `manifest.rtm` in the current directory,
where you can inspect it.
