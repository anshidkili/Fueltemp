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
import { Package, Truck, Calendar } from "lucide-react";

interface InventoryManagementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  fuelTypes?: Array<{ id: string; name: string; price_per_liter: number }>;
  editData?: any;
}

const InventoryManagementForm = ({
  isOpen,
  onClose,
  onSubmit,
  fuelTypes = [],
  editData,
}: InventoryManagementFormProps) => {
  const [selectedFuelType, setSelectedFuelType] = useState(
    editData?.fuel_type_id || "",
  );
  const [quantity, setQuantity] = useState(editData?.quantity || "");
  const [deliveryDate, setDeliveryDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [supplier, setSupplier] = useState(editData?.supplier || "");
  const [invoiceNumber, setInvoiceNumber] = useState(
    editData?.invoice_number || "",
  );
  const [unitPrice, setUnitPrice] = useState(
    editData?.unit_price ||
      fuelTypes.find((ft) => ft.id === editData?.fuel_type_id)
        ?.price_per_liter ||
      "",
  );
  const [notes, setNotes] = useState(editData?.notes || "");

  // Update unit price when fuel type changes
  React.useEffect(() => {
    if (selectedFuelType) {
      const fuelType = fuelTypes.find((ft) => ft.id === selectedFuelType);
      if (fuelType) {
        setUnitPrice(fuelType.price_per_liter);
      }
    }
  }, [selectedFuelType, fuelTypes]);

  const calculateTotalCost = () => {
    return Number(quantity) * Number(unitPrice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      fuel_type_id: selectedFuelType,
      quantity_liters: Number(quantity),
      delivery_date: deliveryDate,
      supplier,
      invoice_number: invoiceNumber,
      unit_price: Number(unitPrice),
      total_cost: calculateTotalCost(),
      notes,
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
            {editData ? "Edit Inventory" : "Add Inventory"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "Update inventory details"
              : "Record a new fuel delivery to your station"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fuel-type" className="text-right">
              Fuel Type
            </Label>
            <Select
              value={selectedFuelType}
              onValueChange={setSelectedFuelType}
            >
              <SelectTrigger id="fuel-type" className="col-span-3">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} (${type.price_per_liter}/L)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity (L)
            </Label>
            <div className="relative col-span-3">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="pl-10"
                placeholder="Enter quantity in liters"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit-price" className="text-right">
              Unit Price
            </Label>
            <Input
              id="unit-price"
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="col-span-3"
              placeholder="Price per liter"
              step="0.01"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="delivery-date" className="text-right">
              Delivery Date
            </Label>
            <div className="relative col-span-3">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="delivery-date"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">
              Supplier
            </Label>
            <div className="relative col-span-3">
              <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="pl-10"
                placeholder="Supplier name"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="invoice-number" className="text-right">
              Invoice #
            </Label>
            <Input
              id="invoice-number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="col-span-3"
              placeholder="Invoice number"
            />
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

          <div className="grid grid-cols-4 items-center gap-4 mt-6">
            <div className="text-right col-span-2 font-medium">Total Cost:</div>
            <div className="col-span-2 font-bold text-xl">
              ${calculateTotalCost().toFixed(2)}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editData ? "Update Inventory" : "Add Inventory"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryManagementForm;
