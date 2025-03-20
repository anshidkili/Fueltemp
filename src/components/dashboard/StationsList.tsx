import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Badge } from "../ui/badge";
import { Search, Filter, Eye, Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Station {
  id: string;
  name: string;
  location: string;
  status: "active" | "inactive" | "maintenance";
  dispensers: number;
  fuelTypes: string[];
  dailySales: number;
  lastUpdated: string;
}

interface StationsListProps {
  stations?: Station[];
  onViewDetails?: (stationId: string) => void;
  onManageStation?: (stationId: string) => void;
}

const StationsList = ({
  stations = [
    {
      id: "1",
      name: "Central City Station",
      location: "123 Main St, Central City",
      status: "active",
      dispensers: 8,
      fuelTypes: ["Regular", "Premium", "Diesel"],
      dailySales: 5280.5,
      lastUpdated: "2023-06-15T14:30:00",
    },
    {
      id: "2",
      name: "Westside Fuel Center",
      location: "456 West Ave, Westside",
      status: "active",
      dispensers: 6,
      fuelTypes: ["Regular", "Premium"],
      dailySales: 3750.25,
      lastUpdated: "2023-06-15T15:45:00",
    },
    {
      id: "3",
      name: "Eastside Gas Station",
      location: "789 East Blvd, Eastside",
      status: "maintenance",
      dispensers: 4,
      fuelTypes: ["Regular", "Diesel"],
      dailySales: 0,
      lastUpdated: "2023-06-14T09:15:00",
    },
    {
      id: "4",
      name: "Northpoint Fuels",
      location: "321 North Rd, Northpoint",
      status: "inactive",
      dispensers: 10,
      fuelTypes: ["Regular", "Premium", "Diesel", "Electric"],
      dailySales: 0,
      lastUpdated: "2023-06-10T11:20:00",
    },
    {
      id: "5",
      name: "Southside Energy",
      location: "654 South St, Southside",
      status: "active",
      dispensers: 12,
      fuelTypes: ["Regular", "Premium", "Diesel", "Biofuel"],
      dailySales: 7890.75,
      lastUpdated: "2023-06-15T16:10:00",
    },
  ],
  onViewDetails = () => {},
  onManageStation = () => {},
}: StationsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter stations based on search term and status filter
  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || station.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStations = filteredStations.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getStatusBadge = (status: Station["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gray-400">
            Inactive
          </Badge>
        );
      case "maintenance":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500"
          >
            Maintenance
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={18} className="text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableCaption>List of all fuel stations</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Dispensers</TableHead>
                <TableHead>Fuel Types</TableHead>
                <TableHead className="text-right">Daily Sales</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStations.length > 0 ? (
                paginatedStations.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell className="font-medium">
                      {station.name}
                    </TableCell>
                    <TableCell>{station.location}</TableCell>
                    <TableCell>{getStatusBadge(station.status)}</TableCell>
                    <TableCell className="text-center">
                      {station.dispensers}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {station.fuelTypes.map((type, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ${station.dailySales.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDetails(station.id)}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onManageStation(station.id)}
                          title="Manage Station"
                        >
                          <Settings size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    No stations found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StationsList;
