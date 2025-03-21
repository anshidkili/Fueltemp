import { useDataQuery, useRealtimeData } from "./useSupabase";
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
  return useDataQuery(
    () => getSales(stationId, startDate, endDate),
    [stationId, startDate, endDate],
  );
}

export function useRealtimeSales(stationId: string) {
  return useRealtimeData(`sales-${stationId}`, () => getSales(stationId));
}

export function useSale(saleId: string) {
  return useDataQuery(() => getSaleById(saleId), [saleId]);
}

export function useCustomerSales(
  customerId: string,
  startDate?: string,
  endDate?: string,
) {
  return useDataQuery(
    () => getCustomerSales(customerId, startDate, endDate),
    [customerId, startDate, endDate],
  );
}

export function useVehicleSales(
  vehicleId: string,
  startDate?: string,
  endDate?: string,
) {
  return useDataQuery(
    () => getVehicleSales(vehicleId, startDate, endDate),
    [vehicleId, startDate, endDate],
  );
}
