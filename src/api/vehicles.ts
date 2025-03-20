import { supabase } from "../lib/supabase";

export interface Vehicle {
  id: string;
  customer_id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  fuel_type_id: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface VehicleWithFuelType extends Vehicle {
  fuel_types: {
    name: string;
  };
}

export async function getVehicles(customerId: string) {
  const { data, error } = await supabase
    .from("vehicles")
    .select(
      `
      *,
      fuel_types(name)
    `,
    )
    .eq("customer_id", customerId);

  if (error) throw error;
  return data as VehicleWithFuelType[];
}

export async function getVehicleById(id: string) {
  const { data, error } = await supabase
    .from("vehicles")
    .select(
      `
      *,
      fuel_types(name)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as VehicleWithFuelType;
}

export async function createVehicle(
  vehicle: Omit<Vehicle, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("vehicles")
    .insert([vehicle])
    .select()
    .single();

  if (error) throw error;
  return data as Vehicle;
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>) {
  const { data, error } = await supabase
    .from("vehicles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Vehicle;
}

export async function deleteVehicle(id: string) {
  const { error } = await supabase.from("vehicles").delete().eq("id", id);

  if (error) throw error;
  return true;
}
