# Yield Amm dApp

This dApp is developed using React JS, leveraging the foundational [Radix React JS dApp template](https://github.com/radixdlt/official-examples/tree/main/getting-started/react-js-dapp). This template provides a robust starting point for building React-based dApps on the Radix network. Key functionalities integrated from this template include the `react-connect-button` and `useSendTransaction` hook, which facilitate user interaction and transaction processing respectively. This setup ensures that the dApp maintains consistency with Radix development standards while providing a reliable and user-friendly interface.


All code in this repository is licensed under the modified MIT license described in [LICENSE](#license).

You can find the Official Radix Documentation site at [docs.radixdlt.com](https://docs.radixdlt.com/docs)

## Table of Contents
- [Main components](#main-components)

- [Running the DApp](#running-the-dapp)

- [Setup Guide](#setup-guide)
  - [Pre-requisites](#pre-requisites)

  - [Deploying Yield Tokenizer](#deploying-yield-tokenizer)

  - [Deploying AMM](#deploying-amm)

  - [Configuring the DApp Environment](#configuring-the-dapp-environment)

  - [InteractING with the dApp](#interacting-with-the-dapp)

  - [Other functions](#other-functions)

## Main components

This section outlines the main components utilized in the dApp. These components are essential for the operational functionality but do not include details on web application creation.

- **components/ButtonTransaction.jsx**
  - A crucial component that, depending on the properties it receives, sends the appropriate Transaction Manifest to the stokenet using the `useSendTransaction.js` hook.

- **utils/GenerateTransactionManifest.js**
  - This utility file generates transaction manifests according to the templates provided at:
    - [Yield AMM Transaction Manifests](https://github.com/radixdlt/official-examples/tree/main/scrypto-design-patterns/yield_amm/amm/transaction_manifest)
    - [Yield Tokenizer Transaction Manifests](https://github.com/radixdlt/official-examples/tree/main/scrypto-design-patterns/yield_amm/yield_tokenizer/transaction_manifest)

- **utils/amm/**
  - This directory contains the `Dex.js` and `LiquidityCurve.js`, which are arithmetic functions migrated from the Scrypto packages located at:
    - [Yield AMM Source](https://github.com/radixdlt/official-examples/tree/main/scrypto-design-patterns/yield_amm/amm/src)

- **hooks/useGetEntityDetails.js**
  - This hook is used to retrieve aggregated vault data related to entities from the [Gateway API](https://www.npmjs.com/package/@radixdlt/babylon-gateway-api-sdk), primarily used to obtain AMM information and non-fungible tokens from the selected account.

- **hooks/useGetNonFungibleData.js**
  - Retrieves non-fungible token data from the selected account via the [Gateway API](https://www.npmjs.com/package/@radixdlt/babylon-gateway-api-sdk), essential for managing NFT interactions within the dApp.

## Running the DApp

To run the dApp on your local machine, follow these steps:

1. **Install Dependencies**:

- Run `npm install` to install all required dependencies.

2. **Start the Development Server**:

- Execute `npm run dev` to start the development server.

3. **Access the DApp**:

- Open a web browser and go to [http://localhost:5173/](http://localhost:5173/) to view and interact with the dApp.

# Setup Guide

This README provides a step-by-step guide to setting up and testing your dApp on the Stokenet environment.

## Pre-requisites

Before you begin, ensure you have some XRD tokens to use for staking and deploying packages. You can stake XRD tokens by following these steps:

1. **Stake XRD tokens**:

- Visit [Stokenet Dashboard](https://stokenet-dashboard.radixdlt.com/network-staking) to stake some XRD.
- For testing purposes, you can use the same validator as this example by visiting [Network staking](https://stokenet-dashboard.radixdlt.com/network-staking) and staking there with `validator_tdx_2_1sdtnujyn3720ymg8lakydkvc5tw4q3zecdj95akdwt9de362mvtd94`.
- Check that the Pool Unit resource address for this validator is `resource_tdx_2_1t45l9ku3r5mwxazht2qutmhhk3660hqqvxkkyl8rxs20n9k2zv0w7t`

### Note: If you are using the same validator and just want to test the dApp in local, you do not have to follow the next steps and can continue to [Interacting with the DApp](#interacting-with-the-dapp)

## Deploying Yield Tokenizer

Follow these steps to deploy the Yield Tokenizer packages:

2. **Create a dApp Definition**:

- Follow the instructions at [dApp Definition Setup](https://docs.radixdlt.com/docs/en/dapp-definition-setup) to create your dApp definition. Make sure to obtain some test tokens to deploy packages.

3. **Build Yield Tokenizer**:

- Navigate to the `./yield_tokenizer` directory and run `scrypto build` to build the project.

4. **Deploy Yield Tokenizer**:

- Use [Stokenet Console](https://stokenet-console.radixdlt.com/deploy-package) to deploy the `./yield_tokenizer` packages, including both WASM and RPD files.
- Note the package address. (For this examples was `package_sim1p4nhxvep6a58e88tysfu0zkha3nlmmcp6j8y5gvvrhl5aw47jfsxlt`).

5. **Instantiate Yield Tokenizer**:

- Go to [Stokenet Transaction Manifest](https://stokenet-console.radixdlt.com/transaction-manifest) and instantiate the Yield Tokenizer using the saved package address (from step 4) and your selected pool unit resource address from the staking step (step 1).
- Use the following command template, replacing `<yield_tokenizer_package_address>` and `<pool_unit_resource_address>` with your specific addresses:
  ```
  CALL_FUNCTION
  Address("<yield_tokenizer_package_address>")
  "YieldTokenizer"
  "instantiate_yield_tokenizer"
  Enum<0u8>()
  Address("<pool_unit_resource_address>")
  ;
  ```

6. **Transaction Receipt**:

- Check the transaction receipt for the instantiation. (For this example was this [Transaction Details](https://stokenet-dashboard.radixdlt.com/transaction/txid_tdx_2_15ysucxuktqa99ra55akpswxr394nu6n7pzk8ty4eedxemmlz9l6s38fhyv/details).)
- Save the created entities, in this case were:
  - Component address: `component_tdx_2_1crg2h5yr3agcw6p5dmkc2yzz9uyh4d5dkm8ksdhuay4rw24md70m4n`
  - PT: `resource_tdx_2_1t5ue99w2qf8ksk7ac5w7va8w8gg8zdsraw7x4n0yd5vj4rlj7968jc`
  - YT: `resource_tdx_2_1nfc2d822qmqn6tdzlvprjsa97fewrhpj2puhnqvdd5tx3e8p4jkusz`

## Deploying AMM

Continue with these steps to deploy the AMM packages:

7. **Edit the Dex Blueprint**:

- Navigate to `./amm/src/dex.rs` and replace the Yield Tokenizer package address on line 43 with the one obtained from step 4, and the component address on line 64 with that from step 6.

```rust
42 extern_blueprint! {
43     "<yield_tokenizer_package_address>",
44     YieldTokenizer {
45         fn tokenize_yield(
              ...
          )
      }
  }
61
62 const TOKENIZER: Global<YieldTokenizer> = global_component! (
63     YieldTokenizer,
64     "<yield_tokenizer_component_address>" // Mark this component
65 );
```

8. **Build AMM**:

- Navigate to `./amm` and execute `scrypto build`.

9. **Deploy AMM Package**:

- Deploy the `./amm` packages at [Stokenet Console](https://stokenet-console.radixdlt.com/deploy-package).
- Save the package address. (For this examples was `package_tdx_2_1ph0zmlwff7523utsed5jsd3net8ccm27gd020ppdsj67w5zkwfrzdw`.)

10. **Instantiate AMM Package**:

- Use [Stokenet Transaction Manifest](https://stokenet-console.radixdlt.com/transaction-manifest) to instantiate the AMM package using the address from step 9.
- Command template:
  ```
  CALL_FUNCTION
  Address("<amm_package_address>")
  "YieldAMM"
  "instantiate_yield_amm"
  Enum<0u8>()
  Decimal("50")
  Decimal("1.01")
  Decimal("0.8")
  ;
  ```

10. **Check Transaction Receipt**:
    - View the transaction receipt. (For this example was [Transaction Details](https://stokenet-dashboard.radixdlt.com/transaction/txid_tdx_2_1rgxd3p27w5p6g5lwt8l7qw2ep8chf0qlr6nk8vqajy5gxvyjjlxqh0spxw/details).)
    - Save the created entities, in this case were:
      - Component address: `component_tdx_2_1cp4m96qyyxzapzxwq0gw08x8vzgmh08mts4pu6rpzzjljd6fwkaus3`
      - Pool Component: `pool_tdx_2_1c5nrw6pzh4xq6dru63qez7ktj0nyew88j0842rqs3lfdu46p2n9nr4`
      - Flash Loan Receipt: `resource_tdx_2_1nfccv7csd2s9s7cnc0ly0r0j66fwme4pdrh46mzdfyu8zqqp4zrc7t`
      - Pool Unit: `resource_tdx_2_1t5a98ts09k3r9rxgmjjf53qnx88jtjqq7ra709sx8y7wn4dkmc5sqr`

## Configuring the DApp Environment

Finally, update your `.env` file in the `./dapp` directory with the appropriate addresses obtained from the previous steps:

```
VITE_API_DAPP_DEFINITION_ID=account_tdx_2_12y7yjk7h0k5cd45au6kthphe83pxrutencm9xh3vtu3p8kllcgxf33
VITE_API_YIELD_TOKEN_COMPONENT_ADDRESS=component_tdx_2_1crg2h5yr3agcw6p5dmkc2yzz9uyh4d5dkm8ksdhuay4rw24md70m4n
VITE_API_AMM_COMPONENT_ADDRESS=component_tdx_2_1cp4m96qyyxzapzxwq0gw08x8vzgmh08mts4pu6rpzzjljd6fwkaus3
VITE_API_LSU_ADDRESS=resource_tdx_2_1t45l9ku3r5mwxazht2qutmhhk3660hqqvxkkyl8rxs20n9k2zv0w7t
VITE_API_PT_ADDRESS=resource_tdx_2_1t5ue99w2qf8ksk7ac5w7va8w8gg8zdsraw7x4n0yd5vj4rlj7968jc
VITE_API_YT_ADDRESS=resource_tdx_2_1nfc2d822qmqn6tdzlvprjsa97fewrhpj2puhnqvdd5tx3e8p4jkusz
VITE_API_PU_ADDRESS=resource_tdx_2_1t5a98ts09k3r9rxgmjjf53qnx88jtjqq7ra709sx8y7wn4dkmc5sqr
VITE_API_POOL_COMPONENT=pool_tdx_2_1c5nrw6pzh4xq6dru63qez7ktj0nyew88j0842rqs3lfdu46p2n9nr4
```

## Interacting with the DApp

After configuring the environment and deploying the packages, you can interact with the DApp using the following procedures:

1. **Yield Tokenizer: Tokenize LSU**:

- Use the `Tokenize LSU` button to tokenize any amount of LSU.

2. **AMM: Add Liquidity**:

- Use the `Add Liquidity` button to add any amount of LSU and any amount of PT to the liquidity pool.

3. **Set Initial Implied Rate**:

- After adding liquidity, run the script `amm/transaction_manifest/set_initial_ln_implied_rate.rtm`.
  Replace `<amm_component_address>` with the AMM component address obtained from step 10 in the deployment process.
  ```
  CALL_METHOD
  Address("<amm_component_address>")
  "set_initial_ln_implied_rate"
  PreciseDecimal("1.04")
  ;
  ```

### Other functions

4. **AMM: Pool and AMM data**:

- Check the resources and values for LSU and PT

- Check the AMM Maturity date, scalar root, fee rate, reserve fee percent and Last ln implied rate.

5. **Yield Tolkenizer: Redeem**:

- Select a YT available in your wallet and Redeem it for the LSU equivalent. See that the Underlying LSU is the same amount as the PT Amount required for this transaction.

6. **AMM: Remove liquidity**:

- Remove liquidity from the liquidity pool using your Pool Unit tokens.

7. **AMM: Swap**:

- Buy PT: Select the PT desired and check the LSU needed to make the transaction.

- Sell PT: Select the PT amount to swap for LSU.

- Buy YT: Select the LSU amount to swap for YT.

- Sell YT: Select the YT you want to swap in for LSU.

### Other functions

4. **AMM: Pool and AMM data**

- **Check LSU and PT Resources and Values**: Retrieve and display the current values and resources related to LSU (Liquidity Supply Units) and PT (Pool Tokens).

- **AMM Maturity and Rates**: View details such as the AMM maturity date, scalar root, fee rate, reserve fee percent, and the last ln implied rate.

5. **Yield Tokenizer: Redeem**

- Select a YT available in your wallet and redeem it for the equivalent amount in LSU. Ensure that the underlying LSU is the same amount as the PT amount required for this transaction.

6. **AMM: Remove liquidity**:

- Use your Pool Unit tokens to remove liquidity from the liquidity pool.

7. **AMM: Swap**:

- **Buy PT (Pool Tokens)**: Select the desired PT and check the required amount of LSU (Liquidity Supply Units) needed to complete the transaction.

- **Sell PT**: Choose the amount of PT you wish to convert into LSU.

- **Buy YT (Yield Tokens)**: Specify the amount of LSU to be exchanged for YT.

- **Sell YT**: Select the YT you wish to convert back into LSU.


# License

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