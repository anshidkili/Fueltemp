import { useDataQuery } from "./useSupabase";
import {
  getStations,
  getStationById,
  getStationMetrics,
} from "../api/stations";

export function useStations() {
  return useDataQuery(getStations, []);
}

export function useStation(stationId: string) {
  return useDataQuery(() => getStationById(stationId), [stationId]);
}

export function useStationMetrics(stationId: string) {
  return useDataQuery(() => getStationMetrics(stationId), [stationId]);
}
