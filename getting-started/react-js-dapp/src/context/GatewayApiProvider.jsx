import PropTypes from "prop-types";
import { gatewayApiContext } from "./contexts";

export const GatewayApiProvider = ({ value, children }) => (
  <gatewayApiContext.Provider value={value}>
    {children}
  </gatewayApiContext.Provider>
);

GatewayApiProvider.propTypes = {
  value: PropTypes.any,
  children: PropTypes.node.isRequired,
};
