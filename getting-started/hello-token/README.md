# Hello Token

This projects contains example code to demonstrate the following core token concepts.
- Fungible Token Creation
    - 
    - With initial supply
    - Without initial supply
    - Mintable
    - Burnable

- Implementing Resource Behaviors
    - 
    - Simple Minting Method
    - Simple Burn Method

- Using Manifest Instructions
    - 
    - MINT_FUNGIBLE
    - CREATE_FUNGIBLE_RESOURCE
    - BURN_RESOURCE

For an exhastive list of all the options you can see the Instruction enum [here](https://github.com/radixdlt/radixdlt-scrypto/blob/6ab3fab9ca88788a6753649b553ea3b1b3a5e31f/transaction/src/manifest/ast.rs), just keep in mind there is a [parser](https://github.com/radixdlt/radixdlt-scrypto/blob/6ab3fab9ca88788a6753649b553ea3b1b3a5e31f/transaction/src/manifest/parser.rs#L111) that translates these to all caps when using in a transaction manifest. You can also find a sizeable set of manifest format examples in the docs [here](https://docs.radixdlt.com/docs/specifications).