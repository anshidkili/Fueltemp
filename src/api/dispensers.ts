import { supabase } from "../lib/supabase";

export interface Dispenser {
  id: string;
  station_id: string;
  dispenser_number: number;
  fuel_type_id: string;
  status: "operational" | "maintenance" | "offline";
  current_meter_reading: number;
  created_at: string;
}

export interface DispenserWithFuelType extends Dispenser {
  fuel_types: {
    name: string;
    price_per_liter: number;
  };
}

export async function getDispensers(stationId: string) {
  const { data, error } = await supabase
    .from("dispensers")
    .select(
      `
      *,
      fuel_types(name, price_per_liter)
    `,
    )
    .eq("station_id", stationId)
    .order("dispenser_number");

  if (error) throw error;
  return data as DispenserWithFuelType[];
}

export async function getDispenserById(id: string) {
  const { data, error } = await supabase
    .from("dispensers")
    .select(
      `
      *,
      fuel_types(name, price_per_liter)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as DispenserWithFuelType;
}

export async function createDispenser(
  dispenser: Omit<Dispenser, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("dispensers")
    .insert([dispenser])
    .select()
    .single();

  if (error) throw error;
  return data as Dispenser;
}

export async function updateDispenser(id: string, updates: Partial<Dispenser>) {
  const { data, error } = await supabase
    .from("dispensers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Dispenser;
}

export async function updateMeterReading(id: string, reading: number) {
  const { data, error } = await supabase
    .from("dispensers")
    .update({ current_meter_reading: reading })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Dispenser;
}

export async function deleteDispenser(id: string) {
  const { error } = await supabase.from("dispensers").delete().eq("id", id);

  if (error) throw error;
  return true;
}
