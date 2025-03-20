import { supabase } from "../lib/supabase";

export interface Sale {
  id: string;
  station_id: string;
  dispenser_id: string;
  employee_id: string;
  customer_id: string | null;
  vehicle_id: string | null;
  fuel_type_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_amount: number;
  payment_method: "cash" | "credit_card" | "credit_account";
  transaction_date: string;
  created_at: string;
}

export interface SaleWithDetails extends Sale {
  dispensers: {
    dispenser_number: number;
  };
  fuel_types: {
    name: string;
  };
  employees: {
    profiles: {
      full_name: string;
    };
  };
  customers?: {
    company_name: string;
    profiles: {
      full_name: string;
    };
  };
  vehicles?: {
    license_plate: string;
    make: string;
    model: string;
  };
}

export async function getSales(
  stationId: string,
  startDate?: string,
  endDate?: string,
) {
  let query = supabase
    .from("sales")
    .select(
      `
      *,
      dispensers(dispenser_number),
      fuel_types(name),
      employees(profiles(full_name)),
      customers(company_name, profiles(full_name)),
      vehicles(license_plate, make, model)
    `,
    )
    .eq("station_id", stationId)
    .order("transaction_date", { ascending: false });

  if (startDate) {
    query = query.gte("transaction_date", startDate);
  }

  if (endDate) {
    query = query.lte("transaction_date", endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as SaleWithDetails[];
}

export async function getSaleById(id: string) {
  const { data, error } = await supabase
    .from("sales")
    .select(
      `
      *,
      dispensers(dispenser_number),
      fuel_types(name),
      employees(profiles(full_name)),
      customers(company_name, profiles(full_name)),
      vehicles(license_plate, make, model)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as SaleWithDetails;
}

export async function createSale(sale: Omit<Sale, "id" | "created_at">) {
  // Start a transaction
  const { data, error } = await supabase.rpc("create_sale", {
    sale_data: sale,
  });

  if (error) throw error;
  return data as Sale;
}

export async function getCustomerSales(
  customerId: string,
  startDate?: string,
  endDate?: string,
) {
  let query = supabase
    .from("sales")
    .select(
      `
      *,
      dispensers(dispenser_number),
      fuel_types(name),
      stations(name),
      vehicles(license_plate, make, model)
    `,
    )
    .eq("customer_id", customerId)
    .order("transaction_date", { ascending: false });

  if (startDate) {
    query = query.gte("transaction_date", startDate);
  }

  if (endDate) {
    query = query.lte("transaction_date", endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getVehicleSales(
  vehicleId: string,
  startDate?: string,
  endDate?: string,
) {
  let query = supabase
    .from("sales")
    .select(
      `
      *,
      dispensers(dispenser_number),
      fuel_types(name),
      stations(name)
    `,
    )
    .eq("vehicle_id", vehicleId)
    .order("transaction_date", { ascending: false });

  if (startDate) {
    query = query.gte("transaction_date", startDate);
  }

  if (endDate) {
    query = query.lte("transaction_date", endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}
