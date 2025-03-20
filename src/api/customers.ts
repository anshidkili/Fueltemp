import { supabase } from "../lib/supabase";

export interface Customer {
  id: string;
  user_id: string;
  company_name: string;
  credit_limit: number;
  current_balance: number;
  payment_terms: string;
  status: "active" | "inactive" | "suspended";
  created_at: string;
}

export interface CustomerWithProfile extends Customer {
  profiles: {
    full_name: string;
    email: string;
    phone: string;
    avatar_url?: string;
  };
}

export async function getCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select(
      `
      *,
      profiles:user_id(full_name, email, phone, avatar_url)
    `,
    )
    .order("company_name");

  if (error) throw error;
  return data as CustomerWithProfile[];
}

export async function getCustomerById(id: string) {
  const { data, error } = await supabase
    .from("customers")
    .select(
      `
      *,
      profiles:user_id(full_name, email, phone, avatar_url)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as CustomerWithProfile;
}

export async function createCustomer(
  customer: Omit<Customer, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("customers")
    .insert([customer])
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function updateCustomer(id: string, updates: Partial<Customer>) {
  const { data, error } = await supabase
    .from("customers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase.from("customers").delete().eq("id", id);

  if (error) throw error;
  return true;
}
