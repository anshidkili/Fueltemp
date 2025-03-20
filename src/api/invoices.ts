import { supabase } from "../lib/supabase";

export interface Invoice {
  id: string;
  customer_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  paid_amount: number;
  status: "pending" | "paid" | "overdue" | "partially_paid";
  created_at: string;
}

export interface InvoiceWithCustomer extends Invoice {
  customers: {
    company_name: string;
    profiles: {
      full_name: string;
    };
  };
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  sale_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface InvoiceItemWithSale extends InvoiceItem {
  sales?: {
    transaction_date: string;
    fuel_types: {
      name: string;
    };
    quantity_liters: number;
    vehicles?: {
      license_plate: string;
      make: string;
      model: string;
    };
  };
}

export async function getInvoices(customerId: string) {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      customers(company_name, profiles(full_name))
    `,
    )
    .eq("customer_id", customerId)
    .order("issue_date", { ascending: false });

  if (error) throw error;
  return data as InvoiceWithCustomer[];
}

export async function getInvoiceById(id: string) {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      customers(company_name, profiles(full_name))
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as InvoiceWithCustomer;
}

export async function getInvoiceItems(invoiceId: string) {
  const { data, error } = await supabase
    .from("invoice_items")
    .select(
      `
      *,
      sales(transaction_date, fuel_types(name), quantity_liters, vehicles(license_plate, make, model))
    `,
    )
    .eq("invoice_id", invoiceId);

  if (error) throw error;
  return data as InvoiceItemWithSale[];
}

export async function createInvoice(
  invoice: Omit<Invoice, "id" | "created_at">,
  items: Omit<InvoiceItem, "id" | "created_at" | "invoice_id">[],
) {
  // This would typically be a database function to ensure transaction integrity
  // For now, we'll simulate with client-side logic
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .insert([invoice])
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // Add items with the new invoice ID
  const itemsWithInvoiceId = items.map((item) => ({
    ...item,
    invoice_id: invoiceData.id,
  }));

  const { data: itemsData, error: itemsError } = await supabase
    .from("invoice_items")
    .insert(itemsWithInvoiceId)
    .select();

  if (itemsError) throw itemsError;

  return {
    invoice: invoiceData as Invoice,
    items: itemsData as InvoiceItem[],
  };
}

export async function updateInvoiceStatus(
  id: string,
  status: Invoice["status"],
  paidAmount?: number,
) {
  const updates: Partial<Invoice> = { status };

  if (paidAmount !== undefined) {
    updates.paid_amount = paidAmount;
  }

  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
}
