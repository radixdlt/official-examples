import React, { createContext, useState, useContext } from "react";

const AmmRefreshContext = createContext();

export const useAmmRefresh = () => useContext(AmmRefreshContext);

export const AmmRefreshProvider = ({ children }) => {
  const [needsRefresh, setNeedsRefresh] = useState(false);

  return (
    <AmmRefreshContext.Provider value={{ needsRefresh, setNeedsRefresh }}>
      {children}
    </AmmRefreshContext.Provider>
  );
};
