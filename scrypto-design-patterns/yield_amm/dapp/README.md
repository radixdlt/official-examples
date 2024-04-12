
Steps

First, let's deploy the packages on Stokenet

1. Create a dApp Definition

2. Go to yield_amm/yield_tokenizer and do scrypto build

3. Deploy package in https://stokenet-console.radixdlt.com/deploy-package
deploy yield_amm/yield_tokenizer packages

4. Go to https://stokenet-dashboard.radixdlt.com/network-staking and stake some XRD
I selected this validator https://stokenet-dashboard.radixdlt.com/validator/validator_tdx_2_1sdtnujyn3720ymg8lakydkvc5tw4q3zecdj95akdwt9de362mvtd94/metadata
with pool unit resource address resource_tdx_2_1t45l9ku3r5mwxazht2qutmhhk3660hqqvxkkyl8rxs20n9k2zv0w7t

5. Instantiate yield_tokenizer package in https://stokenet-console.radixdlt.com/transaction-manifest

CALL_FUNCTION
    Address("package_tdx_2_1p4plre664u9m50my473s9dtexhcgt45dgm7mxmlzdndccph9c26vp3")
    "YieldTokenizer"
    "instantiate_yield_tokenizer"
    Enum<0u8>()
    Address("resource_tdx_2_1t45l9ku3r5mwxazht2qutmhhk3660hqqvxkkyl8rxs20n9k2zv0w7t")
;

I get https://stokenet-dashboard.radixdlt.com/transaction/txid_tdx_2_15ysucxuktqa99ra55akpswxr394nu6n7pzk8ty4eedxemmlz9l6s38fhyv/details

component_tdx_2_1crg2h5yr3agcw6p5dmkc2yzz9uyh4d5dkm8ksdhuay4rw24md70m4n
PT resource_tdx_2_1t5ue99w2qf8ksk7ac5w7va8w8gg8zdsraw7x4n0yd5vj4rlj7968jc
YT resource_tdx_2_1nfc2d822qmqn6tdzlvprjsa97fewrhpj2puhnqvdd5tx3e8p4jkusz


6.Change the package and component in amm/src/dex.rs

extern_blueprint! {
        "package_tdx_2_1p4plre664u9m50my473s9dtexhcgt45dgm7mxmlzdndccph9c26vp3",
        YieldTokenizer {
            fn tokenize_yield(
                &mut self, 
                amount: FungibleBucket
            ) -> (FungibleBucket, NonFungibleBucket);
            fn redeem(
                &mut self, 
                principal_token: FungibleBucket, 
                yield_token: NonFungibleBucket,
                yt_redeem_amount: Decimal
            ) -> (FungibleBucket, Option<NonFungibleBucket>);
            fn pt_address(&self) -> ResourceAddress;
            fn yt_address(&self) -> ResourceAddress;
            fn underlying_resource(&self) -> ResourceAddress;
            fn maturity_date(&self) -> UtcDateTime;
        }
    }

    const TOKENIZER: Global<YieldTokenizer> = global_component! (
        YieldTokenizer,
        "component_tdx_2_1crg2h5yr3agcw6p5dmkc2yzz9uyh4d5dkm8ksdhuay4rw24md70m4n"
    );

7. go to yield_amm/amm and do scrypto build

8. Deploy package in https://stokenet-console.radixdlt.com/deploy-package
deploy yield_amm/amm packages

9. get package_tdx_2_1ph0zmlwff7523utsed5jsd3net8ccm27gd020ppdsj67w5zkwfrzdw

5. Instantiate amm package in https://stokenet-console.radixdlt.com/transaction-manifest

CALL_FUNCTION
    Address("package_tdx_2_1ph0zmlwff7523utsed5jsd3net8ccm27gd020ppdsj67w5zkwfrzdw")
    "YieldAMM"
    "instantiate_yield_amm"
    Enum<0u8>()
    Decimal("50")
    Decimal("1.01")
    Decimal("0.8")
;

8. Get https://stokenet-dashboard.radixdlt.com/transaction/txid_tdx_2_1rgxd3p27w5p6g5lwt8l7qw2ep8chf0qlr6nk8vqajy5gxvyjjlxqh0spxw/details

component_tdx_2_1cp4m96qyyxzapzxwq0gw08x8vzgmh08mts4pu6rpzzjljd6fwkaus3

pool_component pool_tdx_2_1c5nrw6pzh4xq6dru63qez7ktj0nyew88j0842rqs3lfdu46p2n9nr4
Flash Loan Receipt resource_tdx_2_1nfccv7csd2s9s7cnc0ly0r0j66fwme4pdrh46mzdfyu8zqqp4zrc7t
Pool Unit resource_tdx_2_1t5a98ts09k3r9rxgmjjf53qnx88jtjqq7ra709sx8y7wn4dkmc5sqr

In REACT

1. in .env change

CHANGE ADDRESSESS

2. After adding liquidity run amm/transaction_manifest/set_initial_ln_implied_rate.rtm

3. https://radix-babylon-gateway-api.redoc.ly/#operation/EntityFungiblesPage pool component address, details

4. https://radix-babylon-gateway-api.redoc.ly/#operation/StateEntityDetails amm component address details, last one, last_ln_implied_rate
reserve_fee_percent
fee_rate exp to euler
maturity_date
pool_component

5. add recepit


