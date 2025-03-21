// Mock stations data
const mockStations = [
  {
    id: "1",
    name: "Central City Fuel Station",
    address: "123 Main Street",
    city: "Central City",
    state: "CA",
    zip: "90001",
    phone: "555-123-4567",
    manager_id: "1",
    created_at: "2023-01-15T08:00:00",
    status: "active",
  },
  {
    id: "2",
    name: "Westside Fuel Station",
    address: "456 West Avenue",
    city: "Westside",
    state: "CA",
    zip: "90002",
    phone: "555-987-6543",
    manager_id: "2",
    created_at: "2023-02-20T09:30:00",
    status: "active",
  },
  {
    id: "3",
    name: "Eastside Fuel Station",
    address: "789 East Boulevard",
    city: "Eastside",
    state: "CA",
    zip: "90003",
    phone: "555-456-7890",
    manager_id: "3",
    created_at: "2023-03-10T10:15:00",
    status: "maintenance",
  },
];

// Mock station metrics data
const mockStationMetrics = {
  "1": {
    station_id: "1",
    total_sales: 125000,
    fuel_inventory: 25000,
    employee_count: 8,
    active_dispensers: 6,
    maintenance_dispensers: 0,
    credit_customer_count: 15,
    last_updated: "2023-06-15T12:00:00",
  },
  "2": {
    station_id: "2",
    total_sales: 98000,
    fuel_inventory: 18000,
    employee_count: 6,
    active_dispensers: 4,
    maintenance_dispensers: 1,
    credit_customer_count: 10,
    last_updated: "2023-06-15T12:00:00",
  },
  "3": {
    station_id: "3",
    total_sales: 75000,
    fuel_inventory: 12000,
    employee_count: 5,
    active_dispensers: 3,
    maintenance_dispensers: 2,
    credit_customer_count: 8,
    last_updated: "2023-06-15T12:00:00",
  },
};

export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  manager_id: string | null;
  created_at: string;
  status: "active" | "inactive" | "maintenance";
}

export interface StationWithStats extends Station {
  total_sales?: number;
  fuel_inventory?: number;
  employee_count?: number;
}

export async function getStations() {
  console.log("Getting all stations");
  return [...mockStations] as Station[];
}

export async function getStationById(id: string) {
  console.log(`Getting station with ID ${id}`);
  const station = mockStations.find((station) => station.id === id);

  if (!station) {
    throw new Error(`Station with ID ${id} not found`);
  }

  return { ...station } as Station;
}

export async function createStation(
  station: Omit<Station, "id" | "created_at">,
) {
  console.log("Creating new station:", station);

  const newStation = {
    ...station,
    id: `station-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  // In a real implementation, this would be saved to the database
  mockStations.push(newStation as any);

  return newStation as Station;
}

export async function updateStation(id: string, updates: Partial<Station>) {
  console.log(`Updating station ${id}:`, updates);

  const stationIndex = mockStations.findIndex((station) => station.id === id);

  if (stationIndex === -1) {
    throw new Error(`Station with ID ${id} not found`);
  }

  const updatedStation = {
    ...mockStations[stationIndex],
    ...updates,
  };

  mockStations[stationIndex] = updatedStation;

  return updatedStation as Station;
}

export async function deleteStation(id: string) {
  console.log(`Deleting station ${id}`);

  const stationIndex = mockStations.findIndex((station) => station.id === id);

  if (stationIndex === -1) {
    throw new Error(`Station with ID ${id} not found`);
  }

  mockStations.splice(stationIndex, 1);

  return true;
}

export async function getStationMetrics(stationId: string) {
  console.log(`Getting metrics for station ${stationId}`);

  const metrics = mockStationMetrics[stationId];

  if (!metrics) {
    throw new Error(`Metrics for station ${stationId} not found`);
  }

  return { ...metrics };
}
