import { useSupabaseQuery, useSupabaseSubscription } from "./useSupabase";
import { getShifts, getShiftById, getCurrentShift } from "../api/shifts";

export function useShifts(
  stationId: string,
  startDate?: string,
  endDate?: string,
) {
  return useSupabaseQuery(
    () => getShifts(stationId, startDate, endDate),
    [stationId, startDate, endDate],
  );
}

export function useShift(shiftId: string) {
  return useSupabaseQuery(() => getShiftById(shiftId), [shiftId]);
}

export function useCurrentShift(employeeId: string) {
  return useSupabaseSubscription("shifts", "employee_id", employeeId, () =>
    getCurrentShift(employeeId).then((shift) => (shift ? [shift] : [])),
  );
}
