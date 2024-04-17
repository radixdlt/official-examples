import React, { useEffect, useState } from "react";
import { useGatewayApi } from "../hooks/useGatewayApi";
import { useAmmRefresh } from "../contexts/AmmRefreshContext";

function AmmInfo() {
  const { needsRefresh, setNeedsRefresh } = useAmmRefresh();

  const [maturityDate, setMaturityDate] = useState("");
  const [scalarRoot, setScalarRoot] = useState("");
  const [feeRate, setFeeRate] = useState("");
  const [reserveFeePercent, setReserveFeePercent] = useState("");
  const [lastLnImplied, setLastLnImplied] = useState("");
  const [vault1, setVault1] = useState("");
  const [vault2, setVault2] = useState("");

  const poolAddress = import.meta.env.VITE_API_POOL_COMPONENT;
  const ammAddress = import.meta.env.VITE_API_AMM_COMPONENT_ADDRESS;

  const {
    info: poolInfo,
    loading: poolLoading,
    fetchData: fetchPoolInfo,
  } = useGatewayApi(poolAddress);
  const {
    info: ammInfo,
    loading: ammLoading,
    fetchData: fetchAmmInfo,
  } = useGatewayApi(ammAddress);

  useEffect(() => {
    if (needsRefresh) {
      fetchPoolInfo();
      fetchAmmInfo();
      setNeedsRefresh(false);
    }
  }, [needsRefresh, fetchPoolInfo, fetchAmmInfo, setNeedsRefresh]);

  useEffect(() => {
    if (
      !poolLoading &&
      poolInfo &&
      poolInfo.details &&
      poolInfo.details.state
    ) {
      setVault1(poolInfo.fungible_resources.items[0].vaults.items[0].amount);
      setVault2(poolInfo.fungible_resources.items[1].vaults.items[0].amount);
    }
  }, [poolInfo, poolLoading]);

  useEffect(() => {
    if (!ammLoading && ammInfo && ammInfo.details && ammInfo.details.state) {
      setMaturityDate(
        ammInfo.details.state.fields[2].fields[2].value +
          "-" +
          ammInfo.details.state.fields[2].fields[1].value +
          "-" +
          ammInfo.details.state.fields[2].fields[0].value +
          " " +
          ammInfo.details.state.fields[2].fields[3].value +
          ":" +
          ammInfo.details.state.fields[2].fields[4].value +
          ":" +
          ammInfo.details.state.fields[2].fields[5].value +
          ":" +
          ammInfo.details.state.fields[2].fields[0].value,
      );
      setScalarRoot(ammInfo.details.state.fields[3].value);
      setFeeRate(ammInfo.details.state.fields[4].value);
      setReserveFeePercent(ammInfo.details.state.fields[5].value);
      setLastLnImplied(ammInfo.details.state.fields[6].value);
    }
  }, [ammInfo, ammLoading]);

  const renderAddressLabel = (address) => {
    const shortAddress = `${address.slice(0, 20)}...${address.slice(-6)}`;
    return `${shortAddress}`;
  };

  return (
    <div>
      {" "}
      <h3>Pool Data</h3>
      <p>LSU / PT</p>
      <a
        href={`https://stokenet-dashboard.radixdlt.com/stake_unit/${
          import.meta.env.VITE_API_LSU_ADDRESS
        }/summary`}
        target="_blank"
      >
        {renderAddressLabel(import.meta.env.VITE_API_LSU_ADDRESS)}
      </a>
      /
      <a
        href={`https://stokenet-dashboard.radixdlt.com/resource/${
          import.meta.env.VITE_API_PT_ADDRESS
        }/summary`}
        target="_blank"
      >
        {renderAddressLabel(import.meta.env.VITE_API_PT_ADDRESS)}
      </a>
      <p>LSU Vault amount: {Math.trunc(vault2)}</p>
      <p>PT Vault amount: {Math.trunc(vault1)}</p>
      <h3>AMM Data</h3>
      <p>
        Amm Address:{" "}
        <a
          href={`https://stokenet-dashboard.radixdlt.com/component/${ammAddress}/summary`}
          target="_blank"
        >
          {renderAddressLabel(ammAddress)}
        </a>
      </p>
      <p>Maturity date: {maturityDate}</p>
      <p>Scalar root: {scalarRoot}</p>
      <p>Fee rate: {Math.exp(feeRate)}</p>
      <p>Reserve fee percent: {reserveFeePercent}</p>
      <p>Last ln implied rate: {Number(lastLnImplied).toFixed(4)}</p>
    </div>
  );
}

export default AmmInfo;
