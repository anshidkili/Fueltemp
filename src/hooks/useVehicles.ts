import { useDataQuery } from "./useSupabase";
import { getVehicles, getVehicleById } from "../api/vehicles";

export function useVehicles(customerId: string) {
  return useDataQuery(() => getVehicles(customerId), [customerId]);
}

export function useVehicle(vehicleId: string) {
  return useDataQuery(() => getVehicleById(vehicleId), [vehicleId]);
}
