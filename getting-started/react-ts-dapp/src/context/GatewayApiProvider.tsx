import PropTypes from "prop-types";
import { gatewayApiContext } from "./contexts";
import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";

export const GatewayApiProvider = ({
  value,
  children,
}: {
  value: GatewayApiClient | null;
  children: React.ReactNode;
}) => (
  <gatewayApiContext.Provider value={value}>
    {children}
  </gatewayApiContext.Provider>
);

GatewayApiProvider.propTypes = {
  value: PropTypes.any,
  children: PropTypes.node.isRequired,
};
