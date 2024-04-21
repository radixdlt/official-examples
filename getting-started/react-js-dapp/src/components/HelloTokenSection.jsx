import { useState, useEffect } from "react";
import ClaimHello from "./ClaimHello";
import { useAccount } from "../AccountContext";

const HelloTokenSection = () => {
  const { accounts, selectedAccount, setSelectedAccount } = useAccount();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [enableButtons, setEnableButtons] = useState(false);
  const [selectClasses, setSelectClasses] = useState("select-button");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      setEnableButtons(true);
    } else {
      setEnableButtons(false);
    }
  }, [accounts]); // Only re-run the effect if count changes

  const toggleDropdown = () => {
    setActive(!active);
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account.address);
    setSelectClasses(
      `select-button border-none account-appearance-${account.appearanceId}`
    );

    setActive(false);
    setDropdownOpen(false);
  };

  const renderAccountLabel = (account) => {
    const shortAddress = `${account.address.slice(
      0,
      4
    )}...${account.address.slice(-6)}`;
    return `${account.label || "Account"} ${shortAddress}`;
  };

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
          {/* <!-- ************ Custom Select ****************** --> */}

          <>
            <div className={"custom-select" + (active ? " active" : "")}>
              <button
                className={selectClasses}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                onClick={toggleDropdown}
                aria-controls="select-dropdown"
                disabled={!enableButtons}>
                <span className="selected-value">
                  {!enableButtons
                    ? "Setup Dev Mode to choose an account"
                    : selectedAccount && enableButtons
                    ? renderAccountLabel(
                        accounts.find((acc) => acc.address === selectedAccount)
                      )
                    : "Select an Account"}
                </span>
                <span className="arrow" />
              </button>
              {dropdownOpen && (
                <ul
                  className="select-dropdown"
                  role="listbox"
                  id="select-dropdown">
                  {accounts.map((account) => (
                    <li
                      key={account.address}
                      role="option"
                      className={`account-appearance-${account.appearanceId}`}
                      onClick={() => handleSelectAccount(account)}>
                      <label>{renderAccountLabel(account)}</label>
                      <input
                        type="radio"
                        name={account.label}
                        value={account.address}
                        defaultChecked={selectedAccount === account.address}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <ClaimHello
              selectedAccount={selectedAccount}
              enableButtons={enableButtons}
            />
          </>
        </div>
        <div className="hello-tokens-img-container">
          {/* <!-- vert-bar --> */}
          <div
            style={{
              width: 0,
              height: "60%",
              opacity: 0.3,
              borderLeft: "1px solid white",
            }}></div>
          {/* <!-- vert-bar --> */}
          <div className="hello-tokens">
            <img src="src/assets/hello-tokens.png" alt="hello tokens" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HelloTokenSection;
