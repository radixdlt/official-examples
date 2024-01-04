# 12. Candy Store

It's time to introduce some more resource behaviors. In this example, we will
add to our candy store the ability to recall and burn staff badges. We don't
want staff that stop working for us to keep their badges. We'll do this in a
different way to past behaviours. Instead of adding a new method the recall
action will be described purely in a transaction manifest. We will need to add
some new permissions to the staff badge resource to allow this to happen though.

- [Recallable and Burnable Resources](#recallable-and-burnable-resources)
- [Making Staff Badges Non-Fungible](#making-staff-badges-non-fungible)
- [Using the Candy Store with Recallable Badges](#using-the-candy-store-with-recallable-badges)
  - [Setup](#setup)
  - [Use](#use)

## Recallable and Burnable Resources

By default tokens can neither be recalled nor are they burnable. Adding these
behaviours will allow us to bring a token to us from another vault and allow us
to burn/destroy it. If we want to add these behaviors we do it the same way the
mintable behaviour (or any others) would be, by adding roles for each.

```rust
    let staff_badges_manager =
            // stripped
            .recall_roles(recall_roles! {
                recaller => rule!(
                    require(owner_badge.resource_address()) ||
                    require(manager_badge.resource_address())
                );
                recaller_updater => rule!(deny_all);
            })
            .burn_roles(burn_roles! {
                burner => rule!(
                    require(owner_badge.resource_address()) ||
                    require(manager_badge.resource_address())
                );
                burner_updater => rule!(deny_all);
            })
            .create_with_no_initial_supply();
```

The rules for these roles are a little different to the mint roles we added in
previous examples. They accept either the owner or manager badges as
authorisation, rather than the component's address. Recall and burn therefore
can't and won't be called by any of the component's methods. They will instead
be called on the vault containing the staff badge and the recalled badge bucket
respectively, sown in the `recall_staff_badge.rtm` transaction manifest here:

```
RECALL_NON_FUNGIBLES_FROM_VAULT
    Address("${vault}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("#1#"),
    )
;
```

And here:

```
BURN_RESOURCE
    Bucket("staff_badge_bucket")
;
```

This is another way we can interact with resources in the radix engine. If they
have rules that allow it, we can call them directly from the transaction
manifest. A full list of the available manifest actions can be found in the
[Manifest Instructions](https://docs.radixdlt.com/v1/docs/manifest-instructions)
section of the docs.

## Making Staff Badges Non-Fungible

We've also made the staff badges non-fungible. This change from the previous
candy store, allows us to assign the badges to specific staff members and more
easily identify and track them.

To make this change we added a struct for the staff badge non-fungible data:

```rust
#[derive(NonFungibleData, ScryptoSbor, Clone)]
struct StaffBadge {
    employee_number: u64,
    employee_name: String,
}
```

Then we changed the staff badge to create a non-fungible resource using the new
struct and the `new_integer_non_fungible` method:

```rust
    let staff_badges_manager =
        ResourceBuilder::new_integer_non_fungible::<StaffBadge>(OwnerRole::None)
            // stripped
            .create_with_no_initial_supply();
```

Changing the staff badge creation to `create_with_no_initial_supply()` also
means it now produces a `ResourceManager` instead of the `Bucket`
`mint_initial_supply()` produces. There are a few more minor simplification to
the instantiate function you might notice that account for this.

More significantly, the change to non-fungible staff badges means we need to
change the minting method. It now takes 2 arguments, the name and number of the
employee, which become the stored non-fungible data. The number is also used as
the local ID for the non-fungible, so must be unique. The function is now:

```rust
    pub fn mint_staff_badge(&mut self, name: String, number: u64) -> Bucket {
        let staff_badge_bucket: Bucket = self.staff_badge_resource_manager.mint_non_fungible(
            &NonFungibleLocalId::Integer(number.into()),
            StaffBadge {
                employee_number: number,
                employee_name: name,
            },
        );
        staff_badge_bucket
    }
```

## Using the Candy Store with Recallable Badges

### Setup

1. Run the setup script.

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

2. Instantiate the component by using the `instantiate_candy_store.rtm`
   manifest:

   You may wish to modify the candy and chocolate prices in the manifest before
   running it.

   ```sh
   resim run manifests/instantiate_candy_store.rtm
   ```

3. Export the component address, owner and manager badge addresses. These will
   be displayed in the output of the previous command. The badges can also be
   found with their symbols when inspecting the default account
   (`resim show $account`).

   ```sh
   export component=<YOUR COMPONENT ADDRESS>
   export owner_badge=<YOUR OWNER BADGE ADDRESS>
   export manager_badge=<YOUR MANAGER BADGE ADDRESS>
   ```

### Use

4. mint a staff badge and inspect it in your account

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

6. create a second account to transfer the staff badge to and export its address

   ```sh
   resim new-account
   export account2=<YOUR SECOND ACCOUNT ADDRESS>
   ```

7. transfer the staff badge to the second account

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
