import connectToDatabase from "../lib/mongodb";
import Inventory from "../models/Inventory";
import FuelType from "../models/FuelType";

export interface FuelType {
  id: string;
  name: string;
  code: string;
  price_per_liter: number;
  created_at: string;
}

export interface Inventory {
  id: string;
  station_id: string;
  fuel_type_id: string;
  quantity_liters: number;
  last_updated: string;
  created_at: string;
}

export interface InventoryWithFuelType extends Inventory {
  fuel_types: FuelType;
}

export async function getFuelTypes() {
  try {
    await connectToDatabase();

    const fuelTypes = await FuelType.find().sort({ name: 1 }).lean();

    return fuelTypes.map((type) => ({
      id: type._id.toString(),
      name: type.name,
      code: type.code,
      price_per_liter: type.price_per_liter,
      created_at: type.created_at.toISOString(),
    })) as FuelType[];
  } catch (error) {
    console.error("Error getting fuel types:", error);
    throw error;
  }
}

export async function getInventory(stationId: string) {
  try {
    await connectToDatabase();

    const inventory = await Inventory.find({ station_id: stationId }).lean();

    // Get fuel type for each inventory item
    const inventoryWithFuelTypes = await Promise.all(
      inventory.map(async (item) => {
        const fuelType = await FuelType.findById(item.fuel_type_id).lean();

        return {
          id: item._id.toString(),
          station_id: item.station_id.toString(),
          fuel_type_id: item.fuel_type_id.toString(),
          quantity_liters: item.quantity_liters,
          last_updated: item.last_updated.toISOString(),
          created_at: item.created_at.toISOString(),
          fuel_types: {
            id: fuelType._id.toString(),
            name: fuelType.name,
            code: fuelType.code,
            price_per_liter: fuelType.price_per_liter,
            created_at: fuelType.created_at.toISOString(),
          },
        };
      }),
    );

    return inventoryWithFuelTypes as InventoryWithFuelType[];
  } catch (error) {
    console.error("Error getting inventory:", error);
    throw error;
  }
}

export async function updateInventory(id: string, quantity: number) {
  try {
    await connectToDatabase();

    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      {
        quantity_liters: quantity,
        last_updated: new Date(),
      },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedInventory) throw new Error("Inventory not found");

    return {
      id: updatedInventory._id.toString(),
      station_id: updatedInventory.station_id.toString(),
      fuel_type_id: updatedInventory.fuel_type_id.toString(),
      quantity_liters: updatedInventory.quantity_liters,
      last_updated: updatedInventory.last_updated.toISOString(),
      created_at: updatedInventory.created_at.toISOString(),
    } as Inventory;
  } catch (error) {
    console.error("Error updating inventory:", error);
    throw error;
  }
}

export async function addInventory(
  inventory: Omit<Inventory, "id" | "created_at" | "last_updated">,
) {
  try {
    await connectToDatabase();

    const newInventory = await Inventory.create({
      station_id: inventory.station_id,
      fuel_type_id: inventory.fuel_type_id,
      quantity_liters: inventory.quantity_liters,
      last_updated: new Date(),
    });

    return {
      id: newInventory._id.toString(),
      station_id: newInventory.station_id.toString(),
      fuel_type_id: newInventory.fuel_type_id.toString(),
      quantity_liters: newInventory.quantity_liters,
      last_updated: newInventory.last_updated.toISOString(),
      created_at: newInventory.created_at.toISOString(),
    } as Inventory;
  } catch (error) {
    console.error("Error adding inventory:", error);
    throw error;
  }
}
