import { supabase } from "../lib/supabase";

export interface Payment {
  id: string;
  customer_id: string;
  invoice_id: string | null;
  amount: number;
  payment_date: string;
  payment_method: "cash" | "bank_transfer" | "credit_card" | "check";
  reference_number: string | null;
  notes: string | null;
  created_at: string;
}

export interface PaymentWithDetails extends Payment {
  customers: {
    company_name: string;
    profiles: {
      full_name: string;
    };
  };
  invoices?: {
    invoice_number: string;
    total_amount: number;
  };
}

export async function getPayments(customerId: string) {
  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      *,
      customers(company_name, profiles(full_name)),
      invoices(invoice_number, total_amount)
    `,
    )
    .eq("customer_id", customerId)
    .order("payment_date", { ascending: false });

  if (error) throw error;
  return data as PaymentWithDetails[];
}

export async function getPaymentById(id: string) {
  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      *,
      customers(company_name, profiles(full_name)),
      invoices(invoice_number, total_amount)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as PaymentWithDetails;
}

export async function createPayment(
  payment: Omit<Payment, "id" | "created_at">,
) {
  // This would typically be a database function to handle the payment and update invoice status
  // For now, we'll simulate with client-side logic
  const { data, error } = await supabase
    .from("payments")
    .insert([payment])
    .select()
    .single();

  if (error) throw error;

  // If this payment is for an invoice, update the invoice status
  if (payment.invoice_id) {
    // Get the invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("total_amount, paid_amount")
      .eq("id", payment.invoice_id)
      .single();

    if (invoiceError) throw invoiceError;

    // Calculate new paid amount
    const newPaidAmount = (invoice.paid_amount || 0) + payment.amount;

    // Determine new status
    let newStatus: "paid" | "partially_paid" | "pending";
    if (newPaidAmount >= invoice.total_amount) {
      newStatus = "paid";
    } else if (newPaidAmount > 0) {
      newStatus = "partially_paid";
    } else {
      newStatus = "pending";
    }

    // Update the invoice
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        paid_amount: newPaidAmount,
        status: newStatus,
      })
      .eq("id", payment.invoice_id);

    if (updateError) throw updateError;
  }

  return data as Payment;
}
