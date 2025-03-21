// Mock data service for the application
// This file provides a mock implementation that will be replaced with a real database connection

class MockDataService {
  private static instance: MockDataService;

  private constructor() {}

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  // Mock methods to simulate database operations
  async query(table: string, options: any = {}) {
    console.log(`Mock query on ${table} with options:`, options);
    return { data: [], error: null };
  }

  async insert(table: string, data: any) {
    console.log(`Mock insert into ${table}:`, data);
    return { data: { ...data, id: `mock-${Date.now()}` }, error: null };
  }

  async update(table: string, data: any, conditions: any) {
    console.log(`Mock update on ${table}:`, data, conditions);
    return { data, error: null };
  }

  async delete(table: string, conditions: any) {
    console.log(`Mock delete from ${table}:`, conditions);
    return { error: null };
  }

  // Mock method for RPC calls
  async rpc(functionName: string, params: any) {
    console.log(`Mock RPC call to ${functionName}:`, params);
    return { data: {}, error: null };
  }

  // Mock method for real-time subscriptions
  channel(channelName: string) {
    return {
      on: () => ({
        subscribe: () => console.log(`Mock subscription to ${channelName}`),
      }),
      unsubscribe: () => console.log(`Mock unsubscribe from ${channelName}`),
    };
  }
}

export const dataService = MockDataService.getInstance();
