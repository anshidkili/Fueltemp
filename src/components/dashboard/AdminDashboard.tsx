import React from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import StationMetrics from "./StationMetrics";
import RecentTransactions from "./RecentTransactions";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Plus,
  FileBarChart,
  Users,
  Package,
  Fuel,
  CreditCard,
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
              <Button variant="outline" className="flex items-center gap-2">
                <FileBarChart className="h-4 w-4" />
                <span>Reports</span>
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Inventory</span>
              </Button>
            </div>
          </div>

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
                    <span className="text-sm font-medium">On Shift Now</span>
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Pending Approvals
                    </span>
                    <span className="text-sm font-bold text-amber-600">2</span>
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    Manage Employees
                  </Button>
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
                  <Button variant="outline" className="w-full mt-2">
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
                    <span className="text-sm font-bold text-red-600">1</span>
                  </div>
                  <Button variant="outline" className="w-full mt-2">
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
                      <Button className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        <span>Add Customer</span>
                      </Button>
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
                              <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                              </a>
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
                              <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                              </a>
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
                              <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                              </a>
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
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
