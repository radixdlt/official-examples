import { useContext } from "react";
import { RdtContext } from "../contexts/rdt-context";

export const useRdt = () => {
  const rdt = useContext(RdtContext);

  return rdt;
};
