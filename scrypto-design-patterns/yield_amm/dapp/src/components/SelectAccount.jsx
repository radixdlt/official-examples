import React, { useState, useEffect } from "react";
import { useAccounts } from "../hooks/useAccounts";

const SelectAccount = () => {

  const { accounts, selectedAccount, setSelectedAccount } = useAccounts();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setDropdownOpen(false);
    console.log(selectedAccount);
  };

  const renderAccountLabel = (account) => {
    const shortAddress = `${account.address.slice(
      0,
      4,
    )}...${account.address.slice(-6)}`;
    return `${account.label || "Account"} ${shortAddress}`;
  };

  return (
    <div>
      {accounts.length > 0 ? (
            <>
              <div className="custom-select">
                <button
                  className="select-button"
                  role="combobox"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  onClick={toggleDropdown}
                  aria-controls="select-dropdown"
                >
                  <span className="selected-value">
                    {selectedAccount
                      ? renderAccountLabel(
                          accounts.find(
                            (acc) => acc.address === selectedAccount,
                          ),
                        )
                      : "Select an Account"}
                  </span>
                  <span className="arrow"></span>
                </button>
                {dropdownOpen && (
                  <ul
                    className="select-dropdown"
                    role="listbox"
                    id="select-dropdown"
                  >
                    {accounts.map((account) => (
                      <li
                        key={account.address}
                        role="option"
                        onClick={() => handleSelectAccount(account.address)}
                      >
                        <label>{renderAccountLabel(account)}</label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </>
          ): (<h2>Please connect your wallet</h2>)}
    </div>
  );
};

export default SelectAccount;
