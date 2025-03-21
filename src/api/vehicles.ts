// Mock vehicles data
const mockVehicles = [
  {
    id: "1",
    customer_id: "1",
    make: "Toyota",
    model: "Hilux",
    year: 2020,
    license_plate: "ABC-123",
    fuel_type_id: "1",
    status: "active",
    created_at: "2023-01-20T10:00:00",
    fuel_types: {
      name: "Regular Unleaded",
    },
  },
  {
    id: "2",
    customer_id: "1",
    make: "Isuzu",
    model: "NPR",
    year: 2019,
    license_plate: "ABC-456",
    fuel_type_id: "3",
    status: "active",
    created_at: "2023-02-15T11:30:00",
    fuel_types: {
      name: "Diesel",
    },
  },
  {
    id: "3",
    customer_id: "2",
    make: "Ford",
    model: "Transit",
    year: 2021,
    license_plate: "XYZ-789",
    fuel_type_id: "3",
    status: "active",
    created_at: "2023-03-05T09:15:00",
    fuel_types: {
      name: "Diesel",
    },
  },
];

export interface Vehicle {
  id: string;
  customer_id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  fuel_type_id: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface VehicleWithFuelType extends Vehicle {
  fuel_types: {
    name: string;
  };
}

export async function getVehicles(customerId: string) {
  console.log(`Getting vehicles for customer ${customerId}`);

  const vehicles = mockVehicles.filter(
    (vehicle) => vehicle.customer_id === customerId,
  );

  return [...vehicles] as VehicleWithFuelType[];
}

export async function getVehicleById(id: string) {
  console.log(`Getting vehicle with ID ${id}`);

  const vehicle = mockVehicles.find((vehicle) => vehicle.id === id);

  if (!vehicle) {
    throw new Error(`Vehicle with ID ${id} not found`);
  }

  return { ...vehicle } as VehicleWithFuelType;
}

export async function createVehicle(
  vehicle: Omit<Vehicle, "id" | "created_at">,
) {
  console.log("Creating new vehicle:", vehicle);

  const newVehicle = {
    ...vehicle,
    id: `vehicle-${Date.now()}`,
    created_at: new Date().toISOString(),
    fuel_types: {
      name:
        vehicle.fuel_type_id === "1"
          ? "Regular Unleaded"
          : vehicle.fuel_type_id === "2"
            ? "Premium Unleaded"
            : "Diesel",
    },
  };

  // In a real implementation, this would be saved to the database
  mockVehicles.push(newVehicle as any);

  return newVehicle as Vehicle;
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>) {
  console.log(`Updating vehicle ${id}:`, updates);

  const vehicleIndex = mockVehicles.findIndex((vehicle) => vehicle.id === id);

  if (vehicleIndex === -1) {
    throw new Error(`Vehicle with ID ${id} not found`);
  }

  const updatedVehicle = {
    ...mockVehicles[vehicleIndex],
    ...updates,
  };

  // Update fuel type name if fuel_type_id was changed
  if (updates.fuel_type_id) {
    updatedVehicle.fuel_types = {
      name:
        updates.fuel_type_id === "1"
          ? "Regular Unleaded"
          : updates.fuel_type_id === "2"
            ? "Premium Unleaded"
            : "Diesel",
    };
  }

  mockVehicles[vehicleIndex] = updatedVehicle;

  return updatedVehicle as Vehicle;
}

export async function deleteVehicle(id: string) {
  console.log(`Deleting vehicle ${id}`);

  const vehicleIndex = mockVehicles.findIndex((vehicle) => vehicle.id === id);

  if (vehicleIndex === -1) {
    throw new Error(`Vehicle with ID ${id} not found`);
  }

  mockVehicles.splice(vehicleIndex, 1);

  return true;
}
