import React, { useState } from "react";
import { Button } from "../ui/button";
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
} from "../ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface FuelType {
  id: string;
  name: string;
}

interface DispenserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  fuelTypes?: FuelType[];
  editData?: any;
}

const MultipleDispenserForm = ({
  isOpen,
  onClose,
  onSubmit,
  fuelTypes = [],
  editData,
}: DispenserFormProps) => {
  const [dispenserNumber, setDispenserNumber] = useState(
    editData?.dispenser_number || "",
  );
  const [status, setStatus] = useState(editData?.status || "operational");
  const [selectedFuels, setSelectedFuels] = useState<
    Array<{ id: string; fuelTypeId: string; initialReading: number }>
  >(
    editData?.fuel_types?.map((ft: any) => ({
      id: Date.now().toString() + Math.random(),
      fuelTypeId: ft.id,
      initialReading: 0,
    })) || [{ id: Date.now().toString(), fuelTypeId: "", initialReading: 0 }],
  );
  const [manufacturer, setManufacturer] = useState(
    editData?.manufacturer || "",
  );
  const [installationDate, setInstallationDate] = useState(
    editData?.installation_date || "",
  );

  const addFuelType = () => {
    setSelectedFuels([
      ...selectedFuels,
      { id: Date.now().toString(), fuelTypeId: "", initialReading: 0 },
    ]);
  };

  const removeFuelType = (id: string) => {
    if (selectedFuels.length > 1) {
      setSelectedFuels(selectedFuels.filter((fuel) => fuel.id !== id));
    }
  };

  const updateFuelType = (id: string, field: string, value: any) => {
    setSelectedFuels(
      selectedFuels.map((fuel) => {
        if (fuel.id === id) {
          return { ...fuel, [field]: value };
        }
        return fuel;
      }),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      dispenser_number: Number(dispenserNumber),
      status,
      fuel_types: selectedFuels.map(({ id, ...rest }) => rest),
      manufacturer,
      installation_date: installationDate,
      ...(editData?.id ? { id: editData.id } : {}),
    };

    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Dispenser" : "Add New Dispenser"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "Update dispenser details and fuel types"
              : "Configure a new fuel dispenser for your station"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dispenser-number" className="text-right">
              Dispenser #
            </Label>
            <Input
              id="dispenser-number"
              type="number"
              value={dispenserNumber}
              onChange={(e) => setDispenserNumber(e.target.value)}
              className="col-span-3"
              placeholder="Enter dispenser number"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manufacturer" className="text-right">
              Manufacturer
            </Label>
            <Input
              id="manufacturer"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="col-span-3"
              placeholder="Enter manufacturer name"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="installation-date" className="text-right">
              Installation Date
            </Label>
            <Input
              id="installation-date"
              type="date"
              value={installationDate}
              onChange={(e) => setInstallationDate(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="border rounded-md p-4 mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Fuel Types</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFuelType}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Fuel Type
              </Button>
            </div>

            {selectedFuels.map((fuel, index) => (
              <div
                key={fuel.id}
                className="grid grid-cols-12 gap-2 mb-3 items-center"
              >
                <div className="col-span-5">
                  <Select
                    value={fuel.fuelTypeId}
                    onValueChange={(value) =>
                      updateFuelType(fuel.id, "fuelTypeId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-5">
                  <Input
                    type="number"
                    value={fuel.initialReading}
                    onChange={(e) =>
                      updateFuelType(
                        fuel.id,
                        "initialReading",
                        Number(e.target.value),
                      )
                    }
                    placeholder="Initial meter reading"
                  />
                </div>

                <div className="col-span-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFuelType(fuel.id)}
                    disabled={selectedFuels.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editData ? "Update Dispenser" : "Add Dispenser"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MultipleDispenserForm;
