import { useSupabaseQuery, useSupabaseSubscription } from "./useSupabase";
import {
  getSales,
  getSaleById,
  getCustomerSales,
  getVehicleSales,
} from "../api/sales";

export function useSales(
  stationId: string,
  startDate?: string,
  endDate?: string,
) {
  return useSupabaseQuery(
    () => getSales(stationId, startDate, endDate),
    [stationId, startDate, endDate],
  );
}

export function useRealtimeSales(stationId: string) {
  return useSupabaseSubscription("sales", "station_id", stationId, () =>
    getSales(stationId),
  );
}

export function useSale(saleId: string) {
  return useSupabaseQuery(() => getSaleById(saleId), [saleId]);
}

export function useCustomerSales(
  customerId: string,
  startDate?: string,
  endDate?: string,
) {
  return useSupabaseQuery(
    () => getCustomerSales(customerId, startDate, endDate),
    [customerId, startDate, endDate],
  );
}

export function useVehicleSales(
  vehicleId: string,
  startDate?: string,
  endDate?: string,
) {
  return useSupabaseQuery(
    () => getVehicleSales(vehicleId, startDate, endDate),
    [vehicleId, startDate, endDate],
  );
}
