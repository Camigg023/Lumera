import { useState, useEffect, useCallback } from "react";
import type { DeliveryPoint, EligibilityCycle } from "../../domain/entities";
import { DeliveryPointRepositoryImpl } from "../../data/repositories/deliveryPointRepositoryImpl";
import {
  GetNearbyDeliveryPoints,
  SelectDeliveryPoint,
  GetEligibilityCycle,
} from "../../domain/usecases";

interface UseDeliveryPointsResult {
  points: DeliveryPoint[];
  cycle: EligibilityCycle | null;
  loading: boolean;
  error: string | null;
  query: string;
  selectedId: string | null;
  activeFilter: string;
  setQuery: (q: string) => void;
  setActiveFilter: (f: string) => void;
  handleSelect: (id: string) => Promise<void>;
}

const repo = new DeliveryPointRepositoryImpl();
const getNearby = new GetNearbyDeliveryPoints(repo);
const selectPoint = new SelectDeliveryPoint(repo);
const getCycle = new GetEligibilityCycle(repo);

export function useDeliveryPoints(): UseDeliveryPointsResult {
  const [points, setPoints] = useState<DeliveryPoint[]>([]);
  const [cycle, setCycle] = useState<EligibilityCycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("nearest");

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const [pts, cyc] = await Promise.all([
          getNearby.execute(query),
          getCycle.execute(),
        ]);
        if (!cancelled) {
          setPoints(pts);
          setCycle(cyc);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetch();
    return () => { cancelled = true; };
  }, [query]);

  const handleSelect = useCallback(async (id: string) => {
    setSelectedId(id);
    await selectPoint.execute(id);
  }, []);

  return {
    points,
    cycle,
    loading,
    error,
    query,
    selectedId,
    activeFilter,
    setQuery,
    setActiveFilter,
    handleSelect,
  };
}
