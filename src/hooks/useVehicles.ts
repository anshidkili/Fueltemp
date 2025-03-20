import { useSupabaseQuery } from "./useSupabase";
import { getVehicles, getVehicleById } from "../api/vehicles";

export function useVehicles(customerId: string) {
  return useSupabaseQuery(() => getVehicles(customerId), [customerId]);
}

export function useVehicle(vehicleId: string) {
  return useSupabaseQuery(() => getVehicleById(vehicleId), [vehicleId]);
}
