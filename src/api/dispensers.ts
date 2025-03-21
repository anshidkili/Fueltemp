import connectToDatabase from "../lib/mongodb";
import Dispenser from "../models/Dispenser";
import FuelType from "../models/FuelType";

export interface Dispenser {
  id: string;
  station_id: string;
  dispenser_number: number;
  fuel_type_id: string;
  status: "operational" | "maintenance" | "offline";
  current_meter_reading: number;
  created_at: string;
}

export interface DispenserWithFuelType extends Dispenser {
  fuel_types: {
    name: string;
    price_per_liter: number;
  };
}

export async function getDispensers(stationId: string) {
  try {
    await connectToDatabase();

    const dispensers = await Dispenser.find({ station_id: stationId }).lean();

    // Get fuel type for each dispenser
    const dispensersWithFuelTypes = await Promise.all(
      dispensers.map(async (dispenser) => {
        const fuelType = await FuelType.findById(dispenser.fuel_type_id).lean();

        return {
          id: dispenser._id.toString(),
          station_id: dispenser.station_id.toString(),
          dispenser_number: dispenser.dispenser_number,
          fuel_type_id: dispenser.fuel_type_id.toString(),
          status: dispenser.status,
          current_meter_reading: dispenser.current_meter_reading,
          created_at: dispenser.created_at.toISOString(),
          fuel_types: {
            name: fuelType.name,
            price_per_liter: fuelType.price_per_liter,
          },
        };
      }),
    );

    return dispensersWithFuelTypes as DispenserWithFuelType[];
  } catch (error) {
    console.error("Error getting dispensers:", error);
    throw error;
  }
}

export async function getDispenserById(id: string) {
  try {
    await connectToDatabase();

    const dispenser = await Dispenser.findById(id).lean();
    if (!dispenser) throw new Error("Dispenser not found");

    const fuelType = await FuelType.findById(dispenser.fuel_type_id).lean();

    return {
      id: dispenser._id.toString(),
      station_id: dispenser.station_id.toString(),
      dispenser_number: dispenser.dispenser_number,
      fuel_type_id: dispenser.fuel_type_id.toString(),
      status: dispenser.status,
      current_meter_reading: dispenser.current_meter_reading,
      created_at: dispenser.created_at.toISOString(),
      fuel_types: {
        name: fuelType.name,
        price_per_liter: fuelType.price_per_liter,
      },
    } as DispenserWithFuelType;
  } catch (error) {
    console.error("Error getting dispenser by ID:", error);
    throw error;
  }
}

export async function createDispenser(
  dispenser: Omit<Dispenser, "id" | "created_at">,
) {
  try {
    await connectToDatabase();

    const newDispenser = await Dispenser.create({
      station_id: dispenser.station_id,
      dispenser_number: dispenser.dispenser_number,
      fuel_type_id: dispenser.fuel_type_id,
      status: dispenser.status,
      current_meter_reading: dispenser.current_meter_reading || 0,
    });

    return {
      id: newDispenser._id.toString(),
      station_id: newDispenser.station_id.toString(),
      dispenser_number: newDispenser.dispenser_number,
      fuel_type_id: newDispenser.fuel_type_id.toString(),
      status: newDispenser.status,
      current_meter_reading: newDispenser.current_meter_reading,
      created_at: newDispenser.created_at.toISOString(),
    } as Dispenser;
  } catch (error) {
    console.error("Error creating dispenser:", error);
    throw error;
  }
}

export async function updateDispenser(id: string, updates: Partial<Dispenser>) {
  try {
    await connectToDatabase();

    const updatedDispenser = await Dispenser.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedDispenser) throw new Error("Dispenser not found");

    return {
      id: updatedDispenser._id.toString(),
      station_id: updatedDispenser.station_id.toString(),
      dispenser_number: updatedDispenser.dispenser_number,
      fuel_type_id: updatedDispenser.fuel_type_id.toString(),
      status: updatedDispenser.status,
      current_meter_reading: updatedDispenser.current_meter_reading,
      created_at: updatedDispenser.created_at.toISOString(),
    } as Dispenser;
  } catch (error) {
    console.error("Error updating dispenser:", error);
    throw error;
  }
}

export async function updateMeterReading(id: string, reading: number) {
  try {
    await connectToDatabase();

    const updatedDispenser = await Dispenser.findByIdAndUpdate(
      id,
      { current_meter_reading: reading },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedDispenser) throw new Error("Dispenser not found");

    return {
      id: updatedDispenser._id.toString(),
      station_id: updatedDispenser.station_id.toString(),
      dispenser_number: updatedDispenser.dispenser_number,
      fuel_type_id: updatedDispenser.fuel_type_id.toString(),
      status: updatedDispenser.status,
      current_meter_reading: updatedDispenser.current_meter_reading,
      created_at: updatedDispenser.created_at.toISOString(),
    } as Dispenser;
  } catch (error) {
    console.error("Error updating meter reading:", error);
    throw error;
  }
}

export async function deleteDispenser(id: string) {
  try {
    await connectToDatabase();

    const result = await Dispenser.findByIdAndDelete(id);
    if (!result) throw new Error("Dispenser not found");

    return true;
  } catch (error) {
    console.error("Error deleting dispenser:", error);
    throw error;
  }
}
