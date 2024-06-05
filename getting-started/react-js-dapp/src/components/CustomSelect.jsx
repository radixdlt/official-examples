import { useState } from "react";
import { useAccount } from "../AccountContext";
import PropTypes from "prop-types";

export const CustomSelect = ({ active, setActive, enableButtons }) => {
  const { accounts, selectedAccount, setSelectedAccount } = useAccount();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectClasses, setSelectClasses] = useState("select-button");

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
    <div className={"custom-select" + (active ? " active" : "")}>
      <button
        className={selectClasses}
        role="combobox"
        aria-label="Select an Account"
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
        <ul className="select-dropdown" role="listbox" id="select-dropdown">
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
  );
};

CustomSelect.propTypes = {
  active: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
  enableButtons: PropTypes.bool.isRequired,
};
