import { supabase } from "../lib/supabase";

export interface FuelType {
  id: string;
  name: string;
  code: string;
  price_per_liter: number;
  created_at: string;
}

export interface Inventory {
  id: string;
  station_id: string;
  fuel_type_id: string;
  quantity_liters: number;
  last_updated: string;
  created_at: string;
}

export interface InventoryWithFuelType extends Inventory {
  fuel_types: FuelType;
}

export async function getFuelTypes() {
  const { data, error } = await supabase
    .from("fuel_types")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as FuelType[];
}

export async function getInventory(stationId: string) {
  const { data, error } = await supabase
    .from("inventory")
    .select(
      `
      *,
      fuel_types(*)
    `,
    )
    .eq("station_id", stationId);

  if (error) throw error;
  return data as InventoryWithFuelType[];
}

export async function updateInventory(id: string, quantity: number) {
  const { data, error } = await supabase
    .from("inventory")
    .update({
      quantity_liters: quantity,
      last_updated: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Inventory;
}

export async function addInventory(
  inventory: Omit<Inventory, "id" | "created_at" | "last_updated">,
) {
  const { data, error } = await supabase
    .from("inventory")
    .insert([
      {
        ...inventory,
        last_updated: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Inventory;
}
