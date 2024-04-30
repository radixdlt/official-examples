import React, { createContext, useState, useContext } from "react";

const RefreshContext = createContext();

export const useRefresh = () => useContext(RefreshContext);

export const RefreshProvider = ({ children }) => {
  const [needsRefresh, setNeedsRefresh] = useState(false);

  return (
    <RefreshContext.Provider value={{ needsRefresh, setNeedsRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
