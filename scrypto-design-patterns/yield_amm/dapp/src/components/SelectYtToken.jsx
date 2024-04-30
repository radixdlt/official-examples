import { useEffect, useState } from "react";
import { useAccount } from "../contexts/AccountContext.jsx";
import { useGetEntityDetails } from "../hooks/useGetEntityDetails.js";
import { useNumericInput } from "../hooks/useNumericInput";
import Dropdown from "./Dropdown.jsx";
import { useGetNonFungibleData } from "../hooks/useGetNonFungibleData.js";
import { useRefresh } from "../contexts/RefreshContext.jsx";

const SelectYtYoken = ({
  nftSelected,
  setNftSelected,
  ptAmount,
  setPtAmount,
}) => {
  const [dropdownData, setDropdownData] = useState([]);
  const { needsRefresh, setNeedsRefresh } = useRefresh();

  const ytAddress = import.meta.env.VITE_API_YT_ADDRESS;

  const { selectedAccount } = useAccount();

  const { info: selectedAccountData, fetchData: fetchSelectedAccountData } =
    useGetEntityDetails(selectedAccount?.address);

  useEffect(() => {
    if (selectedAccount) {
      fetchSelectedAccountData();
    }
  }, [selectedAccount]);

  // useEffect(() => {
  //   if (selectedAccount) {
  //     fetchSelectedAccountData();
  //     setNeedsRefresh(false);
  //   }
  // }, [needsRefresh, setNeedsRefresh]);

  useEffect(() => {
    const data = getNft(
      selectedAccountData?.non_fungible_resources?.items,
      ytAddress,
    );
    setDropdownData(data);
    fetchNftIdInfo();
    
    setNeedsRefresh(false);
  }, [selectedAccount, selectedAccountData, needsRefresh, setNeedsRefresh]);

  useEffect(() => {
    if (nftSelected) {
      const amount =
        nftSelected.data?.programmatic_json?.fields?.find(
          (acc) => acc?.field_name === "underlying_lsu_amount",
        )?.value || 0;
      setPtAmount(amount);
    }
  }, [nftSelected]);

  function getNft(endpoint, address) {
    if (endpoint) {
      const nfts = endpoint.find(
        (change) => change.resource_address === address,
      );
      return nfts?.vaults?.items[0]?.items || 0;
    }
    return 0;
  }

  const { info: nftIdInfo, fetchData: fetchNftIdInfo } = useGetNonFungibleData(
    ytAddress,
    dropdownData,
  );

  const renderAccountLabel = (account) => {
    const shortAddress = `${account.non_fungible_id.slice(
      0,
      6,
    )}...${account.non_fungible_id.slice(-6)} - Underlying LSU: ${
      account.data?.programmatic_json?.fields?.find(
        (acc) => acc?.field_name === "underlying_lsu_amount",
      ).value || 0
    }`;
    return `${shortAddress}`;
  };

  return (
    <>
      {nftIdInfo ? (
        <>
          <Dropdown
            type={"YT"}
            data={nftIdInfo}
            dataSelected={nftSelected?.non_fungible_id}
            setDataSelected={setNftSelected}
            noDataInfo={""}
            renderDataLabel={renderAccountLabel}
            selectValueInfo={"Select a YT"}
          />
          <h3>Underlysing LSU available: {ptAmount}</h3>
        </>
      ) : (
        <h3>Select an account with valid YT</h3>
      )}
    </>
  );
};

export default SelectYtYoken;
