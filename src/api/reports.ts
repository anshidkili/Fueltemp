import connectToDatabase from "../lib/mongodb";
import Sale from "../models/Sale";
import Inventory from "../models/Inventory";
import FuelType from "../models/FuelType";
import Customer from "../models/Customer";
import User from "../models/User";

export interface SalesSummary {
  total_sales: number;
  total_volume: number;
  transaction_count: number;
  average_transaction: number;
  by_fuel_type: {
    fuel_type: string;
    volume: number;
    amount: number;
    count: number;
  }[];
  by_payment_method: {
    payment_method: string;
    amount: number;
    count: number;
  }[];
  by_date: {
    date: string;
    amount: number;
    volume: number;
    count: number;
  }[];
}

export interface InventorySummary {
  fuel_type: string;
  current_level: number;
  capacity: number;
  percentage: number;
  last_delivery_date: string | null;
  last_delivery_amount: number | null;
}

export interface CustomerSummary {
  customer_id: string;
  company_name: string;
  contact_name: string;
  total_purchases: number;
  current_balance: number;
  credit_limit: number;
  available_credit: number;
  last_purchase_date: string | null;
}

export async function getSalesSummary(
  stationId: string,
  startDate: string,
  endDate: string,
) {
  try {
    await connectToDatabase();

    // Convert string dates to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // End of the day

    // Get all sales for the station within the date range
    const sales = await Sale.find({
      station_id: stationId,
      transaction_date: { $gte: start, $lte: end },
    }).lean();

    // Calculate total sales
    const totalSales = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
    const totalVolume = sales.reduce(
      (sum, sale) => sum + sale.quantity_liters,
      0,
    );
    const transactionCount = sales.length;
    const averageTransaction =
      transactionCount > 0 ? totalSales / transactionCount : 0;

    // Group by fuel type
    const fuelTypeMap = new Map();
    for (const sale of sales) {
      const fuelType = await FuelType.findById(sale.fuel_type_id).lean();
      const fuelTypeName = fuelType.name;

      if (!fuelTypeMap.has(fuelTypeName)) {
        fuelTypeMap.set(fuelTypeName, { volume: 0, amount: 0, count: 0 });
      }

      const current = fuelTypeMap.get(fuelTypeName);
      current.volume += sale.quantity_liters;
      current.amount += sale.total_amount;
      current.count += 1;
      fuelTypeMap.set(fuelTypeName, current);
    }

    const byFuelType = Array.from(fuelTypeMap.entries()).map(
      ([fuel_type, data]) => ({
        fuel_type,
        ...data,
      }),
    );

    // Group by payment method
    const paymentMethodMap = new Map();
    for (const sale of sales) {
      if (!paymentMethodMap.has(sale.payment_method)) {
        paymentMethodMap.set(sale.payment_method, { amount: 0, count: 0 });
      }

      const current = paymentMethodMap.get(sale.payment_method);
      current.amount += sale.total_amount;
      current.count += 1;
      paymentMethodMap.set(sale.payment_method, current);
    }

    const byPaymentMethod = Array.from(paymentMethodMap.entries()).map(
      ([payment_method, data]) => ({
        payment_method,
        ...data,
      }),
    );

    // Group by date
    const dateMap = new Map();
    for (const sale of sales) {
      const date = sale.transaction_date.toISOString().split("T")[0];

      if (!dateMap.has(date)) {
        dateMap.set(date, { amount: 0, volume: 0, count: 0 });
      }

      const current = dateMap.get(date);
      current.amount += sale.total_amount;
      current.volume += sale.quantity_liters;
      current.count += 1;
      dateMap.set(date, current);
    }

    const byDate = Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));

    return {
      total_sales: totalSales,
      total_volume: totalVolume,
      transaction_count: transactionCount,
      average_transaction: averageTransaction,
      by_fuel_type: byFuelType,
      by_payment_method: byPaymentMethod,
      by_date: byDate,
    } as SalesSummary;
  } catch (error) {
    console.error("Error getting sales summary:", error);
    throw error;
  }
}

export async function getInventorySummary(stationId: string) {
  try {
    await connectToDatabase();

    const inventory = await Inventory.find({ station_id: stationId }).lean();

    const summaries = await Promise.all(
      inventory.map(async (item) => {
        const fuelType = await FuelType.findById(item.fuel_type_id).lean();

        // For this example, we'll use fixed capacities
        // In a real app, this would come from a tank configuration
        const capacity = 20000; // Example capacity in liters
        const percentage = (item.quantity_liters / capacity) * 100;

        // In a real app, you would query delivery records
        // For now, we'll use the last_updated as a proxy

        return {
          fuel_type: fuelType.name,
          current_level: item.quantity_liters,
          capacity,
          percentage,
          last_delivery_date: item.last_updated.toISOString(),
          last_delivery_amount: null, // Would come from delivery records
        };
      }),
    );

    return summaries as InventorySummary[];
  } catch (error) {
    console.error("Error getting inventory summary:", error);
    throw error;
  }
}

export async function getCustomerSummary(stationId: string) {
  try {
    await connectToDatabase();

    const customers = await Customer.find().lean();

    const summaries = await Promise.all(
      customers.map(async (customer) => {
        const user = await User.findById(customer.user_id).lean();

        // Get total purchases (in a real app, filter by station_id)
        const sales = await Sale.find({
          customer_id: customer._id,
          // station_id: stationId // Uncomment in real app
        })
          .sort({ transaction_date: -1 })
          .lean();

        const totalPurchases = sales.reduce(
          (sum, sale) => sum + sale.total_amount,
          0,
        );
        const lastPurchaseDate =
          sales.length > 0 ? sales[0].transaction_date.toISOString() : null;

        return {
          customer_id: customer._id.toString(),
          company_name: customer.company_name,
          contact_name: user.full_name,
          total_purchases: totalPurchases,
          current_balance: customer.current_balance,
          credit_limit: customer.credit_limit,
          available_credit: customer.credit_limit - customer.current_balance,
          last_purchase_date: lastPurchaseDate,
        };
      }),
    );

    return summaries as CustomerSummary[];
  } catch (error) {
    console.error("Error getting customer summary:", error);
    throw error;
  }
}

export async function getFinancialReport(
  stationId: string,
  startDate: string,
  endDate: string,
) {
  try {
    await connectToDatabase();

    // This would be a more complex report combining sales, expenses, etc.
    // For now, we'll return a simplified version based on sales data

    const salesSummary = await getSalesSummary(stationId, startDate, endDate);

    // In a real app, you would calculate expenses, profits, etc.

    return {
      period: {
        start_date: startDate,
        end_date: endDate,
      },
      revenue: {
        total: salesSummary.total_sales,
        by_fuel_type: salesSummary.by_fuel_type,
        by_payment_method: salesSummary.by_payment_method,
      },
      expenses: {
        total: 0, // Would come from expenses collection
        categories: [],
      },
      profit: salesSummary.total_sales, // In a real app: revenue - expenses
      transactions: salesSummary.transaction_count,
    };
  } catch (error) {
    console.error("Error getting financial report:", error);
    throw error;
  }
}
