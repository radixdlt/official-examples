<script>
  import devModeGif from "$lib/assets/dev-mode-setup.gif";
</script>

<div class="dev-mode-instruction-container">
  <div class="dev-mode-content-container">
    <div class="dev-mode-steps-col">
      <div class="dev-mode-step-container">
        <h2 class="step-nums">Step 1</h2>
        <h3 class="step-heading">Select Dev Mode in the Radix Wallet</h3>
        <p class="step-text">
          Open the Radix Wallet, then go to Configurations -> App settings ->
          Dev Mode.
        </p>
      </div>
      <div class="dev-mode-step-container">
        <h2 class="step-nums">Step 2</h2>
        <h3 class="step-heading">Configure the Gateway</h3>
        <p class="step-text">
          Go to App Settings -> Network Gateways -> Add New Gateway, add
          https://babylon-stokenet-gateway.radixdlt.com as a gateway and select
          it.
        </p>
      </div>
      <div class="dev-mode-step-container">
        <h2 class="step-nums">Step 3</h2>
        <h3 class="step-heading">Get Some Test XRD</h3>
        <p class="step-text">
          Once Stokenet Gateway is selected go to any of your accounts, click
          the three dots at the top -> Dev Preferences -> Get XRD Test Tokens.
        </p>
      </div>
      <div class="dev-mode-step-container">
        <h2 class="step-nums">Step 4</h2>
        <h3 class="step-heading">Connect your Radix Wallet</h3>
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
    max-width: 1022px;
    height: 100%;
    padding: 3rem 2.5rem;
    background: #0d0f16;
    box-shadow: 0px 16px 32px rgba(0, 48, 87, 0.15);
    border-radius: 20px;
    border: 1px white solid;
    justify-content: center;
    align-items: center;
    gap: 8px;
    display: flex;
  }
  @media (max-width: 768px) {
    .dev-mode-instruction-container {
      padding: 2rem 1.5rem;
    }
  }

  .dev-mode-content-container {
    display: flex;
    align-items: flex-start;
    gap: 50px;
  }
  @media (max-width: 768px) {
    .dev-mode-content-container {
      flex-direction: column;
    }
  }

  .dev-mode-step-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    align-self: stretch;
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
    margin: 0 0 2rem;
    max-width: 640px;
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
