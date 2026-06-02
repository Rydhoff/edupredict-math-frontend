import { useEffect, useState } from "react";
import { getCache, setCache } from "../utils/cache";

const useCachedFetch = ({ cacheKey, fetcher, enabled = true }) => {
  const cached = getCache(cacheKey);

  const [data, setData] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const refetch = async ({ forceLoading = false } = {}) => {
    try {
      setError("");

      const currentCache = getCache(cacheKey);

      if (currentCache && !forceLoading) {
        setData(currentCache);
        setLoading(false);
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const result = await fetcher();

      setData(result);
      setCache(cacheKey, result);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (enabled) refetch();
  }, [cacheKey, enabled]);

  return {
    data,
    setData,
    loading,
    refreshing,
    error,
    refetch,
  };
};

export default useCachedFetch;