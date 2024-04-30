import { useState } from "react";

const Dropdown = ({
  type,
  data,
  dataSelected,
  setDataSelected,
  noDataInfo,
  renderDataLabel,
  selectValueInfo,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDataAccount = (resourceAddress) => {
    setDataSelected(resourceAddress);
    setDropdownOpen(false);
  };

  return (
    <div>
      {data.length > 0 ? (
        <>
          <div className="custom-select">
            <button
              className={
                dataSelected ? "select-button-account" : "select-button"
              }
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-controls="select-dropdown"
            >
              <span className="selected-value">
                {dataSelected && type === "Account"
                  ? renderDataLabel(
                      data.find((acc) => acc.address === dataSelected),
                    )
                  : dataSelected && type === "YT"
                    ? renderDataLabel(
                        data.find(
                          (acc) => acc.non_fungible_id === dataSelected,
                        ),
                      )
                    : selectValueInfo}
              </span>
              <span
                className={dataSelected ? " arrow-account" : "arrow"}
              ></span>
            </button>
            {dropdownOpen && (
              <ul
                className="select-dropdown"
                role="listbox"
                id="select-dropdown"
              >
                {data.map((resourceAddress, index) => {
                  const key =
                    type === "Account"
                      ? resourceAddress.address
                      : type === "YT"
                        ? resourceAddress.non_fungible_id
                        : index;
                  const onClickValue = resourceAddress;

                  return (
                    <li
                      key={key}
                      role="option"
                      onClick={() => handleDataAccount(onClickValue)}
                    >
                      <label>{renderDataLabel(resourceAddress)}</label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      ) : (
        <h2>{noDataInfo}</h2>
      )}
    </div>
  );
};

export default Dropdown;
