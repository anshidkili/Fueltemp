import { dataService } from "../lib/supabase";

// Mock sales data
const mockSales = [
  {
    id: "1",
    station_id: "1",
    dispenser_id: "1",
    employee_id: "1",
    customer_id: "1",
    vehicle_id: "1",
    fuel_type_id: "1",
    quantity_liters: 50,
    price_per_liter: 3.5,
    total_amount: 175.0,
    payment_method: "cash",
    transaction_date: "2023-06-15T10:30:00",
    created_at: "2023-06-15T10:30:00",
    dispensers: { dispenser_number: 1 },
    fuel_types: { name: "Regular Unleaded" },
    employees: { profiles: { full_name: "John Smith" } },
    customers: {
      company_name: "ABC Logistics",
      profiles: { full_name: "John Doe" },
    },
    vehicles: { license_plate: "ABC-123", make: "Toyota", model: "Hilux" },
  },
  {
    id: "2",
    station_id: "1",
    dispenser_id: "2",
    employee_id: "2",
    customer_id: "1",
    vehicle_id: "2",
    fuel_type_id: "3",
    quantity_liters: 75,
    price_per_liter: 3.8,
    total_amount: 285.0,
    payment_method: "credit_account",
    transaction_date: "2023-06-14T14:15:00",
    created_at: "2023-06-14T14:15:00",
    dispensers: { dispenser_number: 2 },
    fuel_types: { name: "Diesel" },
    employees: { profiles: { full_name: "Emily Johnson" } },
    customers: {
      company_name: "ABC Logistics",
      profiles: { full_name: "John Doe" },
    },
    vehicles: { license_plate: "ABC-456", make: "Isuzu", model: "NPR" },
  },
];

export interface Sale {
  id: string;
  station_id: string;
  dispenser_id: string;
  employee_id: string;
  customer_id: string | null;
  vehicle_id: string | null;
  fuel_type_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_amount: number;
  payment_method: "cash" | "credit_card" | "credit_account";
  transaction_date: string;
  created_at: string;
}

export interface SaleWithDetails extends Sale {
  dispensers: {
    dispenser_number: number;
  };
  fuel_types: {
    name: string;
  };
  employees: {
    profiles: {
      full_name: string;
    };
  };
  customers?: {
    company_name: string;
    profiles: {
      full_name: string;
    };
  };
  vehicles?: {
    license_plate: string;
    make: string;
    model: string;
  };
}

export async function getSales(
  stationId: string,
  startDate?: string,
  endDate?: string,
) {
  // Mock implementation using the mock data
  console.log(`Getting sales for station ${stationId}`);
  if (startDate) console.log(`Start date: ${startDate}`);
  if (endDate) console.log(`End date: ${endDate}`);

  // Filter by station ID
  let filteredSales = mockSales.filter((sale) => sale.station_id === stationId);

  // Filter by date range if provided
  if (startDate) {
    filteredSales = filteredSales.filter(
      (sale) => new Date(sale.transaction_date) >= new Date(startDate),
    );
  }

  if (endDate) {
    filteredSales = filteredSales.filter(
      (sale) => new Date(sale.transaction_date) <= new Date(endDate),
    );
  }

  // Sort by transaction date (descending)
  filteredSales.sort(
    (a, b) =>
      new Date(b.transaction_date).getTime() -
      new Date(a.transaction_date).getTime(),
  );

  return filteredSales as SaleWithDetails[];
}

export async function getSaleById(id: string) {
  // Mock implementation
  console.log(`Getting sale with ID ${id}`);
  const sale = mockSales.find((sale) => sale.id === id);

  if (!sale) {
    throw new Error(`Sale with ID ${id} not found`);
  }

  return sale as SaleWithDetails;
}

export async function createSale(sale: Omit<Sale, "id" | "created_at">) {
  // Mock implementation
  console.log("Creating new sale:", sale);

  const newSale = {
    ...sale,
    id: `sale-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  // In a real implementation, this would be saved to the database
  mockSales.push(newSale as any);

  return newSale as Sale;
}

export async function getCustomerSales(
  customerId: string,
  startDate?: string,
  endDate?: string,
) {
  // Mock implementation
  console.log(`Getting sales for customer ${customerId}`);
  if (startDate) console.log(`Start date: ${startDate}`);
  if (endDate) console.log(`End date: ${endDate}`);

  // Filter by customer ID
  let filteredSales = mockSales.filter(
    (sale) => sale.customer_id === customerId,
  );

  // Filter by date range if provided
  if (startDate) {
    filteredSales = filteredSales.filter(
      (sale) => new Date(sale.transaction_date) >= new Date(startDate),
    );
  }

  if (endDate) {
    filteredSales = filteredSales.filter(
      (sale) => new Date(sale.transaction_date) <= new Date(endDate),
    );
  }

  // Sort by transaction date (descending)
  filteredSales.sort(
    (a, b) =>
      new Date(b.transaction_date).getTime() -
      new Date(a.transaction_date).getTime(),
  );

  return filteredSales;
}

export async function getVehicleSales(
  vehicleId: string,
  startDate?: string,
  endDate?: string,
) {
  // Mock implementation
  console.log(`Getting sales for vehicle ${vehicleId}`);
  if (startDate) console.log(`Start date: ${startDate}`);
  if (endDate) console.log(`End date: ${endDate}`);

  // Filter by vehicle ID
  let filteredSales = mockSales.filter((sale) => sale.vehicle_id === vehicleId);

  // Filter by date range if provided
  if (startDate) {
    filteredSales = filteredSales.filter(
      (sale) => new Date(sale.transaction_date) >= new Date(startDate),
    );
  }

  if (endDate) {
    filteredSales = filteredSales.filter(
      (sale) => new Date(sale.transaction_date) <= new Date(endDate),
    );
  }

  // Sort by transaction date (descending)
  filteredSales.sort(
    (a, b) =>
      new Date(b.transaction_date).getTime() -
      new Date(a.transaction_date).getTime(),
  );

  return filteredSales;
}
