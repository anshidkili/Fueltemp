import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Trash2, Plus, FileText, Download } from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleId?: string | null;
}

interface InvoiceGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  customers?: Array<{ id: string; company_name: string }>;
  customerSales?: Array<any>;
}

const InvoiceGenerator = ({
  isOpen,
  onClose,
  onSubmit,
  customers = [],
  customerSales = [],
}: InvoiceGeneratorProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [notes, setNotes] = useState("");

  // Set due date 30 days from issue date by default
  React.useEffect(() => {
    if (issueDate) {
      const date = new Date(issueDate);
      date.setDate(date.getDate() + 30);
      setDueDate(date.toISOString().split("T")[0]);
    }
  }, [issueDate]);

  // Generate invoice number automatically
  React.useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    setInvoiceNumber(`INV-${year}${month}-${random}`);
  }, []);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate total price if quantity or unit price changes
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.totalPrice =
              updatedItem.quantity * updatedItem.unitPrice;
          }

          return updatedItem;
        }
        return item;
      }),
    );
  };

  const addSaleToInvoice = (sale: any) => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: `Fuel: ${sale.fuel_types.name} - ${sale.transaction_date.substring(0, 10)}`,
      quantity: sale.quantity_liters,
      unitPrice: sale.price_per_liter,
      totalPrice: sale.total_amount,
      saleId: sale.id,
    };
    setItems([...items, newItem]);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      customer_id: selectedCustomer,
      invoice_number: invoiceNumber,
      issue_date: issueDate,
      due_date: dueDate,
      total_amount: calculateTotal(),
      paid_amount: 0,
      status: "pending",
      notes,
      items: items.map(({ id, ...item }) => item),
    };

    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for a credit customer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer">Customer</Label>
              <Select
                value={selectedCustomer}
                onValueChange={setSelectedCustomer}
              >
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="invoice-number">Invoice Number</Label>
              <Input
                id="invoice-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="issue-date">Issue Date</Label>
              <Input
                id="issue-date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Invoice Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead className="w-[120px]">Unit Price</TableHead>
                  <TableHead className="w-[120px]">Total</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder="Item description"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                        min="0"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "unitPrice",
                            Number(e.target.value),
                          )
                        }
                        min="0"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      ${item.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No items added yet. Add an item or select from customer
                      sales below.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex justify-end mt-2">
              <div className="w-[240px] space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {selectedCustomer && (
            <div className="mt-6 border rounded-md p-4">
              <h3 className="font-medium mb-2">Recent Unbilled Sales</h3>
              <div className="max-h-[200px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Fuel Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerSales
                      .filter(
                        (sale) =>
                          sale.customer_id === selectedCustomer &&
                          !items.some((item) => item.saleId === sale.id),
                      )
                      .map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>
                            {sale.transaction_date.substring(0, 10)}
                          </TableCell>
                          <TableCell>{sale.fuel_types.name}</TableCell>
                          <TableCell>{sale.quantity_liters} L</TableCell>
                          <TableCell>${sale.total_amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => addSaleToInvoice(sale)}
                            >
                              Add to Invoice
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    {customerSales.filter(
                      (sale) =>
                        sale.customer_id === selectedCustomer &&
                        !items.some((item) => item.saleId === sale.id),
                    ).length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No unbilled sales found for this customer.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes for this invoice"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> Generate Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceGenerator;
