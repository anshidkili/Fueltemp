import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Download, Eye, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Transaction {
  id: string;
  timestamp: string;
  dispenser: string;
  fuelType: string;
  liters: number;
  amount: number;
  paymentMethod: "Cash" | "Card" | "Credit Account";
  status: "Completed" | "Pending" | "Failed";
  customer?: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  title?: string;
  description?: string;
}

const RecentTransactions = ({
  transactions = [
    {
      id: "TX123456",
      timestamp: "2023-06-15T09:23:45",
      dispenser: "Dispenser 1",
      fuelType: "Petrol",
      liters: 45.5,
      amount: 4095,
      paymentMethod: "Cash",
      status: "Completed",
    },
    {
      id: "TX123457",
      timestamp: "2023-06-15T10:15:22",
      dispenser: "Dispenser 3",
      fuelType: "Diesel",
      liters: 65.2,
      amount: 5868,
      paymentMethod: "Card",
      status: "Completed",
    },
    {
      id: "TX123458",
      timestamp: "2023-06-15T11:05:18",
      dispenser: "Dispenser 2",
      fuelType: "Petrol",
      liters: 25.8,
      amount: 2322,
      paymentMethod: "Credit Account",
      status: "Completed",
      customer: "ABC Logistics",
    },
    {
      id: "TX123459",
      timestamp: "2023-06-15T11:45:33",
      dispenser: "Dispenser 4",
      fuelType: "Diesel",
      liters: 85.0,
      amount: 7650,
      paymentMethod: "Credit Account",
      status: "Pending",
      customer: "XYZ Transport",
    },
    {
      id: "TX123460",
      timestamp: "2023-06-15T12:30:15",
      dispenser: "Dispenser 1",
      fuelType: "Petrol",
      liters: 35.5,
      amount: 3195,
      paymentMethod: "Cash",
      status: "Completed",
    },
  ],
  title = "Recent Transactions",
  description = "Overview of the latest fuel transactions at your station.",
}: RecentTransactionsProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTransactions =
    activeTab === "all"
      ? transactions
      : transactions.filter((t) =>
          t.paymentMethod.toLowerCase().includes(activeTab),
        );

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="cash">Cash</TabsTrigger>
            <TabsTrigger value="card">Card</TabsTrigger>
            <TabsTrigger value="credit">Credit Account</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Dispenser</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead>Liters</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.id}
                      </TableCell>
                      <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                      <TableCell>{transaction.dispenser}</TableCell>
                      <TableCell>{transaction.fuelType}</TableCell>
                      <TableCell>{transaction.liters.toFixed(1)}</TableCell>
                      <TableCell>
                        ₹{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {transaction.paymentMethod === "Credit Account" ? (
                          <div>
                            <span>{transaction.paymentMethod}</span>
                            {transaction.customer && (
                              <div className="text-xs text-gray-500">
                                {transaction.customer}
                              </div>
                            )}
                          </div>
                        ) : (
                          transaction.paymentMethod
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(transaction.status)}
                          variant="outline"
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>Print Receipt</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
