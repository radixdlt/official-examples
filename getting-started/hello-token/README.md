# Hello-Token

Welcome to the Hello-Token project! This project is designed to demonstrate the usage of tokens in a simple application.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Introduction

This example project demonstrates how to create a simple token using the Scrypto library. This is the Hello World Scrypto project that we use for the dApp template examples. We create a simple mintable token and configure the `dapp_definiton` metadata required for the 2 way verification process used by the Radix Wallet.

## Installation

To get started with the Hello-Token project, follow these steps:

1. Clone the repository: `git clone https://github.com/radixdlt/official-examples.git`
2. Navigate to the Hello-Token project: `cd official-examples/hello-token`
3. Build the project: `scrypto build`

## Usage

There are two ways to use the Hello-Token project:

### With `resim` the Radix Engine Simulator:

1. Navigate your terminal to the `hello-token` directory
2. Run `resim reset` to reset the Radix Engine Simulator
3. Run `resim new-account` to create a new account and set it to be the default account
4. Run `resim publish .` to publish the project to the Radix Engine Simulator
5. Replace the package address in `manifests/instantiate_resim.rtm` with the address of the deployed package
6. Run `resim run manifests/instantiate_resim.rtm` to instantiate the `HelloToken` component
7. Replace the component & account address's in `manifests/free_token_resim.rtm` with the address of the deployed component and the account address you created

### Deploy the application to Stokenet the Radix Public Test Network:

1. Ensure that you have run `scrypto build` to build the project.
2. Navigate to the Stokenet Developer Console https://stokenet-console.radixdlt.com/deploy-package
3. Drop the Package `WASM` and `RPD` files into the drop zone. These are located in the `hello-token/target/wasm32-unknown-unknown/release` directory.
4. Click `Send to the Radix Wallet` and open the Radix Wallet to approve the deployment.
5. Once the deployment is approved, you can interact with the deployed Blueprint Package.

## License

The Radix Official Examples code is released under Radix Modified MIT License.

    Copyright 2023 Radix Publishing Ltd

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
