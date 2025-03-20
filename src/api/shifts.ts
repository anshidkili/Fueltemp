import { supabase } from "../lib/supabase";

export interface Shift {
  id: string;
  station_id: string;
  employee_id: string;
  start_time: string;
  end_time: string | null;
  initial_readings: Record<string, number>; // dispenser_id -> reading
  final_readings: Record<string, number> | null; // dispenser_id -> reading
  cash_collected: number | null;
  status: "active" | "completed";
  notes: string | null;
  created_at: string;
}

export interface ShiftWithEmployee extends Shift {
  employees: {
    profiles: {
      full_name: string;
    };
  };
}

export async function getCurrentShift(employeeId: string) {
  const { data, error } = await supabase
    .from("shifts")
    .select(
      `
      *,
      employees(profiles(full_name))
    `,
    )
    .eq("employee_id", employeeId)
    .eq("status", "active")
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for no rows returned
    throw error;
  }

  return data as ShiftWithEmployee | null;
}

export async function getShifts(
  stationId: string,
  startDate?: string,
  endDate?: string,
) {
  let query = supabase
    .from("shifts")
    .select(
      `
      *,
      employees(profiles(full_name))
    `,
    )
    .eq("station_id", stationId)
    .order("start_time", { ascending: false });

  if (startDate) {
    query = query.gte("start_time", startDate);
  }

  if (endDate) {
    query = query.lte("start_time", endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as ShiftWithEmployee[];
}

export async function getShiftById(id: string) {
  const { data, error } = await supabase
    .from("shifts")
    .select(
      `
      *,
      employees(profiles(full_name))
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as ShiftWithEmployee;
}

export async function startShift(
  shift: Omit<
    Shift,
    | "id"
    | "created_at"
    | "end_time"
    | "final_readings"
    | "cash_collected"
    | "status"
  >,
) {
  // First check if there's already an active shift
  const { data: existingShift } = await supabase
    .from("shifts")
    .select("id")
    .eq("employee_id", shift.employee_id)
    .eq("status", "active")
    .single();

  if (existingShift) {
    throw new Error("Employee already has an active shift");
  }

  const { data, error } = await supabase
    .from("shifts")
    .insert([
      {
        ...shift,
        status: "active",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Shift;
}

export async function endShift(
  id: string,
  finalReadings: Record<string, number>,
  cashCollected: number,
  notes?: string,
) {
  const { data, error } = await supabase
    .from("shifts")
    .update({
      end_time: new Date().toISOString(),
      final_readings: finalReadings,
      cash_collected: cashCollected,
      notes: notes || null,
      status: "completed",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Shift;
}
