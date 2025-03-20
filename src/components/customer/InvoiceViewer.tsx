import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
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
  DialogTrigger,
} from "../ui/dialog";
import { Download, Eye, Filter, Search } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

interface InvoiceViewerProps {
  invoices?: Invoice[];
}

const InvoiceViewer = ({ invoices = defaultInvoices }: InvoiceViewerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.invoiceNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // Placeholder for download functionality
    console.log(`Downloading invoice ${invoiceId}`);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow">
      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-6">
          <CardTitle className="text-2xl font-bold">Invoices</CardTitle>
          <TabsList>
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              invoice.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : invoice.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewInvoice(invoice)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No invoices found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredInvoices.length} of {invoices.length} invoices
              </div>
              <Button variant="outline" size="sm">
                Export All
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Duplicate content for other tabs with filtered data */}
        <TabsContent value="pending" className="mt-0">
          {/* Similar content as "all" tab but filtered for pending */}
        </TabsContent>
        <TabsContent value="paid" className="mt-0">
          {/* Similar content as "all" tab but filtered for paid */}
        </TabsContent>
        <TabsContent value="overdue" className="mt-0">
          {/* Similar content as "all" tab but filtered for overdue */}
        </TabsContent>
      </Tabs>

      {/* Invoice Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice #{selectedInvoice?.invoiceNumber}</DialogTitle>
            <DialogDescription>
              Issued on {selectedInvoice?.date} | Due on{" "}
              {selectedInvoice?.dueDate}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">Billed To:</h3>
                <p>Your Name</p>
                <p>Your Vehicle(s)</p>
              </div>
              <div>
                <h3 className="font-semibold">Billed From:</h3>
                <p>Fuel Station Name</p>
                <p>Station Address</p>
                <p>Contact Information</p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedInvoice?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right">
                    $
                    {selectedInvoice?.items
                      .reduce((sum, item) => sum + item.total, 0)
                      .toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">
                    Tax (10%)
                  </TableCell>
                  <TableCell className="text-right">
                    $
                    {(
                      selectedInvoice?.items.reduce(
                        (sum, item) => sum + item.total,
                        0,
                      ) * 0.1
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ${selectedInvoice?.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <p className="text-sm">
                Please make payment by the due date to avoid late fees.
              </p>
              <p className="text-sm mt-2">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedInvoice?.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : selectedInvoice?.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedInvoice?.status.charAt(0).toUpperCase() +
                    selectedInvoice?.status.slice(1)}
                </span>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => handleDownloadInvoice(selectedInvoice?.id || "")}
            >
              Download Invoice
            </Button>
            {selectedInvoice?.status !== "paid" && (
              <Button variant="default">Pay Now</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Default mock data
const defaultInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2023-001",
    date: "2023-05-01",
    dueDate: "2023-05-15",
    amount: 245.5,
    status: "paid",
    items: [
      {
        id: "1-1",
        description: "Regular Unleaded (Vehicle: SUV-001)",
        quantity: 35,
        unitPrice: 3.5,
        total: 122.5,
      },
      {
        id: "1-2",
        description: "Premium Unleaded (Vehicle: CAR-002)",
        quantity: 30,
        unitPrice: 4.1,
        total: 123.0,
      },
    ],
  },
  {
    id: "2",
    invoiceNumber: "INV-2023-002",
    date: "2023-06-01",
    dueDate: "2023-06-15",
    amount: 187.2,
    status: "pending",
    items: [
      {
        id: "2-1",
        description: "Regular Unleaded (Vehicle: SUV-001)",
        quantity: 28,
        unitPrice: 3.55,
        total: 99.4,
      },
      {
        id: "2-2",
        description: "Diesel (Vehicle: TRUCK-003)",
        quantity: 22,
        unitPrice: 3.99,
        total: 87.8,
      },
    ],
  },
  {
    id: "3",
    invoiceNumber: "INV-2023-003",
    date: "2023-07-01",
    dueDate: "2023-07-15",
    amount: 312.75,
    status: "overdue",
    items: [
      {
        id: "3-1",
        description: "Premium Unleaded (Vehicle: CAR-002)",
        quantity: 40,
        unitPrice: 4.15,
        total: 166.0,
      },
      {
        id: "3-2",
        description: "Regular Unleaded (Vehicle: SUV-001)",
        quantity: 25,
        unitPrice: 3.59,
        total: 89.75,
      },
      {
        id: "3-3",
        description: "Diesel (Vehicle: TRUCK-003)",
        quantity: 15,
        unitPrice: 3.8,
        total: 57.0,
      },
    ],
  },
  {
    id: "4",
    invoiceNumber: "INV-2023-004",
    date: "2023-08-01",
    dueDate: "2023-08-15",
    amount: 203.4,
    status: "paid",
    items: [
      {
        id: "4-1",
        description: "Regular Unleaded (Vehicle: SUV-001)",
        quantity: 30,
        unitPrice: 3.6,
        total: 108.0,
      },
      {
        id: "4-2",
        description: "Premium Unleaded (Vehicle: CAR-002)",
        quantity: 23,
        unitPrice: 4.15,
        total: 95.4,
      },
    ],
  },
  {
    id: "5",
    invoiceNumber: "INV-2023-005",
    date: "2023-09-01",
    dueDate: "2023-09-15",
    amount: 276.3,
    status: "pending",
    items: [
      {
        id: "5-1",
        description: "Diesel (Vehicle: TRUCK-003)",
        quantity: 35,
        unitPrice: 3.95,
        total: 138.25,
      },
      {
        id: "5-2",
        description: "Regular Unleaded (Vehicle: SUV-001)",
        quantity: 38,
        unitPrice: 3.63,
        total: 138.05,
      },
    ],
  },
];

export default InvoiceViewer;
