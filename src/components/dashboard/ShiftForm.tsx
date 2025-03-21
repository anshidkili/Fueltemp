import React from "react";
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

interface FuelReading {
  fuelType: string;
  initialReading: number;
  finalReading?: number;
}

interface ShiftFormProps {
  isOpen: boolean;
  onClose: () => void;
  isStartShift: boolean;
  employeeId?: string;
  dispenserId?: string;
  onSubmit: (data: any) => void;
  dispensers?: Array<{
    id: string;
    dispenser_number: number;
    fuel_types: Array<{ id: string; name: string }>;
  }>;
  employees?: Array<{ id: string; profiles: { full_name: string } }>;
}

const ShiftForm = ({
  isOpen,
  onClose,
  isStartShift,
  employeeId,
  dispenserId,
  onSubmit,
  dispensers = [],
  employees = [],
}: ShiftFormProps) => {
  const [selectedDispenser, setSelectedDispenser] = React.useState(
    dispenserId || "",
  );
  const [selectedEmployee, setSelectedEmployee] = React.useState(
    employeeId || "",
  );
  const [cashAmount, setCashAmount] = React.useState(0);
  const [fuelReadings, setFuelReadings] = React.useState<FuelReading[]>([]);
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (selectedDispenser && dispensers.length > 0) {
      const dispenser = dispensers.find((d) => d.id === selectedDispenser);
      if (dispenser) {
        setFuelReadings(
          dispenser.fuel_types.map((fuel) => ({
            fuelType: fuel.id,
            initialReading: 0,
          })),
        );
      }
    }
  }, [selectedDispenser, dispensers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      employee_id: selectedEmployee,
      dispenser_id: selectedDispenser,
      cash_amount: cashAmount,
      fuel_readings: fuelReadings,
      notes,
      is_start_shift: isStartShift,
    };

    onSubmit(formData);
    onClose();
  };

  const updateFuelReading = (
    index: number,
    field: keyof FuelReading,
    value: number,
  ) => {
    const updatedReadings = [...fuelReadings];
    updatedReadings[index] = { ...updatedReadings[index], [field]: value };
    setFuelReadings(updatedReadings);
  };

  const getDispenserFuelTypes = () => {
    if (!selectedDispenser) return [];
    const dispenser = dispensers.find((d) => d.id === selectedDispenser);
    return dispenser ? dispenser.fuel_types : [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isStartShift ? "Start Shift" : "End Shift"}
          </DialogTitle>
          <DialogDescription>
            {isStartShift
              ? "Record initial meter readings and cash amount for the shift."
              : "Record final meter readings and cash collected at the end of shift."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {isStartShift && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">
                Employee
              </Label>
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
                disabled={!isStartShift}
              >
                <SelectTrigger id="employee" className="col-span-3">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.profiles.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isStartShift && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dispenser" className="text-right">
                Dispenser
              </Label>
              <Select
                value={selectedDispenser}
                onValueChange={setSelectedDispenser}
                disabled={!isStartShift}
              >
                <SelectTrigger id="dispenser" className="col-span-3">
                  <SelectValue placeholder="Select dispenser" />
                </SelectTrigger>
                <SelectContent>
                  {dispensers.map((dispenser) => (
                    <SelectItem key={dispenser.id} value={dispenser.id}>
                      Dispenser #{dispenser.dispenser_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cash-amount" className="text-right">
              {isStartShift ? "Initial Cash" : "Final Cash Collected"}
            </Label>
            <Input
              id="cash-amount"
              type="number"
              value={cashAmount}
              onChange={(e) => setCashAmount(Number(e.target.value))}
              className="col-span-3"
            />
          </div>

          <div className="border rounded-md p-4 mt-4">
            <h3 className="font-medium mb-3">
              {isStartShift ? "Initial Meter Readings" : "Final Meter Readings"}
            </h3>

            {fuelReadings.map((reading, index) => {
              const fuelType = getDispenserFuelTypes().find(
                (f) => f.id === reading.fuelType,
              );
              return (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center gap-4 mb-3"
                >
                  <Label className="text-right">
                    {fuelType?.name || "Fuel"}
                  </Label>
                  <Input
                    type="number"
                    value={
                      isStartShift
                        ? reading.initialReading
                        : reading.finalReading || 0
                    }
                    onChange={(e) =>
                      updateFuelReading(
                        index,
                        isStartShift ? "initialReading" : "finalReading",
                        Number(e.target.value),
                      )
                    }
                    className="col-span-3"
                    placeholder={`${isStartShift ? "Initial" : "Final"} reading`}
                  />
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              placeholder="Any additional notes"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isStartShift ? "Start Shift" : "End Shift"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftForm;
