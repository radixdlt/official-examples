import { useState, useEffect, useCallback } from "react";
import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";

export const useGetEntityDetails = (address) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEntityDetails = useCallback(async () => {
    const gatewayApi = GatewayApiClient.initialize({
      basePath: "https://stokenet.radixdlt.com",
    });

    if (address) {
      try {
        setLoading(true);
        const result =
          await gatewayApi.state.getEntityDetailsVaultAggregated(address);
        setInfo(result);
      } catch (err) {
        console.error("Error fetching entity details:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
  }, [address]);

  useEffect(() => {
    fetchEntityDetails();
  }, [fetchEntityDetails]);

  return { info, loading, error, fetchData: fetchEntityDetails };
};
