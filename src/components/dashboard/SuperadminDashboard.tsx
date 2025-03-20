import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BarChart3, Users, Building2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import StationsList from "./StationsList";

interface SuperadminDashboardProps {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  stations?: any[];
  totalUsers?: number;
  totalStations?: number;
  activeStations?: number;
  inactiveStations?: number;
  maintenanceStations?: number;
  recentAlerts?: Array<{
    id: string;
    stationName: string;
    message: string;
    severity: "high" | "medium" | "low";
    timestamp: string;
  }>;
}

const SuperadminDashboard = ({
  userName = "Admin User",
  userAvatar = "",
  notificationCount = 5,
  stations = [],
  totalUsers = 45,
  totalStations = 12,
  activeStations = 9,
  inactiveStations = 2,
  maintenanceStations = 1,
  recentAlerts = [
    {
      id: "1",
      stationName: "Central City Station",
      message: "Fuel inventory below threshold",
      severity: "high",
      timestamp: "2023-06-15T10:30:00",
    },
    {
      id: "2",
      stationName: "Westside Fuel Center",
      message: "Dispenser #3 maintenance required",
      severity: "medium",
      timestamp: "2023-06-15T09:15:00",
    },
    {
      id: "3",
      stationName: "Eastside Gas Station",
      message: "System update pending",
      severity: "low",
      timestamp: "2023-06-14T16:45:00",
    },
  ],
}: SuperadminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleViewStationDetails = (stationId: string) => {
    console.log(`View details for station ${stationId}`);
    // Navigation logic would go here
  };

  const handleManageStation = (stationId: string) => {
    console.log(`Manage station ${stationId}`);
    // Navigation logic would go here
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500 bg-red-50";
      case "medium":
        return "text-amber-500 bg-amber-50";
      case "low":
        return "text-blue-500 bg-blue-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="superadmin" activePath="/dashboard" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={userName}
          userRole="Superadmin"
          userAvatar={userAvatar}
          notificationCount={notificationCount}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Superadmin Dashboard</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Station
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Stations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-primary mr-2" />
                  <div className="text-3xl font-bold">{totalStations}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Active Stations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {activeStations}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Stations in Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                    <Building2 className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="text-3xl font-bold text-amber-600">
                    {maintenanceStations}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-primary mr-2" />
                  <div className="text-3xl font-bold">{totalUsers}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stations">Stations</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Station Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md">
                      <BarChart3 className="h-16 w-16 text-slate-300" />
                      <span className="ml-2 text-slate-500">
                        Activity chart will appear here
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-md ${getSeverityColor(alert.severity)}`}
                        >
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">
                                {alert.stationName}
                              </h4>
                              <p className="text-sm">{alert.message}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {new Date(alert.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stations" className="mt-6">
              <StationsList
                onViewDetails={handleViewStationDetails}
                onManageStation={handleManageStation}
              />
            </TabsContent>

            <TabsContent value="alerts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAlerts.length > 0 ? (
                      recentAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-4 rounded-md ${getSeverityColor(alert.severity)}`}
                        >
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">
                                  {alert.stationName}
                                </h4>
                                <span className="text-xs capitalize px-2 py-1 rounded-full bg-white bg-opacity-50">
                                  {alert.severity} priority
                                </span>
                              </div>
                              <p className="mt-1">{alert.message}</p>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-xs opacity-70">
                                  {new Date(alert.timestamp).toLocaleString()}
                                </p>
                                <Button variant="ghost" size="sm">
                                  Resolve
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No alerts at this time</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default SuperadminDashboard;
