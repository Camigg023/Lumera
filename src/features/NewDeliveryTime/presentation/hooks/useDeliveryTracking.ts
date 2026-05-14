import { useState, useEffect } from "react";
import type { Delivery } from "../../domain/entities";
import { DeliveryRepositoryImpl } from "../../data/repositories/DeliveryRepositoryImpl";
import { GetDeliveryStatus } from "../../domain/usecases";

interface UseDeliveryTrackingResult {
  delivery: Delivery | null;
  loading: boolean;
  error: string | null;
}

const repository = new DeliveryRepositoryImpl();
const getDeliveryStatus = new GetDeliveryStatus(repository);

export function useDeliveryTracking(
  trackingNumber = "LUM-89240-X"
): UseDeliveryTrackingResult {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDeliveryStatus.execute(trackingNumber);
        if (!cancelled) {
          setDelivery(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, [trackingNumber]);

  return { delivery, loading, error };
}
