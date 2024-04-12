import React from 'react'

function AmmInfo() {
  const renderAddressLabel = (address) => {
    const shortAddress = `${address.slice(0, 20)}...${address.slice(-6)}`;
    return `${shortAddress}`;
  };

  return (
    <div>
      <p>Pool: {renderAddressLabel(import.meta.env.VITE_API_LSU_ADDRESS)} / {renderAddressLabel(import.meta.env.VITE_API_PT_ADDRESS)}</p>
      <p>Pool Component</p>
      <p>Maturity date: </p>
      <p>Fee rate: exp to euler</p>
      <p>Reserve fee percent: </p>
      <p>Last ln implied rate: </p>
    </div>
  )
}

export default AmmInfo
