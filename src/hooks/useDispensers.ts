import { useSupabaseQuery, useSupabaseSubscription } from "./useSupabase";
import { getDispensers, getDispenserById } from "../api/dispensers";

export function useDispensers(stationId: string) {
  return useSupabaseSubscription("dispensers", "station_id", stationId, () =>
    getDispensers(stationId),
  );
}

export function useDispenser(dispenserId: string) {
  return useSupabaseQuery(() => getDispenserById(dispenserId), [dispenserId]);
}
