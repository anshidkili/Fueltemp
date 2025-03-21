import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  BarChart,
  PieChart,
  Download,
  FileBarChart,
  Calendar,
  DollarSign,
} from "lucide-react";

interface FinancialReportsSectionProps {
  stationId?: string;
}

const FinancialReportsSection = ({
  stationId = "1",
}: FinancialReportsSectionProps) => {
  const [reportType, setReportType] = React.useState("sales");
  const [dateRange, setDateRange] = React.useState("this-month");
  const [startDate, setStartDate] = React.useState(
    new Date(new Date().setDate(1)).toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = React.useState(
    new Date().toISOString().split("T")[0],
  );

  // Mock data for demonstration
  const salesData = [
    { date: "2023-06-01", amount: 4250 },
    { date: "2023-06-02", amount: 3980 },
    { date: "2023-06-03", amount: 5120 },
    { date: "2023-06-04", amount: 4780 },
    { date: "2023-06-05", amount: 5280 },
    { date: "2023-06-06", amount: 4950 },
    { date: "2023-06-07", amount: 5340 },
  ];

  const fuelTypeData = [
    { type: "Regular Unleaded", volume: 12500, amount: 43750 },
    { type: "Premium Unleaded", volume: 5800, amount: 23780 },
    { type: "Diesel", volume: 8750, amount: 33250 },
  ];

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    const today = new Date();
    let start = new Date();

    switch (value) {
      case "today":
        start = today;
        break;
      case "yesterday":
        start = new Date(today.setDate(today.getDate() - 1));
        break;
      case "this-week":
        start = new Date(today.setDate(today.getDate() - today.getDay()));
        break;
      case "this-month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "last-month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        setEndDate(end.toISOString().split("T")[0]);
        break;
      case "custom":
        // Don't change dates for custom range
        return;
    }

    setStartDate(start.toISOString().split("T")[0]);
    if (value !== "last-month") {
      setEndDate(new Date().toISOString().split("T")[0]);
    }
  };

  const generateReport = () => {
    console.log("Generating report:", {
      type: reportType,
      dateRange,
      startDate,
      endDate,
    });
    // In a real app, this would fetch data from the API
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Financial Reports</CardTitle>
              <CardDescription>
                Generate and view financial reports for your station
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={generateReport}
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="profit-loss">Profit & Loss</SelectItem>
                  <SelectItem value="customer">Customer Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger id="date-range">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === "custom" && (
              <div className="md:col-span-1 grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="summary" className="flex items-center gap-1">
                <FileBarChart className="h-4 w-4" /> Summary
              </TabsTrigger>
              <TabsTrigger value="chart" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" /> Charts
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" /> Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sales Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Sales</span>
                        <span className="text-sm font-bold">$34,200.50</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Total Volume
                        </span>
                        <span className="text-sm font-bold">27,050 L</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Transactions
                        </span>
                        <span className="text-sm font-bold">842</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Avg. Transaction
                        </span>
                        <span className="text-sm font-bold">$40.62</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Fuel Type Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {fuelTypeData.map((fuel, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm font-medium">
                            {fuel.type}
                          </span>
                          <div className="text-right">
                            <div className="text-sm font-bold">
                              ${fuel.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {fuel.volume.toLocaleString()} L
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="chart">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Daily Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p>Chart visualization would appear here</p>
                        <p className="text-sm mt-2">
                          Showing sales data from {startDate} to {endDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Fuel Type Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <PieChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p>Pie chart visualization would appear here</p>
                        <p className="text-sm mt-2">
                          Showing distribution by fuel type
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Detailed Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fuel Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Volume
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Method
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            2023-06-15
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Regular Unleaded
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            45.2 L
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            $158.20
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Credit Card
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            2023-06-15
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Diesel
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            65.8 L
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            $250.04
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">Cash</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            2023-06-14
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Premium Unleaded
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            32.5 L
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            $133.25
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Credit Card
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            2023-06-14
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Regular Unleaded
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            28.7 L
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            $100.45
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Credit Customer
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReportsSection;
