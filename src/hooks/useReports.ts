import { useSupabaseQuery } from "./useSupabase";
import {
  getSalesSummary,
  getInventorySummary,
  getCustomerSummary,
  getFinancialReport,
} from "../api/reports";

export function useSalesSummary(
  stationId: string,
  startDate: string,
  endDate: string,
) {
  return useSupabaseQuery(
    () => getSalesSummary(stationId, startDate, endDate),
    [stationId, startDate, endDate],
  );
}

export function useInventorySummary(stationId: string) {
  return useSupabaseQuery(() => getInventorySummary(stationId), [stationId]);
}

export function useCustomerSummary(stationId: string) {
  return useSupabaseQuery(() => getCustomerSummary(stationId), [stationId]);
}

export function useFinancialReport(
  stationId: string,
  startDate: string,
  endDate: string,
) {
  return useSupabaseQuery(
    () => getFinancialReport(stationId, startDate, endDate),
    [stationId, startDate, endDate],
  );
}
