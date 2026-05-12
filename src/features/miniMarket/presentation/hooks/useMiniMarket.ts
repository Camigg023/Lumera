import { useState, useEffect } from "react";
import type { FoodPackage } from "../../domain/entities";
import { MiniMarketRepositoryImpl } from "../../data/repositories/MiniMarketRepositoryImpl";
import { GetFoodPackage } from "../../domain/usecases";

interface UseMiniMarketResult {
  pkg: FoodPackage | null;
  loading: boolean;
  error: string | null;
}

const repo = new MiniMarketRepositoryImpl();
const getFoodPackage = new GetFoodPackage(repo);

export function useMiniMarket(): UseMiniMarketResult {
  const [pkg, setPkg] = useState<FoodPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getFoodPackage.execute();
        if (!cancelled) setPkg(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetch();
    return () => { cancelled = true; };
  }, []);

  return { pkg, loading, error };
}
