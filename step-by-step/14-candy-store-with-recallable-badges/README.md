# 14. Candy Store with Recallable Badges

It's time to introduce some more resource behaviors. In this example, we add the
ability to recall and burn staff badges to our candy store, as we don't want
staff that stop working for us to keep their badges. We do this in a different
way to past behaviours. Instead of adding a new method the recall action is
described purely in a transaction manifest. We need to add some new permissions
to the staff badge resource to allow this to happen though.

- [Using the Candy Store with Recallable Badges](#using-the-candy-store-with-recallable-badges)
  - [Setup](#setup)
  - [Use](#use)

## Using the Candy Store with Recallable Badges

### Setup

1. First, clone the repository if you have not done so, and then change
   directory to this example.

   ```
   git clone https://github.com/radixdlt/official-examples.git

   cd official-examples/step-by-step/13-candy-store-with-recallable-badges
   ```

2. Run the setup script.

   On Linux or MacOS:

   ```sh
   cd 13-candy-store-with-recallable-badges
   source ./setup.sh
   ```

   On Windows:

   ```dos
   cd 13-candy-store-with-recallable-badges
   ./setup.bat
   ```

3. Instantiate the component by using the `instantiate_candy_store.rtm`
   manifest:

   You may wish to modify the candy and chocolate prices in the manifest before
   running it.

   ```sh
   resim run manifests/instantiate_candy_store.rtm
   ```

4. Export the component address, owner and manager badge addresses. These will
   be displayed in the output of the previous command. The badges can also be
   found with their symbols when inspecting the default account
   (`resim show $account`).

   ```sh
   export component=<YOUR COMPONENT ADDRESS>
   export owner_badge=<YOUR OWNER BADGE ADDRESS>
   export manager_badge=<YOUR MANAGER BADGE ADDRESS>
   ```

### Use

4. Mint a staff badge and inspect it in your account

   ```sh
   resim run manifests/mint_staff_badge.rtm
   resim show $account
   ```

5. Export the staff badge address:

   ```sh
   export staff_badge=<YOUR STAFF BADGE ADDRESS>
   ```

   Also, make a note of the staff badge local ID (including hashes). If you
   haven't changed the minting manifest it will be `#1#`.

6. Create a second account to transfer the staff badge to and export its address

   ```sh
   resim new-account
   export account2=<YOUR SECOND ACCOUNT ADDRESS>
   ```

7. Transfer the staff badge to the second account

   ```sh
   resim transfer $staff_badge:1 $account2
   ```

8. Look for the vault address the staff badge was transferred to in the

   transaction log. It will start with `internal_vault_` and will have a `+`
   with the staff badge local ID appended to it. Export this address as `vault`

   ```sh
    export vault=<YOUR STAFF BADGE VAULT ADDRESS>
   ```

9. You may check that the staff badge was transferred to the second account by

   inspecting the vault

```sh
resim show $account2
```

10. Recall the staff badge from the second account. Make sure the local ID in

    `recall_staff_badge.rtm` is correct then:

    ```sh
    resim run manifests/recall_staff_badge.rtm
    ```

11. Check that the staff badge was recalled and burned by inspecting the

    accounts again.

    ```sh
    resim show $account
    resim show $account2
    ```

The other methods of the candy store should work as they did in the previous
example.

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
