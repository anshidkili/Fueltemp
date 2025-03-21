import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import StationMetrics from "./StationMetrics";
import RecentTransactions from "./RecentTransactions";
import ShiftForm from "./ShiftForm";
import MultipleDispenserForm from "./MultipleDispenserForm";
import InvoiceGenerator from "./InvoiceGenerator";
import CustomerPaymentForm from "./CustomerPaymentForm";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
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
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Plus,
  FileBarChart,
  Users,
  Package,
  Fuel,
  CreditCard,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Calendar,
  DollarSign,
  BarChart,
  PieChart,
  Download,
  Wrench,
  Truck,
  UserPlus,
  FileText,
  Settings,
  Clock,
  PlayCircle,
  StopCircle,
  Receipt,
  Car,
} from "lucide-react";

interface AdminDashboardProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  stationName?: string;
  inventoryLevel?: number;
  dailySales?: number;
  activeDispensers?: number;
  creditCustomerBalance?: number;
}

const AdminDashboard = ({
  userName = "Sarah Johnson",
  userRole = "Station Admin",
  userAvatar = "",
  stationName = "Central City Fuel Station",
  inventoryLevel = 68,
  dailySales = 5280,
  activeDispensers = 5,
  creditCustomerBalance = 15750,
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isAddInventoryDialogOpen, setIsAddInventoryDialogOpen] =
    useState(false);
  const [isAddDispenserDialogOpen, setIsAddDispenserDialogOpen] =
    useState(false);
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isStartShiftDialogOpen, setIsStartShiftDialogOpen] = useState(false);
  const [isEndShiftDialogOpen, setIsEndShiftDialogOpen] = useState(false);
  const [isGenerateInvoiceDialogOpen, setIsGenerateInvoiceDialogOpen] =
    useState(false);
  const [isRecordPaymentDialogOpen, setIsRecordPaymentDialogOpen] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Mock data for fuel types
  const fuelTypes = [
    { id: "1", name: "Regular Unleaded", code: "REG", price_per_liter: 3.5 },
    { id: "2", name: "Premium Unleaded", code: "PREM", price_per_liter: 4.1 },
    { id: "3", name: "Diesel", code: "DSL", price_per_liter: 3.8 },
  ];

  // Mock data for dispensers with multiple fuel types
  const dispensers = [
    {
      id: "1",
      dispenser_number: 1,
      status: "operational",
      fuel_types: [
        { id: "1", name: "Regular Unleaded" },
        { id: "2", name: "Premium Unleaded" },
      ],
    },
    {
      id: "2",
      dispenser_number: 2,
      status: "operational",
      fuel_types: [{ id: "3", name: "Diesel" }],
    },
    {
      id: "3",
      dispenser_number: 3,
      status: "maintenance",
      fuel_types: [
        { id: "1", name: "Regular Unleaded" },
        { id: "2", name: "Premium Unleaded" },
        { id: "3", name: "Diesel" },
      ],
    },
  ];

  // Mock data for employees
  const employees = [
    { id: "1", profiles: { full_name: "John Smith" } },
    { id: "2", profiles: { full_name: "Emily Johnson" } },
    { id: "3", profiles: { full_name: "Michael Brown" } },
  ];

  // Mock data for customers
  const customers = [
    { id: "1", company_name: "ABC Logistics" },
    { id: "2", company_name: "XYZ Transport" },
    { id: "3", company_name: "City Cabs" },
  ];

  // Mock data for customer sales
  const customerSales = [
    {
      id: "1",
      customer_id: "1",
      transaction_date: "2023-06-15T10:30:00",
      fuel_types: { name: "Regular Unleaded" },
      quantity_liters: 50,
      price_per_liter: 3.5,
      total_amount: 175.0,
      vehicles: { license_plate: "ABC-123", make: "Toyota", model: "Hilux" },
    },
    {
      id: "2",
      customer_id: "1",
      transaction_date: "2023-06-14T14:15:00",
      fuel_types: { name: "Diesel" },
      quantity_liters: 75,
      price_per_liter: 3.8,
      total_amount: 285.0,
      vehicles: { license_plate: "ABC-456", make: "Isuzu", model: "NPR" },
    },
  ];

  // Mock data for invoices
  const invoices = [
    {
      id: "1",
      customer_id: "1",
      invoice_number: "INV-2023-0125",
      issue_date: "2023-06-01",
      due_date: "2023-06-15",
      total_amount: 4250.75,
      paid_amount: 0,
      status: "pending",
    },
  ];

  // Mock handlers
  const handleStartShift = (data: any) => {
    console.log("Start shift data:", data);
    setIsStartShiftDialogOpen(false);
  };

  const handleEndShift = (data: any) => {
    console.log("End shift data:", data);
    setIsEndShiftDialogOpen(false);
  };

  const handleAddDispenser = (data: any) => {
    console.log("Add dispenser data:", data);
    setIsAddDispenserDialogOpen(false);
  };

  const handleGenerateInvoice = (data: any) => {
    console.log("Generate invoice data:", data);
    setIsGenerateInvoiceDialogOpen(false);
  };

  const handleRecordPayment = (data: any) => {
    console.log("Record payment data:", data);
    setIsRecordPaymentDialogOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar userRole="admin" activePath="/dashboard" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={userName}
          userRole={userRole}
          userAvatar={userAvatar}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stationName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back to your station dashboard
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setActiveTab("reports")}
              >
                <FileBarChart className="h-4 w-4" />
                <span>Reports</span>
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={() => setIsAddInventoryDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Add Inventory</span>
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 grid grid-cols-6 w-full">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2"
              >
                <BarChart className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="employees"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Employees
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger
                value="dispensers"
                className="flex items-center gap-2"
              >
                <Fuel className="h-4 w-4" />
                Dispensers
              </TabsTrigger>
              <TabsTrigger
                value="customers"
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Customers
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileBarChart className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <StationMetrics
                inventoryLevel={inventoryLevel}
                dailySales={dailySales}
                activeDispensers={activeDispensers}
                creditCustomerBalance={creditCustomerBalance}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>Employees</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Active Employees
                        </span>
                        <span className="text-sm font-bold">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          On Shift Now
                        </span>
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Pending Approvals
                        </span>
                        <span className="text-sm font-bold text-amber-600">
                          2
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          className="w-full flex items-center gap-1"
                          onClick={() => setIsStartShiftDialogOpen(true)}
                        >
                          <PlayCircle className="h-4 w-4 text-green-600" />
                          Start Shift
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full flex items-center gap-1"
                          onClick={() => setIsEndShiftDialogOpen(true)}
                        >
                          <StopCircle className="h-4 w-4 text-red-600" />
                          End Shift
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-green-600" />
                      <span>Inventory</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Petrol</span>
                        <span className="text-sm font-bold">12,500 L</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Diesel</span>
                        <span className="text-sm font-bold">8,750 L</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Premium</span>
                        <span className="text-sm font-bold text-red-600">
                          1,200 L (Low)
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => setActiveTab("inventory")}
                      >
                        Update Inventory
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Fuel className="h-5 w-5 text-purple-600" />
                      <span>Dispensers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Total Dispensers
                        </span>
                        <span className="text-sm font-bold">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Active</span>
                        <span className="text-sm font-bold">
                          {activeDispensers}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Maintenance Required
                        </span>
                        <span className="text-sm font-bold text-red-600">
                          1
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => setActiveTab("dispensers")}
                      >
                        Manage Dispensers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Tabs defaultValue="transactions" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="transactions">
                      Recent Transactions
                    </TabsTrigger>
                    <TabsTrigger value="credit">Credit Customers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="transactions" className="mt-0">
                    <RecentTransactions />
                  </TabsContent>

                  <TabsContent value="credit" className="mt-0">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl font-semibold">
                              Credit Customers
                            </CardTitle>
                            <p className="text-sm text-gray-500 mt-1">
                              Manage your credit customer accounts
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() =>
                                setIsGenerateInvoiceDialogOpen(true)
                              }
                            >
                              <Receipt className="h-4 w-4" />
                              <span>Generate Invoice</span>
                            </Button>
                            <Button
                              className="flex items-center gap-1"
                              onClick={() => setIsAddCustomerDialogOpen(true)}
                            >
                              <CreditCard className="h-4 w-4" />
                              <span>Add Customer</span>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Vehicles
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Credit Limit
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Current Balance
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        ABC Logistics
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Since Jan 2023
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  12
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹50,000
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹32,450
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedCustomer(customers[0]);
                                        setIsRecordPaymentDialogOpen(true);
                                      }}
                                    >
                                      Record Payment
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      View
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        XYZ Transport
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Since Mar 2023
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  8
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹35,000
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹28,750
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Near Limit
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedCustomer(customers[1]);
                                        setIsRecordPaymentDialogOpen(true);
                                      }}
                                    >
                                      Record Payment
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      View
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        City Cabs
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Since Feb 2023
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  24
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹75,000
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹42,800
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedCustomer(customers[2]);
                                        setIsRecordPaymentDialogOpen(true);
                                      }}
                                    >
                                      Record Payment
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      View
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            {/* Employees Tab */}
            <TabsContent value="employees" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">
                        Employee Management
                      </CardTitle>
                      <CardDescription>
                        Manage station staff and their shifts
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => setIsStartShiftDialogOpen(true)}
                      >
                        <PlayCircle className="h-4 w-4 text-green-600" /> Start
                        Shift
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => setIsEndShiftDialogOpen(true)}
                      >
                        <StopCircle className="h-4 w-4 text-red-600" /> End
                        Shift
                      </Button>
                      <Button onClick={() => setIsAddEmployeeDialogOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" /> Add Employee
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        className="pl-8"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Hire Date</TableHead>
                        <TableHead>Hourly Rate</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          John Smith
                        </TableCell>
                        <TableCell>Station Manager</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                        <TableCell>Jan 15, 2022</TableCell>
                        <TableCell>$25.00</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Emily Johnson
                        </TableCell>
                        <TableCell>Cashier</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                        <TableCell>Mar 10, 2022</TableCell>
                        <TableCell>$18.50</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Michael Brown
                        </TableCell>
                        <TableCell>Fuel Attendant</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-amber-500 text-amber-500"
                          >
                            On Leave
                          </Badge>
                        </TableCell>
                        <TableCell>Jun 5, 2022</TableCell>
                        <TableCell>$16.75</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Shifts</CardTitle>
                  <CardDescription>Employees currently on duty</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Dispenser</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          Emily Johnson
                        </TableCell>
                        <TableCell>Cashier</TableCell>
                        <TableCell>08:00 AM</TableCell>
                        <TableCell>4h 15m</TableCell>
                        <TableCell>Dispenser #1</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEndShiftDialogOpen(true)}
                          >
                            End Shift
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          David Wilson
                        </TableCell>
                        <TableCell>Fuel Attendant</TableCell>
                        <TableCell>09:30 AM</TableCell>
                        <TableCell>2h 45m</TableCell>
                        <TableCell>Dispenser #2</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEndShiftDialogOpen(true)}
                          >
                            End Shift
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shift History</CardTitle>
                  <CardDescription>Recent completed shifts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Shift Hours</TableHead>
                        <TableHead>Dispenser</TableHead>
                        <TableHead>Initial Cash</TableHead>
                        <TableHead>Final Cash</TableHead>
                        <TableHead>Difference</TableHead>
                        <TableHead>Earnings</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          John Smith
                        </TableCell>
                        <TableCell>Jun 14, 2023</TableCell>
                        <TableCell>8h 15m</TableCell>
                        <TableCell>Dispenser #3</TableCell>
                        <TableCell>$500.00</TableCell>
                        <TableCell>$2,345.75</TableCell>
                        <TableCell className="text-green-600">
                          +$1,845.75
                        </TableCell>
                        <TableCell>$206.25</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Emily Johnson
                        </TableCell>
                        <TableCell>Jun 13, 2023</TableCell>
                        <TableCell>7h 30m</TableCell>
                        <TableCell>Dispenser #1</TableCell>
                        <TableCell>$500.00</TableCell>
                        <TableCell>$1,875.50</TableCell>
                        <TableCell className="text-green-600">
                          +$1,375.50
                        </TableCell>
                        <TableCell>$138.75</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">Fuel Inventory</CardTitle>
                      <CardDescription>
                        Current stock levels and recent deliveries
                      </CardDescription>
                    </div>
                    <Button onClick={() => setIsAddInventoryDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Add Inventory
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fuel Type</TableHead>
                        <TableHead>Current Level</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price/Liter</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          Regular Unleaded
                        </TableCell>
                        <TableCell>12,500 L</TableCell>
                        <TableCell>20,000 L</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Good</Badge>
                        </TableCell>
                        <TableCell>$3.50</TableCell>
                        <TableCell>Today, 9:30 AM</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Diesel</TableCell>
                        <TableCell>8,750 L</TableCell>
                        <TableCell>15,000 L</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Good</Badge>
                        </TableCell>
                        <TableCell>$3.80</TableCell>
                        <TableCell>Today, 9:30 AM</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Premium Unleaded
                        </TableCell>
                        <TableCell>1,200 L</TableCell>
                        <TableCell>10,000 L</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-red-500 text-red-500"
                          >
                            Low
                          </Badge>
                        </TableCell>
                        <TableCell>$4.10</TableCell>
                        <TableCell>Today, 9:30 AM</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Deliveries</CardTitle>
                  <CardDescription>
                    Fuel deliveries in the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Fuel Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Invoice #</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Jun 15, 2023</TableCell>
                        <TableCell>Regular Unleaded</TableCell>
                        <TableCell>5,000 L</TableCell>
                        <TableCell>PetroSupply Inc.</TableCell>
                        <TableCell>INV-2023-0568</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jun 10, 2023</TableCell>
                        <TableCell>Diesel</TableCell>
                        <TableCell>4,000 L</TableCell>
                        <TableCell>PetroSupply Inc.</TableCell>
                        <TableCell>INV-2023-0542</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jun 5, 2023</TableCell>
                        <TableCell>Premium Unleaded</TableCell>
                        <TableCell>2,500 L</TableCell>
                        <TableCell>PetroSupply Inc.</TableCell>
                        <TableCell>INV-2023-0521</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dispensers Tab */}
            <TabsContent value="dispensers" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">Fuel Dispensers</CardTitle>
                      <CardDescription>
                        Manage and monitor all station dispensers
                      </CardDescription>
                    </div>
                    <Button onClick={() => setIsAddDispenserDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Add Dispenser
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {dispensers.map((dispenser) => (
                      <Card key={dispenser.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              Dispenser #{dispenser.dispenser_number}
                            </CardTitle>
                            <Badge
                              className={
                                dispenser.status === "operational"
                                  ? "bg-green-500"
                                  : "border-red-500 text-red-500 border"
                              }
                            >
                              {dispenser.status === "operational"
                                ? "Operational"
                                : "Maintenance"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Fuel Types:
                              </span>
                              <span className="text-sm font-medium">
                                {dispenser.fuel_types
                                  .map((ft) => ft.name)
                                  .join(", ")}
                              </span>
                            </div>
                            {dispenser.fuel_types.map((ft, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span className="text-sm text-muted-foreground">
                                  {ft.name} Meter Reading:
                                </span>
                                <span className="text-sm font-medium">
                                  {45000 + Math.floor(Math.random() * 5000)}.
                                  {Math.floor(Math.random() * 10)} L
                                </span>
                              </div>
                            ))}
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Last Calibration:
                              </span>
                              <span className="text-sm font-medium">
                                May 15, 2023
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Last Maintenance:
                              </span>
                              <span className="text-sm font-medium">
                                Jun 1, 2023
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Wrench className="h-3 w-3" /> Maintenance
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Settings className="h-3 w-3" /> Configure
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">
                      Maintenance Schedule
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dispenser</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Scheduled Date</TableHead>
                          <TableHead>Technician</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Dispenser #3</TableCell>
                          <TableCell>Repair</TableCell>
                          <TableCell>Jun 18, 2023</TableCell>
                          <TableCell>TechCorp Inc.</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-amber-500 text-amber-500"
                            >
                              Scheduled
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Reschedule
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>All Dispensers</TableCell>
                          <TableCell>Calibration</TableCell>
                          <TableCell>Jul 15, 2023</TableCell>
                          <TableCell>TechCorp Inc.</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-blue-500 text-blue-500"
                            >
                              Upcoming
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Reschedule
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Credit Customers Tab */}
            <TabsContent value="customers" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">
                        Credit Customers
                      </CardTitle>
                      <CardDescription>
                        Manage business accounts and credit limits
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => setIsGenerateInvoiceDialogOpen(true)}
                      >
                        <Receipt className="h-4 w-4" />
                        <span>Generate Invoice</span>
                      </Button>
                      <Button
                        className="flex items-center gap-1"
                        onClick={() => setIsAddCustomerDialogOpen(true)}
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Add Customer</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>{/* Customer content will go here */}</CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription>
                    View and export financial data for your station
                  </CardDescription>
                </CardHeader>
                <CardContent>{/* Reports content will go here */}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Dialogs */}
          <ShiftForm
            isOpen={isStartShiftDialogOpen}
            onClose={() => setIsStartShiftDialogOpen(false)}
            isStartShift={true}
            onSubmit={handleStartShift}
            dispensers={dispensers}
            employees={employees}
          />

          <ShiftForm
            isOpen={isEndShiftDialogOpen}
            onClose={() => setIsEndShiftDialogOpen(false)}
            isStartShift={false}
            onSubmit={handleEndShift}
            dispensers={dispensers}
            employees={employees}
          />

          <MultipleDispenserForm
            isOpen={isAddDispenserDialogOpen}
            onClose={() => setIsAddDispenserDialogOpen(false)}
            onSubmit={handleAddDispenser}
            fuelTypes={fuelTypes}
          />

          <InvoiceGenerator
            isOpen={isGenerateInvoiceDialogOpen}
            onClose={() => setIsGenerateInvoiceDialogOpen(false)}
            onSubmit={handleGenerateInvoice}
            customers={customers}
            customerSales={customerSales}
          />

          <CustomerPaymentForm
            isOpen={isRecordPaymentDialogOpen}
            onClose={() => setIsRecordPaymentDialogOpen(false)}
            onSubmit={handleRecordPayment}
            customer={selectedCustomer}
            invoices={invoices}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
