import { RadixDappToolkit } from "@radixdlt/radix-dapp-toolkit";
import { RdtContext } from "./contexts";

export const RdtProvider = ({
  value,
  children,
}: {
  value: RadixDappToolkit | null;
  children: React.ReactNode;
}) => <RdtContext.Provider value={value}>{children}</RdtContext.Provider>;
