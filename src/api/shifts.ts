import connectToDatabase from "../lib/mongodb";
import Shift from "../models/Shift";
import Employee from "../models/Employee";
import User from "../models/User";
import Dispenser from "../models/Dispenser";
import FuelType from "../models/FuelType";

export interface Shift {
  id: string;
  station_id: string;
  employee_id: string;
  dispenser_id: string;
  start_time: string;
  end_time: string | null;
  initial_cash: number;
  final_cash: number | null;
  fuel_readings: Array<{
    fuel_type: string;
    initial_reading: number;
    final_reading?: number;
  }>;
  notes: string;
  status: "active" | "completed";
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
  try {
    await connectToDatabase();

    const shift = await Shift.findOne({
      employee_id: employeeId,
      status: "active",
    }).lean();

    if (!shift) return null;

    const employee = await Employee.findById(shift.employee_id).lean();
    const user = await User.findById(employee.user_id).lean();

    return {
      id: shift._id.toString(),
      station_id: shift.station_id.toString(),
      employee_id: shift.employee_id.toString(),
      dispenser_id: shift.dispenser_id.toString(),
      start_time: shift.start_time.toISOString(),
      end_time: shift.end_time ? shift.end_time.toISOString() : null,
      initial_cash: shift.initial_cash,
      final_cash: shift.final_cash,
      fuel_readings: shift.fuel_readings,
      notes: shift.notes,
      status: shift.status,
      created_at: shift.created_at.toISOString(),
      employees: {
        profiles: {
          full_name: user.full_name,
        },
      },
    } as ShiftWithEmployee;
  } catch (error) {
    console.error("Error getting current shift:", error);
    throw error;
  }
}

export async function getShifts(
  stationId: string,
  startDate?: string,
  endDate?: string,
) {
  try {
    await connectToDatabase();

    let query: any = { station_id: stationId };

    if (startDate) {
      query.start_time = { $gte: new Date(startDate) };
    }

    if (endDate) {
      if (!query.start_time) query.start_time = {};
      query.start_time.$lte = new Date(endDate);
    }

    const shifts = await Shift.find(query).sort({ start_time: -1 }).lean();

    const shiftsWithEmployees = await Promise.all(
      shifts.map(async (shift) => {
        const employee = await Employee.findById(shift.employee_id).lean();
        const user = await User.findById(employee.user_id).lean();

        return {
          id: shift._id.toString(),
          station_id: shift.station_id.toString(),
          employee_id: shift.employee_id.toString(),
          dispenser_id: shift.dispenser_id.toString(),
          start_time: shift.start_time.toISOString(),
          end_time: shift.end_time ? shift.end_time.toISOString() : null,
          initial_cash: shift.initial_cash,
          final_cash: shift.final_cash,
          fuel_readings: shift.fuel_readings,
          notes: shift.notes,
          status: shift.status,
          created_at: shift.created_at.toISOString(),
          employees: {
            profiles: {
              full_name: user.full_name,
            },
          },
        };
      }),
    );

    return shiftsWithEmployees as ShiftWithEmployee[];
  } catch (error) {
    console.error("Error getting shifts:", error);
    throw error;
  }
}

export async function getShiftById(id: string) {
  try {
    await connectToDatabase();

    const shift = await Shift.findById(id).lean();
    if (!shift) throw new Error("Shift not found");

    const employee = await Employee.findById(shift.employee_id).lean();
    const user = await User.findById(employee.user_id).lean();

    return {
      id: shift._id.toString(),
      station_id: shift.station_id.toString(),
      employee_id: shift.employee_id.toString(),
      dispenser_id: shift.dispenser_id.toString(),
      start_time: shift.start_time.toISOString(),
      end_time: shift.end_time ? shift.end_time.toISOString() : null,
      initial_cash: shift.initial_cash,
      final_cash: shift.final_cash,
      fuel_readings: shift.fuel_readings,
      notes: shift.notes,
      status: shift.status,
      created_at: shift.created_at.toISOString(),
      employees: {
        profiles: {
          full_name: user.full_name,
        },
      },
    } as ShiftWithEmployee;
  } catch (error) {
    console.error("Error getting shift by ID:", error);
    throw error;
  }
}

export async function startShift(shift: {
  station_id: string;
  employee_id: string;
  dispenser_id: string;
  initial_cash: number;
  fuel_readings: Array<{
    fuel_type: string;
    initial_reading: number;
  }>;
  notes: string;
}) {
  try {
    await connectToDatabase();

    // First check if there's already an active shift
    const existingShift = await Shift.findOne({
      employee_id: shift.employee_id,
      status: "active",
    });

    if (existingShift) {
      throw new Error("Employee already has an active shift");
    }

    const newShift = await Shift.create({
      ...shift,
      start_time: new Date(),
      status: "active",
    });

    return {
      id: newShift._id.toString(),
      station_id: newShift.station_id.toString(),
      employee_id: newShift.employee_id.toString(),
      dispenser_id: newShift.dispenser_id.toString(),
      start_time: newShift.start_time.toISOString(),
      end_time: null,
      initial_cash: newShift.initial_cash,
      final_cash: null,
      fuel_readings: newShift.fuel_readings,
      notes: newShift.notes,
      status: newShift.status,
      created_at: newShift.created_at.toISOString(),
    } as Shift;
  } catch (error) {
    console.error("Error starting shift:", error);
    throw error;
  }
}

export async function endShift(
  id: string,
  finalReadings: Record<string, number>,
  cashCollected: number,
  notes?: string,
) {
  try {
    await connectToDatabase();

    const shift = await Shift.findById(id);
    if (!shift) throw new Error("Shift not found");

    // Update fuel readings with final readings
    const updatedFuelReadings = shift.fuel_readings.map((reading) => {
      const fuelTypeId = reading.fuel_type.toString();
      if (finalReadings[fuelTypeId]) {
        return {
          ...reading.toObject(),
          final_reading: finalReadings[fuelTypeId],
        };
      }
      return reading;
    });

    const updatedShift = await Shift.findByIdAndUpdate(
      id,
      {
        end_time: new Date(),
        final_cash: cashCollected,
        fuel_readings: updatedFuelReadings,
        notes: notes || shift.notes,
        status: "completed",
      },
      { new: true, runValidators: true },
    ).lean();

    return {
      id: updatedShift._id.toString(),
      station_id: updatedShift.station_id.toString(),
      employee_id: updatedShift.employee_id.toString(),
      dispenser_id: updatedShift.dispenser_id.toString(),
      start_time: updatedShift.start_time.toISOString(),
      end_time: updatedShift.end_time.toISOString(),
      initial_cash: updatedShift.initial_cash,
      final_cash: updatedShift.final_cash,
      fuel_readings: updatedShift.fuel_readings,
      notes: updatedShift.notes,
      status: updatedShift.status,
      created_at: updatedShift.created_at.toISOString(),
    } as Shift;
  } catch (error) {
    console.error("Error ending shift:", error);
    throw error;
  }
}
