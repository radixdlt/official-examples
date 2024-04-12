<script lang="ts">
  import devModeGif from "$lib/assets/dev-mode-setup.gif";
</script>

<div class="dev-mode-instruction-container">
  <div class="dev-mode-content-container">
    <div class="dev-mode-steps-col">
      <div class="dev-mode-step-container">
        <p class="step-nums">Step 1</p>
        <h4 class="step-heading">Select Dev Mode in the Radix Wallet</h4>
        <p class="step-text">
          Open the Radix Wallet, then go to Configurations -> App settings ->
          Dev Mode.
        </p>
      </div>
      <div class="dev-mode-step-container">
        <p class="step-nums">Step 2</p>
        <h4 class="step-heading">Configure the Gateway</h4>
        <p class="step-text">
          Go to App Settings -> Network Gateways -> Add New Gateway, add
          https://babylon-stokenet-gateway.radixdlt.com as a gateway and select
          it.
        </p>
      </div>
      <div class="dev-mode-step-container">
        <p class="step-nums">Step 3</p>
        <h4 class="step-heading">Get Some Test XRD</h4>
        <p class="step-text">
          Once Stokenet Gateway is selected go to any of your accounts, click
          the three dots at the top -> Dev Preferences -> Get XRD Test Tokens.
        </p>
      </div>
      <div class="dev-mode-step-container">
        <p class="step-nums">Step 4</p>
        <h4 class="step-heading">Connect your Radix Wallet</h4>
        <p class="step-text">
          Connect your Radix Wallet in the navigation bar.
        </p>
      </div>
    </div>
    <!-- Dev Mode Gif Start -->
    <div class="dev-mode-gif-container">
      <img src={devModeGif} alt="dev mode setup" />
    </div>
    <!-- Dev Mode Gif End -->
  </div>
</div>

<style>
  .dev-mode-instruction-container {
    width: 1022px;
    height: 100%;
    padding: 48px 40px;
    background: #0d0f16;
    box-shadow: 0px 16px 32px rgba(0, 48, 87, 0.15);
    border-radius: 20px;
    border: 1px white solid;
    justify-content: center;
    align-items: center;
    gap: 8px;
    display: flex;
  }

  .dev-mode-content-container {
    display: flex;
    align-items: flex-start;
    gap: 50px;
  }

  .dev-mode-step-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    padding-bottom: 16px;
  }

  .step-nums {
    color: var(--radix-pink);
    font-family: "IBM Plex Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
    margin: 0;
  }

  .step-heading {
    color: var(--grey-6);
    font-family: "IBM Plex Sans";
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
    margin: 0;
  }

  .step-text {
    color: var(--grey-6);
    font-family: "IBM Plex Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin: 0;
  }

  .dev-mode-gif-container {
    display: flex;
    padding: 20px 20px 33px 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 20px;
    background: var(--grey-3);
  }
</style>
