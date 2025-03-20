import { supabase } from "../lib/supabase";

export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  manager_id: string | null;
  created_at: string;
  status: "active" | "inactive" | "maintenance";
}

export interface StationWithStats extends Station {
  total_sales?: number;
  fuel_inventory?: number;
  employee_count?: number;
}

export async function getStations() {
  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as Station[];
}

export async function getStationById(id: string) {
  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Station;
}

export async function createStation(
  station: Omit<Station, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("stations")
    .insert([station])
    .select()
    .single();

  if (error) throw error;
  return data as Station;
}

export async function updateStation(id: string, updates: Partial<Station>) {
  const { data, error } = await supabase
    .from("stations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Station;
}

export async function deleteStation(id: string) {
  const { error } = await supabase.from("stations").delete().eq("id", id);

  if (error) throw error;
  return true;
}

export async function getStationMetrics(stationId: string) {
  // This would typically join multiple tables to get metrics
  // For now, we'll simulate with a basic query
  const { data, error } = await supabase
    .from("station_metrics")
    .select("*")
    .eq("station_id", stationId)
    .single();

  if (error) throw error;
  return data;
}
