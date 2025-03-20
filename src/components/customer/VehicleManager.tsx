import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Plus, Edit, Trash2, Car } from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  model: string;
  type: string;
  status: "active" | "inactive";
}

interface VehicleManagerProps {
  vehicles?: Vehicle[];
  onAddVehicle?: (vehicle: Omit<Vehicle, "id">) => void;
  onEditVehicle?: (vehicle: Vehicle) => void;
  onDeleteVehicle?: (id: string) => void;
}

const VehicleManager = ({
  vehicles = [
    {
      id: "1",
      name: "Company Truck",
      licensePlate: "ABC-1234",
      model: "Toyota Hilux",
      type: "Truck",
      status: "active",
    },
    {
      id: "2",
      name: "Delivery Van",
      licensePlate: "XYZ-5678",
      model: "Ford Transit",
      type: "Van",
      status: "active",
    },
    {
      id: "3",
      name: "Executive Car",
      licensePlate: "DEF-9012",
      model: "BMW 5 Series",
      type: "Sedan",
      status: "inactive",
    },
  ],
  onAddVehicle = () => {},
  onEditVehicle = () => {},
  onDeleteVehicle = () => {},
}: VehicleManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    licensePlate: "",
    model: "",
    type: "",
    status: "active" as const,
  });

  const handleAddVehicle = () => {
    onAddVehicle(newVehicle);
    setNewVehicle({
      name: "",
      licensePlate: "",
      model: "",
      type: "",
      status: "active" as const,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditVehicle = () => {
    if (selectedVehicle) {
      onEditVehicle(selectedVehicle);
      setSelectedVehicle(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteVehicle = (id: string) => {
    onDeleteVehicle(id);
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            <span>Vehicle Management</span>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogDescription>
                  Add a new vehicle to your account for fuel tracking.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newVehicle.name}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, name: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="Company Truck"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="license" className="text-right">
                    License Plate
                  </Label>
                  <Input
                    id="license"
                    value={newVehicle.licensePlate}
                    onChange={(e) =>
                      setNewVehicle({
                        ...newVehicle,
                        licensePlate: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="ABC-1234"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model" className="text-right">
                    Model
                  </Label>
                  <Input
                    id="model"
                    value={newVehicle.model}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, model: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="Toyota Hilux"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Input
                    id="type"
                    value={newVehicle.type}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, type: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="Truck, Van, Sedan, etc."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddVehicle}>Add Vehicle</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Manage your registered vehicles and track fuel consumption for each
          one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>License Plate</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.name}</TableCell>
                <TableCell>{vehicle.licensePlate}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      vehicle.status === "active" ? "default" : "secondary"
                    }
                    className={
                      vehicle.status === "active"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }
                  >
                    {vehicle.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Total vehicles: {vehicles.length} | Active:{" "}
          {vehicles.filter((v) => v.status === "active").length}
        </div>
      </CardFooter>

      {/* Edit Vehicle Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update the details of your registered vehicle.
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={selectedVehicle.name}
                  onChange={(e) =>
                    setSelectedVehicle({
                      ...selectedVehicle,
                      name: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-license" className="text-right">
                  License Plate
                </Label>
                <Input
                  id="edit-license"
                  value={selectedVehicle.licensePlate}
                  onChange={(e) =>
                    setSelectedVehicle({
                      ...selectedVehicle,
                      licensePlate: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-model" className="text-right">
                  Model
                </Label>
                <Input
                  id="edit-model"
                  value={selectedVehicle.model}
                  onChange={(e) =>
                    setSelectedVehicle({
                      ...selectedVehicle,
                      model: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Type
                </Label>
                <Input
                  id="edit-type"
                  value={selectedVehicle.type}
                  onChange={(e) =>
                    setSelectedVehicle({
                      ...selectedVehicle,
                      type: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3 flex items-center gap-4">
                  <Button
                    variant={
                      selectedVehicle.status === "active"
                        ? "default"
                        : "outline"
                    }
                    className={
                      selectedVehicle.status === "active" ? "bg-green-500" : ""
                    }
                    onClick={() =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        status: "active",
                      })
                    }
                  >
                    Active
                  </Button>
                  <Button
                    variant={
                      selectedVehicle.status === "inactive"
                        ? "default"
                        : "outline"
                    }
                    className={
                      selectedVehicle.status === "inactive" ? "bg-gray-500" : ""
                    }
                    onClick={() =>
                      setSelectedVehicle({
                        ...selectedVehicle,
                        status: "inactive",
                      })
                    }
                  >
                    Inactive
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditVehicle}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VehicleManager;
