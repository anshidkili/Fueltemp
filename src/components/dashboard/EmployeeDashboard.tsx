import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import ShiftManager from "./ShiftManager";
import SalesInterface from "../sales/SalesInterface";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Clock, FileText, Fuel, History } from "lucide-react";

interface EmployeeDashboardProps {
  userName?: string;
  userAvatar?: string;
  isShiftActive?: boolean;
  shiftStartTime?: string;
  shiftDuration?: string;
  initialMeterReading?: number;
  currentMeterReading?: number;
  recentSales?: {
    id: string;
    timestamp: string;
    fuelType: string;
    liters: number;
    amount: number;
    paymentMethod: string;
    customer?: string;
  }[];
}

const EmployeeDashboard = ({
  userName = "John Employee",
  userAvatar = "",
  isShiftActive = false,
  shiftStartTime = "08:00 AM",
  shiftDuration = "02:45:30",
  initialMeterReading = 12500,
  currentMeterReading = 12650,
  recentSales = [
    {
      id: "SALE-001",
      timestamp: "2023-06-15T09:30:00",
      fuelType: "Petrol",
      liters: 25.5,
      amount: 38.25,
      paymentMethod: "cash",
    },
    {
      id: "SALE-002",
      timestamp: "2023-06-15T10:15:00",
      fuelType: "Diesel",
      liters: 40,
      amount: 56,
      paymentMethod: "card",
    },
    {
      id: "SALE-003",
      timestamp: "2023-06-15T11:05:00",
      fuelType: "Premium",
      liters: 15,
      amount: 25.5,
      paymentMethod: "credit",
      customer: "ABC Company",
    },
  ],
}: EmployeeDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [shiftStatus, setShiftStatus] = useState<boolean>(isShiftActive);
  const [salesHistory, setSalesHistory] = useState(recentSales);

  const handleStartShift = (initialReading: number) => {
    setShiftStatus(true);
    console.log(`Shift started with initial reading: ${initialReading}`);
  };

  const handleEndShift = (finalReading: number) => {
    setShiftStatus(false);
    console.log(`Shift ended with final reading: ${finalReading}`);
  };

  const handleSaleComplete = (saleData: any) => {
    // Add the new sale to the sales history
    setSalesHistory([saleData, ...salesHistory]);
    console.log("Sale completed:", saleData);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole="employee" activePath="/dashboard" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={userName}
          userRole="Employee"
          userAvatar={userAvatar}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Employee Dashboard</h1>
            <p className="text-gray-500">Manage fuel dispensing and sales</p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Shift Overview
              </TabsTrigger>
              <TabsTrigger
                value="dispensing"
                className="flex items-center gap-2"
              >
                <Fuel className="h-4 w-4" />
                Fuel Dispensing
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Sales History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <ShiftManager
                isShiftActive={shiftStatus}
                shiftStartTime={shiftStartTime}
                shiftDuration={shiftDuration}
                initialMeterReading={initialMeterReading}
                currentMeterReading={currentMeterReading}
                onStartShift={handleStartShift}
                onEndShift={handleEndShift}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  {salesHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Time</th>
                            <th className="text-left py-3 px-4">Fuel Type</th>
                            <th className="text-left py-3 px-4">Liters</th>
                            <th className="text-left py-3 px-4">Amount</th>
                            <th className="text-left py-3 px-4">Payment</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesHistory.slice(0, 5).map((sale) => (
                            <tr
                              key={sale.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                {new Date(sale.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </td>
                              <td className="py-3 px-4">{sale.fuelType}</td>
                              <td className="py-3 px-4">
                                {sale.liters.toFixed(2)}
                              </td>
                              <td className="py-3 px-4">
                                ${sale.amount.toFixed(2)}
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant={
                                    sale.paymentMethod === "credit"
                                      ? "outline"
                                      : "default"
                                  }
                                  className="capitalize"
                                >
                                  {sale.paymentMethod}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No sales recorded during this shift
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dispensing">
              <SalesInterface onSaleComplete={handleSaleComplete} />
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Sales History</CardTitle>
                </CardHeader>
                <CardContent>
                  {salesHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">ID</th>
                            <th className="text-left py-3 px-4">Date & Time</th>
                            <th className="text-left py-3 px-4">Fuel Type</th>
                            <th className="text-left py-3 px-4">Liters</th>
                            <th className="text-left py-3 px-4">Amount</th>
                            <th className="text-left py-3 px-4">Payment</th>
                            <th className="text-left py-3 px-4">Customer</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesHistory.map((sale) => (
                            <tr
                              key={sale.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">{sale.id}</td>
                              <td className="py-3 px-4">
                                {new Date(sale.timestamp).toLocaleString()}
                              </td>
                              <td className="py-3 px-4">{sale.fuelType}</td>
                              <td className="py-3 px-4">
                                {sale.liters.toFixed(2)}
                              </td>
                              <td className="py-3 px-4">
                                ${sale.amount.toFixed(2)}
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant={
                                    sale.paymentMethod === "credit"
                                      ? "outline"
                                      : "default"
                                  }
                                  className="capitalize"
                                >
                                  {sale.paymentMethod}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                {sale.customer || "-"}
                              </td>
                              <td className="py-3 px-4">
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No sales history available
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
