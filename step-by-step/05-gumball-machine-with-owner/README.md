# 5. Gumball Machine with an Owner

This example builds on top of the previous Gumball Machine example. Here we've
added an owner to the gumball machine. With an owner we can provide a way to
actually retrieve the collected XRD! This was done by adding a withdrawal method
that's protected by an owner badge, which ensures that only the possessor of the
badge is able to perform the withdrawal. We've also added a method to change the
price of the gumballs, similarly protected by the owner badge.

- [Using the Gumball Machine as an Owner](#using-the-gumball-machine-as-an-owner)
  - [Setup](#setup)
  - [Usage](#usage)

## Using the Gumball Machine as an Owner

### Setup

0.  First, (optionally) reset the simulator and create a new account.

    ```
    resim reset

    resim new-account

    resim show <ACCOUNT_ADDRESS>
    ```

1.  Then, clone the repository if you have not done so, and change directory to
    this example.

    ```
    git clone https://github.com/radixdlt/official-examples.git

    cd official-examples/step-by-step/05-gumball-machine-with-owner
    ```

2.  Next, publish the package and save the package address.

    ```
    resim publish .
    ```

3.  Use the package address to instantiate the gumball machine, choosing a price
    for the gumballs.

    ```
    resim call-function <PACKAGE_ADDRESS> GumballMachine instantiate_gumball_machine <PRICE>
    ```

    The owner badge is created automatically when the gumball machine is
    instantiated. The badge will be in your account.

4.  Inspect your account looking at the `Owned Fungible Resources` section.

    ```
    resim show <ACCOUNT_ADDRESS>
    ```

    You should see the badge listed with symbol `OWN`. Make a note of the
    resource address for use later.

### Usage

1.  Start by buying a gumball.

    ```
    resim call-method <COMPONENT_ADDRESS> buy_gumball <XRD_RESOURCE_ADDRESS>:<AMOUNT>
    ```

    _Where the xrd address is
    `resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3`_

    This will return a gumball and the change to your account.

2.  Update the price of the gumball. This will fail without proof of ownership.

    ```
    resim call-method <COMPONENT_ADDRESS> set_price <NEW_PRICE>
    ```

3.  Try again presenting proof of ownership, the owner badge.

    ```
    resim call-method <COMPONENT_ADDRESS> set_price <NEW_PRICE> --proofs <OWNER_BADGE_ADDRESS>:1
    ```

    > To see the transaction manifest for presenting this proof, add
    > `--manifest manifest.rtm` flag to the command and view the generated file.

4.  Check the updated price.

    ```
    resim call-method <COMPONENT_ADDRESS> get_status
    ```

    You should see the new price in the `Outputs` section of the response.

5.  Buy another gumball at the new price.

    ```
    resim call-method <COMPONENT_ADDRESS> buy_gumball <XRD_RESOURCE_ADDRESS>:<AMOUNT>
    ```

6.  Check the gumball machine to see the earnings it's built up and the number
    of gumballs left.

    ```
    resim show <COMPONENT_ADDRESS>
    ```

    As the owner, you will want to collect your earnings and refill the machine.

7.  First let's withdraw the earnings, again presenting our proof of ownership.

    ```
    resim call-method <COMPONENT_ADDRESS> withdraw_earnings --proofs <OWNER_BADGE_ADDRESS>:1
    ```

8.  Now if you check your account balance you will see that you've collected the
    earnings.

    ```
    resim show <ACCOUNT_ADDRESS>
    ```

We've successfully used the gumball machine and collected our earnings.
Collecting our earning can only be done with the owner badge in our account.

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
