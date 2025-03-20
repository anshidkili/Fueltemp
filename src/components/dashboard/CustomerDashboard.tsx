import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CreditCard, FileBarChart, Fuel, Car } from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import VehicleManager from "../customer/VehicleManager";
import InvoiceViewer from "../customer/InvoiceViewer";

interface CustomerDashboardProps {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
}

const CustomerDashboard = ({
  userName = "John Smith",
  userAvatar = "",
  notificationCount = 2,
}: CustomerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for dashboard metrics
  const dashboardMetrics = {
    totalVehicles: 3,
    activeVehicles: 2,
    totalFuelUsage: 450.5,
    currentBalance: 312.75,
    pendingInvoices: 2,
    lastPaymentDate: "2023-09-15",
    lastPaymentAmount: 245.5,
  };

  // Mock data for fuel usage by month
  const fuelUsageByMonth = [
    { month: "Jan", usage: 85.2 },
    { month: "Feb", usage: 72.5 },
    { month: "Mar", usage: 90.3 },
    { month: "Apr", usage: 65.8 },
    { month: "May", usage: 78.4 },
    { month: "Jun", usage: 95.7 },
  ];

  // Mock data for fuel usage by vehicle
  const fuelUsageByVehicle = [
    { vehicle: "Company Truck", usage: 180.5 },
    { vehicle: "Delivery Van", usage: 150.2 },
    { vehicle: "Executive Car", usage: 120.8 },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar userRole="customer" activePath="/dashboard" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={userName}
          userRole="Credit Customer"
          userAvatar={userAvatar}
          notificationCount={notificationCount}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, {userName}</p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <FileBarChart className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="usage" className="flex items-center gap-2">
                <Fuel className="h-4 w-4" />
                Fuel Usage
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Invoices
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Vehicles"
                  value={dashboardMetrics.totalVehicles}
                  icon={<Car className="h-5 w-5 text-blue-500" />}
                  description={`${dashboardMetrics.activeVehicles} active`}
                />
                <MetricCard
                  title="Total Fuel Usage"
                  value={`${dashboardMetrics.totalFuelUsage} L`}
                  icon={<Fuel className="h-5 w-5 text-green-500" />}
                  description="This month"
                />
                <MetricCard
                  title="Current Balance"
                  value={`$${dashboardMetrics.currentBalance}`}
                  icon={<CreditCard className="h-5 w-5 text-red-500" />}
                  description={`${dashboardMetrics.pendingInvoices} pending invoices`}
                />
                <MetricCard
                  title="Last Payment"
                  value={`$${dashboardMetrics.lastPaymentAmount}`}
                  icon={<FileBarChart className="h-5 w-5 text-purple-500" />}
                  description={`on ${dashboardMetrics.lastPaymentDate}`}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Fuel Usage by Month
                    </h3>
                    <div className="h-64 flex items-end space-x-2">
                      {fuelUsageByMonth.map((item) => (
                        <div
                          key={item.month}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className="bg-blue-500 rounded-t w-full"
                            style={{ height: `${(item.usage / 100) * 200}px` }}
                          ></div>
                          <div className="mt-2 text-sm">{item.month}</div>
                          <div className="text-xs text-gray-500">
                            {item.usage}L
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Fuel Usage by Vehicle
                    </h3>
                    <div className="space-y-4">
                      {fuelUsageByVehicle.map((item) => (
                        <div key={item.vehicle} className="space-y-2">
                          <div className="flex justify-between">
                            <span>{item.vehicle}</span>
                            <span>{item.usage}L</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-green-500 h-2.5 rounded-full"
                              style={{ width: `${(item.usage / 200) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles">
              <VehicleManager />
            </TabsContent>

            {/* Fuel Usage Tab */}
            <TabsContent value="usage">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Fuel Usage Analysis
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">
                        Usage by Fuel Type
                      </h3>
                      <div className="flex items-center justify-center h-64">
                        {/* Placeholder for pie chart */}
                        <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-200">
                          <div
                            className="absolute bg-blue-500"
                            style={{ width: "60%", height: "100%" }}
                          ></div>
                          <div
                            className="absolute bg-green-500"
                            style={{
                              width: "30%",
                              height: "100%",
                              left: "60%",
                            }}
                          ></div>
                          <div
                            className="absolute bg-yellow-500"
                            style={{
                              width: "10%",
                              height: "100%",
                              left: "90%",
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 flex items-center justify-center bg-white rounded-full"
                            style={{
                              width: "70%",
                              height: "70%",
                              left: "15%",
                              top: "15%",
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-center space-x-4 mt-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-sm">Regular (60%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm">Premium (30%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-sm">Diesel (10%)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">
                        Monthly Trend
                      </h3>
                      <div className="h-64 flex items-end space-x-2">
                        {fuelUsageByMonth.map((item) => (
                          <div
                            key={item.month}
                            className="flex flex-col items-center flex-1"
                          >
                            <div
                              className="bg-blue-500 rounded-t w-full"
                              style={{
                                height: `${(item.usage / 100) * 200}px`,
                              }}
                            ></div>
                            <div className="mt-2 text-sm">{item.month}</div>
                            <div className="text-xs text-gray-500">
                              {item.usage}L
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Detailed Usage by Vehicle
                    </h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Vehicle</th>
                          <th className="text-left py-2">License Plate</th>
                          <th className="text-left py-2">Fuel Type</th>
                          <th className="text-left py-2">This Month</th>
                          <th className="text-left py-2">Last Month</th>
                          <th className="text-left py-2">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-3">Company Truck</td>
                          <td className="py-3">ABC-1234</td>
                          <td className="py-3">Diesel</td>
                          <td className="py-3">85.2 L</td>
                          <td className="py-3">78.5 L</td>
                          <td className="py-3 text-green-500">+8.5%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3">Delivery Van</td>
                          <td className="py-3">XYZ-5678</td>
                          <td className="py-3">Regular</td>
                          <td className="py-3">65.8 L</td>
                          <td className="py-3">72.3 L</td>
                          <td className="py-3 text-red-500">-9.0%</td>
                        </tr>
                        <tr>
                          <td className="py-3">Executive Car</td>
                          <td className="py-3">DEF-9012</td>
                          <td className="py-3">Premium</td>
                          <td className="py-3">45.5 L</td>
                          <td className="py-3">42.8 L</td>
                          <td className="py-3 text-green-500">+6.3%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices">
              <InvoiceViewer />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const MetricCard = ({ title, value, icon, description }: MetricCardProps) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {description && (
              <p className="text-xs text-slate-400 mt-1">{description}</p>
            )}
          </div>
          <div className="p-2 bg-slate-100 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDashboard;
