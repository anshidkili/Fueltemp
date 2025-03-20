import { supabase } from "../lib/supabase";

export interface Employee {
  id: string;
  user_id: string;
  station_id: string;
  position: string;
  hire_date: string;
  status: "active" | "inactive" | "on_leave";
  hourly_rate: number;
  created_at: string;
}

export interface EmployeeWithProfile extends Employee {
  profiles: {
    full_name: string;
    email: string;
    phone: string;
    avatar_url?: string;
  };
}

export async function getEmployees(stationId: string) {
  const { data, error } = await supabase
    .from("employees")
    .select(
      `
      *,
      profiles:user_id(full_name, email, phone, avatar_url)
    `,
    )
    .eq("station_id", stationId);

  if (error) throw error;
  return data as EmployeeWithProfile[];
}

export async function getEmployeeById(id: string) {
  const { data, error } = await supabase
    .from("employees")
    .select(
      `
      *,
      profiles:user_id(full_name, email, phone, avatar_url)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as EmployeeWithProfile;
}

export async function createEmployee(
  employee: Omit<Employee, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("employees")
    .insert([employee])
    .select()
    .single();

  if (error) throw error;
  return data as Employee;
}

export async function updateEmployee(id: string, updates: Partial<Employee>) {
  const { data, error } = await supabase
    .from("employees")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Employee;
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase.from("employees").delete().eq("id", id);

  if (error) throw error;
  return true;
}
