import { supabase } from "../lib/supabase";

export interface SalesSummary {
  total_sales: number;
  total_volume: number;
  transaction_count: number;
  average_transaction: number;
  by_fuel_type: {
    fuel_type: string;
    volume: number;
    amount: number;
    count: number;
  }[];
  by_payment_method: {
    payment_method: string;
    amount: number;
    count: number;
  }[];
  by_date: {
    date: string;
    amount: number;
    volume: number;
    count: number;
  }[];
}

export interface InventorySummary {
  fuel_type: string;
  current_level: number;
  capacity: number;
  percentage: number;
  last_delivery_date: string | null;
  last_delivery_amount: number | null;
}

export interface CustomerSummary {
  customer_id: string;
  company_name: string;
  contact_name: string;
  total_purchases: number;
  current_balance: number;
  credit_limit: number;
  available_credit: number;
  last_purchase_date: string | null;
}

export async function getSalesSummary(
  stationId: string,
  startDate: string,
  endDate: string,
) {
  const { data, error } = await supabase.rpc("get_sales_summary", {
    p_station_id: stationId,
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) throw error;
  return data as SalesSummary;
}

export async function getInventorySummary(stationId: string) {
  const { data, error } = await supabase.rpc("get_inventory_summary", {
    p_station_id: stationId,
  });

  if (error) throw error;
  return data as InventorySummary[];
}

export async function getCustomerSummary(stationId: string) {
  const { data, error } = await supabase.rpc("get_customer_summary", {
    p_station_id: stationId,
  });

  if (error) throw error;
  return data as CustomerSummary[];
}

export async function getFinancialReport(
  stationId: string,
  startDate: string,
  endDate: string,
) {
  const { data, error } = await supabase.rpc("get_financial_report", {
    p_station_id: stationId,
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) throw error;
  return data;
}
