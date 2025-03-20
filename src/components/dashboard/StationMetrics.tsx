import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Fuel, DollarSign, Activity, Users } from "lucide-react";

interface StationMetricsProps {
  inventoryLevel?: number;
  dailySales?: number;
  activeDispensers?: number;
  creditCustomerBalance?: number;
}

const StationMetrics = ({
  inventoryLevel = 75,
  dailySales = 4250,
  activeDispensers = 6,
  creditCustomerBalance = 12500,
}: StationMetricsProps) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Station Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Inventory Level Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Level
            </CardTitle>
            <Fuel className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryLevel}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {inventoryLevel > 50 ? "Sufficient stock" : "Low stock alert"}
            </p>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${inventoryLevel > 25 ? "bg-blue-600" : "bg-red-500"}`}
                style={{ width: `${inventoryLevel}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Daily Sales Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dailySales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +5% from yesterday
            </p>
            <div className="mt-4 flex items-center">
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
              <span className="text-xs text-green-600 ml-2">65%</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Dispensers Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Dispensers
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeDispensers}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / 8
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeDispensers === 8
                ? "All dispensers active"
                : `${8 - activeDispensers} inactive`}
            </p>
            <div className="mt-4 grid grid-cols-8 gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full ${i < activeDispensers ? "bg-purple-600" : "bg-gray-200"}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Credit Customer Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Credit Customer Balance
            </CardTitle>
            <Users className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${creditCustomerBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across 24 active accounts
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600" style={{ width: "70%" }} />
              </div>
              <span className="text-xs">70% collected</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StationMetrics;
