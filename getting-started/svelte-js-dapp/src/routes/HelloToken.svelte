<script>
  import { rdt, walletData } from "$lib/stores";
  import { componentAddress } from "$lib/constants";
  import helloTokens from "$lib/assets/hello-tokens.png";
  import Select from "$lib/components/Select.svelte";
  import Button from "$lib/components/Button.svelte";

  let accountAddress = "";
  const handleSelect = (event) => {
    accountAddress = event.detail;
  };
  const shortAddress = (account) =>
    account.address.slice(0, 4) +
    "..." +
    account.address.slice(account.address.length - 6, account.address.length);

  // Send a transaction to the wallet when user clicks on the claim token button
  const handelClick = async () => {
    // Check if the wallet is connected and an account is selected. If not, do nothing
    if (!$rdt || !accountAddress) return;
    let manifest = `
  CALL_METHOD
    Address("${componentAddress}")
    "free_token"
    ;
  CALL_METHOD
    Address("${accountAddress}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
    ;
  `;
    console.log("manifest: ", manifest);
    // Send manifest to extension for signing
    const result = await $rdt.walletApi.sendTransaction({
      transactionManifest: manifest,
      version: 1,
    });
    if (result.isErr()) throw result.error;
    console.log("free token result:", result.value);

    let getCommitReceipt =
      await $rdt?.gatewayApi.transaction.getCommittedDetails(
        result.value.transactionIntentHash
      );
    console.log("getCommittedDetails:", getCommitReceipt);
  };
</script>

<div class="hello-token-container">
  <div class="hello-token-left-col">
    <h3>Have you Setup Dev Mode?</h3>
    <p>
      In order to receive your <span class="hello-token-pink-sm"
        >Hello Token</span> please set up Dev Mode first using the steps above.
    </p>
    <Select
      label="Select an Account"
      options={$walletData?.accounts.map((account) => ({
        value: account.address,
        label: `${account.label} ${shortAddress(account)}`,
        style: `background: var(--account-appearance-${account.appearanceId}); border: none;`,
      }))}
      on:select={handleSelect} />
    <Button --width="100%" on:click={handelClick}>Claim Hello Token</Button>
  </div>
  <!-- vert-bar -->
  <div
    style="width: 100%; height: 60%; opacity: 0.30; border-left: 1px white solid">
  </div>
  <!-- vert-bar -->
  <img src={helloTokens} alt="hello tokens" />
</div>

<style>
  h3 {
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 1.875rem */
    margin: 0;
  }
  .hello-token-pink-sm {
    color: var(--radix-pink);
    font-family: "IBM Plex Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
  }

  .hello-token-container {
    display: flex;
    width: 1022px;
    height: 280px;
    padding: 48px 40px;
    align-items: center;
    gap: 79px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(
      30deg,
      rgba(255, 255, 255, 0.5) -34.01%,
      rgba(255, 255, 255, 0.2) 0.67%,
      rgba(255, 255, 255, 0) 86.69%
    );
  }

  .hello-token-left-col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
</style>
