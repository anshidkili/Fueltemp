import { useSupabaseQuery } from "./useSupabase";
import {
  getStations,
  getStationById,
  getStationMetrics,
} from "../api/stations";

export function useStations() {
  return useSupabaseQuery(getStations, []);
}

export function useStation(stationId: string) {
  return useSupabaseQuery(() => getStationById(stationId), [stationId]);
}

export function useStationMetrics(stationId: string) {
  return useSupabaseQuery(() => getStationMetrics(stationId), [stationId]);
}
