# Hello Token

This projects contains example code to demonstrate the following core token concepts.
- Fungible Token Creation with & without initial supply
    - 
    - Mintable Tokens
    - Burnable Tokens
    - Recallable Tokens
    - Transient Tokens
    - Soulbound Tokens
    - Freezable Tokens
    - The Works

- Implementing Resource Behaviors
    - 
    - Simple Minting Method
    - Simple Burn Method
    - Recall Method
    - Transient Method
    - Soulbound Method
    - Freezable Method
    - The Works

- Using Manifest Instructions
    - 
    - Create all example tokens manifest
    - MINT_FUNGIBLE
    - CREATE_FUNGIBLE_RESOURCE
    - BURN_RESOURCE

For an exhastive list of all the options you can see the Instruction enum [here](https://github.com/radixdlt/radixdlt-scrypto/blob/6ab3fab9ca88788a6753649b553ea3b1b3a5e31f/transaction/src/manifest/ast.rs), just keep in mind there is a [parser](https://github.com/radixdlt/radixdlt-scrypto/blob/6ab3fab9ca88788a6753649b553ea3b1b3a5e31f/transaction/src/manifest/parser.rs#L111) that translates these to all caps when using in a transaction manifest. You can also find a sizeable set of manifest format examples in the docs [here](https://docs.radixdlt.com/docs/specifications).