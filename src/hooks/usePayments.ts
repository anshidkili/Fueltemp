import { useSupabaseQuery } from "./useSupabase";
import { getPayments, getPaymentById } from "../api/payments";

export function usePayments(customerId: string) {
  return useSupabaseQuery(() => getPayments(customerId), [customerId]);
}

export function usePayment(paymentId: string) {
  return useSupabaseQuery(() => getPaymentById(paymentId), [paymentId]);
}
