import connectToDatabase from "../lib/mongodb";
import Invoice from "../models/Invoice";
import Customer from "../models/Customer";
import User from "../models/User";
import Sale from "../models/Sale";

export interface Invoice {
  id: string;
  customer_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  paid_amount: number;
  status: "pending" | "paid" | "overdue" | "partially_paid";
  notes: string;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    sale_id?: string | null;
  }>;
  created_at: string;
}

export interface InvoiceWithCustomer extends Invoice {
  customers: {
    company_name: string;
    profiles: {
      full_name: string;
    };
  };
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  sale_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface InvoiceItemWithSale extends InvoiceItem {
  sales?: {
    transaction_date: string;
    fuel_types: {
      name: string;
    };
    quantity_liters: number;
    vehicles?: {
      license_plate: string;
      make: string;
      model: string;
    };
  };
}

export async function getInvoices(customerId: string) {
  try {
    await connectToDatabase();

    const invoices = await Invoice.find({ customer_id: customerId })
      .sort({ issue_date: -1 })
      .lean();

    const invoicesWithCustomers = await Promise.all(
      invoices.map(async (invoice) => {
        const customer = await Customer.findById(invoice.customer_id).lean();
        const user = await User.findById(customer.user_id).lean();

        return {
          id: invoice._id.toString(),
          customer_id: invoice.customer_id.toString(),
          invoice_number: invoice.invoice_number,
          issue_date: invoice.issue_date.toISOString(),
          due_date: invoice.due_date.toISOString(),
          total_amount: invoice.total_amount,
          paid_amount: invoice.paid_amount,
          status: invoice.status,
          notes: invoice.notes,
          items: invoice.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            sale_id: item.sale_id ? item.sale_id.toString() : null,
          })),
          created_at: invoice.created_at.toISOString(),
          customers: {
            company_name: customer.company_name,
            profiles: {
              full_name: user.full_name,
            },
          },
        };
      }),
    );

    return invoicesWithCustomers as InvoiceWithCustomer[];
  } catch (error) {
    console.error("Error getting invoices:", error);
    throw error;
  }
}

export async function getInvoiceById(id: string) {
  try {
    await connectToDatabase();

    const invoice = await Invoice.findById(id).lean();
    if (!invoice) throw new Error("Invoice not found");

    const customer = await Customer.findById(invoice.customer_id).lean();
    const user = await User.findById(customer.user_id).lean();

    return {
      id: invoice._id.toString(),
      customer_id: invoice.customer_id.toString(),
      invoice_number: invoice.invoice_number,
      issue_date: invoice.issue_date.toISOString(),
      due_date: invoice.due_date.toISOString(),
      total_amount: invoice.total_amount,
      paid_amount: invoice.paid_amount,
      status: invoice.status,
      notes: invoice.notes,
      items: invoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        sale_id: item.sale_id ? item.sale_id.toString() : null,
      })),
      created_at: invoice.created_at.toISOString(),
      customers: {
        company_name: customer.company_name,
        profiles: {
          full_name: user.full_name,
        },
      },
    } as InvoiceWithCustomer;
  } catch (error) {
    console.error("Error getting invoice by ID:", error);
    throw error;
  }
}

export async function getInvoiceItems(invoiceId: string) {
  try {
    await connectToDatabase();

    const invoice = await Invoice.findById(invoiceId).lean();
    if (!invoice) throw new Error("Invoice not found");

    const itemsWithSales = await Promise.all(
      invoice.items.map(async (item) => {
        let saleData = null;

        if (item.sale_id) {
          const sale = await Sale.findById(item.sale_id).lean();
          if (sale) {
            const fuelType = await FuelType.findById(sale.fuel_type_id).lean();
            let vehicleData = null;

            if (sale.vehicle_id) {
              const vehicle = await Vehicle.findById(sale.vehicle_id).lean();
              if (vehicle) {
                vehicleData = {
                  license_plate: vehicle.license_plate,
                  make: vehicle.make,
                  model: vehicle.model,
                };
              }
            }

            saleData = {
              transaction_date: sale.transaction_date.toISOString(),
              fuel_types: {
                name: fuelType.name,
              },
              quantity_liters: sale.quantity_liters,
              vehicles: vehicleData,
            };
          }
        }

        return {
          id: item._id.toString(),
          invoice_id: invoiceId,
          sale_id: item.sale_id ? item.sale_id.toString() : null,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          created_at: invoice.created_at.toISOString(),
          sales: saleData,
        };
      }),
    );

    return itemsWithSales as InvoiceItemWithSale[];
  } catch (error) {
    console.error("Error getting invoice items:", error);
    throw error;
  }
}

export async function createInvoice(
  invoice: Omit<Invoice, "id" | "created_at" | "paid_amount" | "status">,
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    sale_id?: string | null;
  }>,
) {
  try {
    await connectToDatabase();

    // Create the invoice with items
    const newInvoice = await Invoice.create({
      customer_id: invoice.customer_id,
      invoice_number: invoice.invoice_number,
      issue_date: new Date(invoice.issue_date),
      due_date: new Date(invoice.due_date),
      total_amount: invoice.total_amount,
      paid_amount: 0,
      status: "pending",
      notes: invoice.notes || "",
      items: items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        sale_id: item.sale_id || null,
      })),
    });

    // Update sales to reference this invoice
    for (const item of items) {
      if (item.sale_id) {
        await Sale.findByIdAndUpdate(item.sale_id, {
          invoice_id: newInvoice._id,
        });
      }
    }

    return {
      invoice: {
        id: newInvoice._id.toString(),
        customer_id: newInvoice.customer_id.toString(),
        invoice_number: newInvoice.invoice_number,
        issue_date: newInvoice.issue_date.toISOString(),
        due_date: newInvoice.due_date.toISOString(),
        total_amount: newInvoice.total_amount,
        paid_amount: newInvoice.paid_amount,
        status: newInvoice.status,
        notes: newInvoice.notes,
        items: newInvoice.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          sale_id: item.sale_id ? item.sale_id.toString() : null,
        })),
        created_at: newInvoice.created_at.toISOString(),
      } as Invoice,
      items: newInvoice.items.map((item) => ({
        id: item._id.toString(),
        invoice_id: newInvoice._id.toString(),
        sale_id: item.sale_id ? item.sale_id.toString() : null,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        created_at: newInvoice.created_at.toISOString(),
      })) as InvoiceItem[],
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
}

export async function updateInvoiceStatus(
  id: string,
  status: Invoice["status"],
  paidAmount?: number,
) {
  try {
    await connectToDatabase();

    const updates: any = { status };

    if (paidAmount !== undefined) {
      updates.paid_amount = paidAmount;
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedInvoice) throw new Error("Invoice not found");

    return {
      id: updatedInvoice._id.toString(),
      customer_id: updatedInvoice.customer_id.toString(),
      invoice_number: updatedInvoice.invoice_number,
      issue_date: updatedInvoice.issue_date.toISOString(),
      due_date: updatedInvoice.due_date.toISOString(),
      total_amount: updatedInvoice.total_amount,
      paid_amount: updatedInvoice.paid_amount,
      status: updatedInvoice.status,
      notes: updatedInvoice.notes,
      items: updatedInvoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        sale_id: item.sale_id ? item.sale_id.toString() : null,
      })),
      created_at: updatedInvoice.created_at.toISOString(),
    } as Invoice;
  } catch (error) {
    console.error("Error updating invoice status:", error);
    throw error;
  }
}
