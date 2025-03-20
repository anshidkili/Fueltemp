import { useSupabaseQuery } from "./useSupabase";
import { getEmployees, getEmployeeById } from "../api/employees";

export function useEmployees(stationId: string) {
  return useSupabaseQuery(() => getEmployees(stationId), [stationId]);
}

export function useEmployee(employeeId: string) {
  return useSupabaseQuery(() => getEmployeeById(employeeId), [employeeId]);
}
