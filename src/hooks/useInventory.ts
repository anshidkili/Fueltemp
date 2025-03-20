import { useSupabaseQuery, useSupabaseSubscription } from "./useSupabase";
import { getInventory, getFuelTypes } from "../api/inventory";

export function useInventory(stationId: string) {
  return useSupabaseSubscription("inventory", "station_id", stationId, () =>
    getInventory(stationId),
  );
}

export function useFuelTypes() {
  return useSupabaseQuery(getFuelTypes, []);
}
