import { useSupabaseQuery } from "./useSupabase";
import { getCustomers, getCustomerById } from "../api/customers";

export function useCustomers() {
  return useSupabaseQuery(getCustomers, []);
}

export function useCustomer(customerId: string) {
  return useSupabaseQuery(() => getCustomerById(customerId), [customerId]);
}
