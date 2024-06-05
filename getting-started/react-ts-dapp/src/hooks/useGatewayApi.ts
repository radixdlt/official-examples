import { useContext } from "react";
import { gatewayApiContext } from "../context/contexts";

export const useGatewayApi = () => useContext(gatewayApiContext);
