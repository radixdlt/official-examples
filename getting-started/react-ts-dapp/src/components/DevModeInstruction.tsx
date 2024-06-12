const DevModeInstruction = () => {
  return (
    <>
      <section className="heading-section">
        <h1>
          Dev Mode Setup <br />
          in a Few Steps
        </h1>
        <p className="head-text">
          Before connecting your wallet please follow the steps below.
        </p>
      </section>

      <div className="dev-mode-instruction-container">
        <div className="dev-mode-content-container">
          <div className="dev-mode-steps-col">
            <div className="dev-mode-step-container">
              <h2 className="step-nums">Step 1</h2>
              <h3 className="step-heading">
                Select Dev Mode in the Radix Wallet
              </h3>
              <p className="step-text">
                Open the Radix Wallet, then go to Configurations -{">"} App
                settings -{">"} Dev Mode.
              </p>
            </div>
            <div className="dev-mode-step-container">
              <h2 className="step-nums">Step 2</h2>
              <h3 className="step-heading">Configure the Gateway</h3>
              <p className="step-text">
                Go to App Settings -{">"} Network Gateways -{">"} Add New
                Gateway, add https://babylon-stokenet-gateway.radixdlt.com as a
                gateway and select it.
              </p>
            </div>
            <div className="dev-mode-step-container">
              <h2 className="step-nums">Step 3</h2>
              <h3 className="step-heading">Get Some Test XRD</h3>
              <p className="step-text">
                Once Stokenet Gateway is selected go to any of your accounts,
                click the three dots at the top -{">"} Dev Preferences -{">"}{" "}
                Get XRD Test Tokens.
              </p>
            </div>
            <div className="dev-mode-step-container">
              <h2 className="step-nums">Step 4</h2>
              <h3 className="step-heading">Connect your Radix Wallet</h3>
              <p className="step-text">
                Connect your Radix Wallet in the navigation bar.
              </p>
            </div>
          </div>

          <div className="dev-mode-gif-container">
            <div className="dev-mode-gif">
              <img src="src/assets/dev-mode-setup.gif" alt="dev mode setup" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DevModeInstruction;
