export const useGetBalanceChange = (handleTx, targetResourceAddress) => {
  
  const balanceChange =
    handleTx[1].transaction.balance_changes.fungible_balance_changes.find(
      (change) => change.resource_address === targetResourceAddress
    );
  return balanceChange;
};