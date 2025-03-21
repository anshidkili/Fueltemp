import connectToDatabase from "../lib/mongodb";
import Customer from "../models/Customer";
import User from "../models/User";

export interface Customer {
  id: string;
  user_id: string;
  company_name: string;
  credit_limit: number;
  current_balance: number;
  payment_terms: string;
  status: "active" | "inactive" | "suspended";
  created_at: string;
}

export interface CustomerWithProfile extends Customer {
  profiles: {
    full_name: string;
    email: string;
    phone: string;
    avatar_url?: string;
  };
}

export async function getCustomers() {
  try {
    await connectToDatabase();

    const customers = await Customer.find().lean();

    // Get user profiles for each customer
    const customersWithProfiles = await Promise.all(
      customers.map(async (customer) => {
        const user = await User.findById(customer.user_id).lean();

        return {
          id: customer._id.toString(),
          user_id: customer.user_id.toString(),
          company_name: customer.company_name,
          credit_limit: customer.credit_limit,
          current_balance: customer.current_balance,
          payment_terms: customer.payment_terms,
          status: customer.status,
          created_at: customer.created_at.toISOString(),
          profiles: {
            full_name: user.full_name,
            email: user.email,
            phone: user.phone || "",
            avatar_url: user.avatar_url,
          },
        };
      }),
    );

    return customersWithProfiles as CustomerWithProfile[];
  } catch (error) {
    console.error("Error getting customers:", error);
    throw error;
  }
}

export async function getCustomerById(id: string) {
  try {
    await connectToDatabase();

    const customer = await Customer.findById(id).lean();
    if (!customer) throw new Error("Customer not found");

    const user = await User.findById(customer.user_id).lean();

    return {
      id: customer._id.toString(),
      user_id: customer.user_id.toString(),
      company_name: customer.company_name,
      credit_limit: customer.credit_limit,
      current_balance: customer.current_balance,
      payment_terms: customer.payment_terms,
      status: customer.status,
      created_at: customer.created_at.toISOString(),
      profiles: {
        full_name: user.full_name,
        email: user.email,
        phone: user.phone || "",
        avatar_url: user.avatar_url,
      },
    } as CustomerWithProfile;
  } catch (error) {
    console.error("Error getting customer by ID:", error);
    throw error;
  }
}

export async function createCustomer(
  customer: Omit<Customer, "id" | "created_at">,
) {
  try {
    await connectToDatabase();

    const newCustomer = await Customer.create({
      user_id: customer.user_id,
      company_name: customer.company_name,
      credit_limit: customer.credit_limit,
      current_balance: customer.current_balance || 0,
      payment_terms: customer.payment_terms,
      status: customer.status,
    });

    return {
      id: newCustomer._id.toString(),
      user_id: newCustomer.user_id.toString(),
      company_name: newCustomer.company_name,
      credit_limit: newCustomer.credit_limit,
      current_balance: newCustomer.current_balance,
      payment_terms: newCustomer.payment_terms,
      status: newCustomer.status,
      created_at: newCustomer.created_at.toISOString(),
    } as Customer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

export async function updateCustomer(id: string, updates: Partial<Customer>) {
  try {
    await connectToDatabase();

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedCustomer) throw new Error("Customer not found");

    return {
      id: updatedCustomer._id.toString(),
      user_id: updatedCustomer.user_id.toString(),
      company_name: updatedCustomer.company_name,
      credit_limit: updatedCustomer.credit_limit,
      current_balance: updatedCustomer.current_balance,
      payment_terms: updatedCustomer.payment_terms,
      status: updatedCustomer.status,
      created_at: updatedCustomer.created_at.toISOString(),
    } as Customer;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
}

export async function deleteCustomer(id: string) {
  try {
    await connectToDatabase();

    const result = await Customer.findByIdAndDelete(id);
    if (!result) throw new Error("Customer not found");

    return true;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}
