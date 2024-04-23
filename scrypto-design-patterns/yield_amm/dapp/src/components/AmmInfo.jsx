import React, { useEffect, useState } from "react";
import { useGatewayApi } from "../hooks/useGatewayApi";
import { useAmmRefresh } from "../contexts/AmmRefreshContext";
import Swap from "./Swap";
import AddLiquidity from "./AddLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";
import Decimal from "decimal.js";

function AmmInfo() {
  const { needsRefresh, setNeedsRefresh } = useAmmRefresh();

  const [maturityDate, setMaturityDate] = useState("");
  const [scalarRoot, setScalarRoot] = useState(0);
  const [feeRate, setFeeRate] = useState(0);
  const [reserveFeePercent, setReserveFeePercent] = useState(0);
  const [lastLnImplied, setLastLnImplied] = useState(0);
  const [vault1, setVault1] = useState(0);
  const [vault2, setVault2] = useState(0);

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
    setVault1(
      poolInfo?.fungible_resources?.items[0]?.vaults?.items[0]?.amount || 0
    );
    setVault2(
      poolInfo?.fungible_resources?.items[1]?.vaults?.items[0]?.amount || 0
    );
  }, [poolInfo, poolLoading]);

  useEffect(() => {
    setMaturityDate(
      ammInfo?.details?.state?.fields[2].fields[0].value +
        "-" +
        ammInfo?.details?.state?.fields[2].fields[1].value.padStart(2, "0") +
        "-" +
        ammInfo?.details?.state?.fields[2].fields[2].value.padStart(2, "0") +
        "T" +
        ammInfo?.details?.state?.fields[2].fields[3].value.padStart(2, "0") +
        ":" +
        ammInfo?.details?.state?.fields[2].fields[4].value.padStart(2, "0") +
        ":" +
        ammInfo?.details?.state?.fields[2].fields[5].value.padStart(2, "0") +
        "Z" || 0
    );
    setScalarRoot(ammInfo?.details?.state?.fields[3]?.value || 0);
    setFeeRate(ammInfo?.details?.state?.fields[4]?.value || 0);
    setReserveFeePercent(ammInfo?.details?.state?.fields[5]?.value || 0);
    setLastLnImplied(ammInfo?.details?.state?.fields[6]?.value || 0);
  }, [ammInfo, ammLoading]);

  const renderAddressLabel = (address) => {
    const shortAddress = `${address.slice(0, 20)}...${address.slice(-6)}`;
    return `${shortAddress}`;
  };

  return (
    <>
      <div>
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
        <p>LSU Vault amount: {vault2}</p>
        <p>PT Vault amount: {vault1}</p>
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
      <>
        <AddLiquidity />

        <RemoveLiquidity />

        <Swap
          maturityDate={maturityDate}
          vaultReserves={[Decimal(vault1), Decimal(vault2)]}
          lastLnImpliedRate={Decimal(lastLnImplied)}
          scalarRoot={Decimal(scalarRoot)}
          feeRate={Decimal(feeRate)}
          reserveFeePercent={Decimal(reserveFeePercent)}
        />
      </>
    </>
  );
}

export default AmmInfo;
