<script>
  import Button from "$lib/components/Button.svelte";
  import DevModeSteps from "./DevModeSteps.svelte";
  import HelloToken from "./HelloToken.svelte";
</script>

<section>
  <h1>Dev Mode Setup <br />in a Few Steps</h1>
  <p>Before connecting your wallet please follow the steps below.</p>
</section>
<DevModeSteps />
<section>
  <h2>Get Your Hello Token</h2>
  <p>
    Claim your <span class="hello-token-pink">Hello Token</span>
  </p>
</section>
<HelloToken />
<section>
  <h2>Explore further Documentation</h2>
  <p class="semi-bold">
    Find additional resources and detailed guides to help you navigate the setup
    process
  </p>
  <div class="docs-button-container">
    <Button href="https://docs.radixdlt.com/docs">View Radix Docs</Button>
    <Button
      href="https://www.npmjs.com/package/@radixdlt/radix-dapp-toolkit"
      --background="var(--grey-3)">View dApp Toolkit</Button>
  </div>
</section>

<style>
  section {
    display: flex;
    max-width: 768px;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  h1 {
    text-align: center;
    font-size: 56px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
    margin: 0;
  }

  h2 {
    text-align: center;
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
    margin: 0;
  }

  p {
    text-align: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin: 0;
  }

  .docs-button-container {
    display: flex;
    padding-top: 16px;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .semi-bold {
    font-weight: 500;
  }

  .hello-token-pink {
    color: var(--radix-pink);
    font-family: "IBM Plex Sans";
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
  }
</style>
