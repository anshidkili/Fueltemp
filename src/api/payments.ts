import connectToDatabase from "../lib/mongodb";
import Payment from "../models/Payment";
import Customer from "../models/Customer";
import User from "../models/User";
import Invoice from "../models/Invoice";

export interface Payment {
  id: string;
  customer_id: string;
  invoice_id: string | null;
  amount: number;
  payment_date: string;
  payment_method: "cash" | "bank_transfer" | "credit_card" | "check";
  reference_number: string | null;
  notes: string | null;
  created_at: string;
}

export interface PaymentWithDetails extends Payment {
  customers: {
    company_name: string;
    profiles: {
      full_name: string;
    };
  };
  invoices?: {
    invoice_number: string;
    total_amount: number;
  };
}

export async function getPayments(customerId: string) {
  try {
    await connectToDatabase();

    const payments = await Payment.find({ customer_id: customerId })
      .sort({ payment_date: -1 })
      .lean();

    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        const customer = await Customer.findById(payment.customer_id).lean();
        const user = await User.findById(customer.user_id).lean();

        let invoiceData = null;
        if (payment.invoice_id) {
          const invoice = await Invoice.findById(payment.invoice_id).lean();
          if (invoice) {
            invoiceData = {
              invoice_number: invoice.invoice_number,
              total_amount: invoice.total_amount,
            };
          }
        }

        return {
          id: payment._id.toString(),
          customer_id: payment.customer_id.toString(),
          invoice_id: payment.invoice_id ? payment.invoice_id.toString() : null,
          amount: payment.amount,
          payment_date: payment.payment_date.toISOString(),
          payment_method: payment.payment_method,
          reference_number: payment.reference_number,
          notes: payment.notes,
          created_at: payment.created_at.toISOString(),
          customers: {
            company_name: customer.company_name,
            profiles: {
              full_name: user.full_name,
            },
          },
          invoices: invoiceData,
        };
      }),
    );

    return paymentsWithDetails as PaymentWithDetails[];
  } catch (error) {
    console.error("Error getting payments:", error);
    throw error;
  }
}

export async function getPaymentById(id: string) {
  try {
    await connectToDatabase();

    const payment = await Payment.findById(id).lean();
    if (!payment) throw new Error("Payment not found");

    const customer = await Customer.findById(payment.customer_id).lean();
    const user = await User.findById(customer.user_id).lean();

    let invoiceData = null;
    if (payment.invoice_id) {
      const invoice = await Invoice.findById(payment.invoice_id).lean();
      if (invoice) {
        invoiceData = {
          invoice_number: invoice.invoice_number,
          total_amount: invoice.total_amount,
        };
      }
    }

    return {
      id: payment._id.toString(),
      customer_id: payment.customer_id.toString(),
      invoice_id: payment.invoice_id ? payment.invoice_id.toString() : null,
      amount: payment.amount,
      payment_date: payment.payment_date.toISOString(),
      payment_method: payment.payment_method,
      reference_number: payment.reference_number,
      notes: payment.notes,
      created_at: payment.created_at.toISOString(),
      customers: {
        company_name: customer.company_name,
        profiles: {
          full_name: user.full_name,
        },
      },
      invoices: invoiceData,
    } as PaymentWithDetails;
  } catch (error) {
    console.error("Error getting payment by ID:", error);
    throw error;
  }
}

export async function createPayment(
  payment: Omit<Payment, "id" | "created_at">,
) {
  try {
    await connectToDatabase();

    // Create the payment
    const newPayment = await Payment.create({
      customer_id: payment.customer_id,
      invoice_id: payment.invoice_id,
      amount: payment.amount,
      payment_date: new Date(payment.payment_date),
      payment_method: payment.payment_method,
      reference_number: payment.reference_number,
      notes: payment.notes,
    });

    // Update customer balance
    await Customer.findByIdAndUpdate(payment.customer_id, {
      $inc: { current_balance: -payment.amount },
    });

    // If payment is for a specific invoice, update the invoice
    if (payment.invoice_id) {
      const invoice = await Invoice.findById(payment.invoice_id);
      if (invoice) {
        const newPaidAmount = invoice.paid_amount + payment.amount;
        let newStatus = invoice.status;

        if (newPaidAmount >= invoice.total_amount) {
          newStatus = "paid";
        } else if (newPaidAmount > 0) {
          newStatus = "partially_paid";
        }

        await Invoice.findByIdAndUpdate(payment.invoice_id, {
          paid_amount: newPaidAmount,
          status: newStatus,
        });
      }
    }

    return {
      id: newPayment._id.toString(),
      customer_id: newPayment.customer_id.toString(),
      invoice_id: newPayment.invoice_id
        ? newPayment.invoice_id.toString()
        : null,
      amount: newPayment.amount,
      payment_date: newPayment.payment_date.toISOString(),
      payment_method: newPayment.payment_method,
      reference_number: newPayment.reference_number,
      notes: newPayment.notes,
      created_at: newPayment.created_at.toISOString(),
    } as Payment;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}
