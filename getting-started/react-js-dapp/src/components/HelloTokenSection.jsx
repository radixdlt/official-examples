import { useState, useEffect } from "react";
import { useAccount } from "../AccountContext";
import { ClaimHello } from "./ClaimHello";
import { CustomSelect } from "./CustomSelect";

const HelloTokenSection = () => {
  const { accounts, selectedAccount } = useAccount();
  const [enableButtons, setEnableButtons] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      setEnableButtons(true);
    } else {
      setEnableButtons(false);
    }
  }, [accounts]);

  return (
    <>
      <div className="heading-section">
        <h2>Get Your Hello Token</h2>
        <p className="head-text">
          Claim your <span className="hello-token-pink">Hello Token</span>
        </p>
      </div>

      <div className="hello-token-container">
        <div className="hello-token-left-col">
          <h3>Have you Setup Dev Mode?</h3>
          <p>
            In order to receive your{" "}
            <span className="hello-token-pink-sm">Hello Token</span> please set
            up Dev Mode first using the steps above.
          </p>
          <CustomSelect
            active={active}
            setActive={setActive}
            enableButtons={enableButtons}
          />
          <ClaimHello
            selectedAccount={selectedAccount}
            enableButtons={enableButtons}
          />
        </div>
        <div className="hello-tokens-img-container">
          <div
            className="vertical-bar"
            style={{
              width: 0,
              height: "60%",
              opacity: 0.3,
              borderLeft: "1px solid white",
            }}
          />
          <div className="hello-tokens">
            <img src="src/assets/hello-tokens.png" alt="hello tokens" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HelloTokenSection;
