import { useSupabaseQuery } from "./useSupabase";
import { getInvoices, getInvoiceById, getInvoiceItems } from "../api/invoices";

export function useInvoices(customerId: string) {
  return useSupabaseQuery(() => getInvoices(customerId), [customerId]);
}

export function useInvoice(invoiceId: string) {
  return useSupabaseQuery(() => getInvoiceById(invoiceId), [invoiceId]);
}

export function useInvoiceItems(invoiceId: string) {
  return useSupabaseQuery(() => getInvoiceItems(invoiceId), [invoiceId]);
}
