import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
  DialogTrigger,
} from "../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import {
  GasPump,
  CreditCard,
  Banknote,
  Receipt,
  User,
  Car,
} from "lucide-react";

interface SalesInterfaceProps {
  dispensers?: {
    id: string;
    name: string;
    fuelTypes: { id: string; name: string; pricePerLiter: number }[];
  }[];
  creditCustomers?: {
    id: string;
    name: string;
    vehicles: { id: string; name: string; plateNumber: string }[];
  }[];
  onSaleComplete?: (saleData: any) => void;
}

const SalesInterface = ({
  dispensers = [
    {
      id: "1",
      name: "Dispenser 1",
      fuelTypes: [
        { id: "1", name: "Petrol", pricePerLiter: 1.5 },
        { id: "2", name: "Diesel", pricePerLiter: 1.4 },
      ],
    },
    {
      id: "2",
      name: "Dispenser 2",
      fuelTypes: [
        { id: "1", name: "Petrol", pricePerLiter: 1.5 },
        { id: "2", name: "Diesel", pricePerLiter: 1.4 },
      ],
    },
    {
      id: "3",
      name: "Dispenser 3",
      fuelTypes: [{ id: "3", name: "Premium", pricePerLiter: 1.7 }],
    },
  ],
  creditCustomers = [
    {
      id: "1",
      name: "ABC Company",
      vehicles: [
        { id: "1", name: "Delivery Van", plateNumber: "ABC123" },
        { id: "2", name: "Manager Car", plateNumber: "XYZ789" },
      ],
    },
    {
      id: "2",
      name: "XYZ Logistics",
      vehicles: [
        { id: "3", name: "Truck 1", plateNumber: "TRK001" },
        { id: "4", name: "Truck 2", plateNumber: "TRK002" },
      ],
    },
  ],
  onSaleComplete = () => {},
}: SalesInterfaceProps) => {
  const [saleType, setSaleType] = useState("regular");
  const [selectedDispenser, setSelectedDispenser] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [liters, setLiters] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<any>(null);

  // Find the selected dispenser and fuel type for price calculation
  const dispenser = dispensers.find((d) => d.id === selectedDispenser);
  const fuelType = dispenser?.fuelTypes.find((f) => f.id === selectedFuelType);
  const pricePerLiter = fuelType?.pricePerLiter || 0;

  // Calculate amount or liters based on the other value
  const calculateAmount = (litersValue: string) => {
    if (litersValue && pricePerLiter) {
      const calculatedAmount = parseFloat(litersValue) * pricePerLiter;
      setAmount(calculatedAmount.toFixed(2));
    } else {
      setAmount("");
    }
  };

  const calculateLiters = (amountValue: string) => {
    if (amountValue && pricePerLiter) {
      const calculatedLiters = parseFloat(amountValue) / pricePerLiter;
      setLiters(calculatedLiters.toFixed(2));
    } else {
      setLiters("");
    }
  };

  const handleLitersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLiters(value);
    calculateAmount(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    calculateLiters(value);
  };

  const handleDispenserChange = (value: string) => {
    setSelectedDispenser(value);
    setSelectedFuelType(""); // Reset fuel type when dispenser changes
    setLiters("");
    setAmount("");
  };

  const handleFuelTypeChange = (value: string) => {
    setSelectedFuelType(value);
    setLiters("");
    setAmount("");
  };

  const handleCustomerChange = (value: string) => {
    setSelectedCustomer(value);
    setSelectedVehicle(""); // Reset vehicle when customer changes
  };

  const processSale = () => {
    // Create sale object based on inputs
    const sale = {
      id: `SALE-${Date.now()}`,
      timestamp: new Date().toISOString(),
      dispenser: dispenser?.name,
      fuelType: fuelType?.name,
      liters: parseFloat(liters),
      pricePerLiter,
      totalAmount: parseFloat(amount),
      paymentMethod: saleType === "regular" ? paymentMethod : "credit",
      customer:
        saleType === "credit"
          ? creditCustomers.find((c) => c.id === selectedCustomer)?.name
          : null,
      vehicle:
        saleType === "credit"
          ? creditCustomers
              .find((c) => c.id === selectedCustomer)
              ?.vehicles.find((v) => v.id === selectedVehicle)?.plateNumber
          : null,
    };

    setCurrentSale(sale);
    setReceiptDialogOpen(true);

    // Call the onSaleComplete callback with the sale data
    onSaleComplete(sale);
  };

  const resetForm = () => {
    setSaleType("regular");
    setSelectedDispenser("");
    setSelectedFuelType("");
    setLiters("");
    setAmount("");
    setPaymentMethod("cash");
    setSelectedCustomer("");
    setSelectedVehicle("");
    setReceiptDialogOpen(false);
    setCurrentSale(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <Tabs
        defaultValue="regular"
        onValueChange={setSaleType}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Fuel Sales</h2>
          <TabsList>
            <TabsTrigger value="regular" className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Regular Sale
            </TabsTrigger>
            <TabsTrigger value="credit" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Credit Sale
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="regular" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regular Sale</CardTitle>
              <CardDescription>
                Process a standard fuel sale with immediate payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dispenser">Select Dispenser</Label>
                    <Select
                      value={selectedDispenser}
                      onValueChange={handleDispenserChange}
                    >
                      <SelectTrigger id="dispenser" className="w-full">
                        <SelectValue placeholder="Select dispenser" />
                      </SelectTrigger>
                      <SelectContent>
                        {dispensers.map((dispenser) => (
                          <SelectItem key={dispenser.id} value={dispenser.id}>
                            {dispenser.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDispenser && (
                    <div>
                      <Label htmlFor="fuelType">Select Fuel Type</Label>
                      <Select
                        value={selectedFuelType}
                        onValueChange={handleFuelTypeChange}
                      >
                        <SelectTrigger id="fuelType" className="w-full">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          {dispenser?.fuelTypes.map((fuel) => (
                            <SelectItem key={fuel.id} value={fuel.id}>
                              {fuel.name} - ${fuel.pricePerLiter.toFixed(2)}/L
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedFuelType && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="liters">Liters</Label>
                        <Input
                          id="liters"
                          type="number"
                          value={liters}
                          onChange={handleLitersChange}
                          placeholder="Enter liters"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount ($)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={handleAmountChange}
                          placeholder="Enter amount"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {selectedFuelType && (
                  <div className="space-y-4">
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label
                          htmlFor="cash"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Banknote className="h-4 w-4" /> Cash
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label
                          htmlFor="card"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <CreditCard className="h-4 w-4" /> Card
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-2">Sale Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Dispenser:</span>
                          <span>{dispenser?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fuel Type:</span>
                          <span>{fuelType?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price per Liter:</span>
                          <span>${pricePerLiter.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Liters:</span>
                          <span>{liters || "0.00"}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total Amount:</span>
                          <span>${amount || "0.00"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                disabled={
                  !selectedDispenser || !selectedFuelType || !liters || !amount
                }
                onClick={processSale}
                className="flex items-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                Complete Sale
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="credit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Credit Customer Sale</CardTitle>
              <CardDescription>
                Process a fuel sale for credit customers with monthly billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer">Select Customer</Label>
                    <Select
                      value={selectedCustomer}
                      onValueChange={handleCustomerChange}
                    >
                      <SelectTrigger id="customer" className="w-full">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {creditCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCustomer && (
                    <div>
                      <Label htmlFor="vehicle">Select Vehicle</Label>
                      <Select
                        value={selectedVehicle}
                        onValueChange={setSelectedVehicle}
                      >
                        <SelectTrigger id="vehicle" className="w-full">
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {creditCustomers
                            .find((c) => c.id === selectedCustomer)
                            ?.vehicles.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.name} ({vehicle.plateNumber})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedVehicle && (
                    <>
                      <div>
                        <Label htmlFor="dispenser-credit">
                          Select Dispenser
                        </Label>
                        <Select
                          value={selectedDispenser}
                          onValueChange={handleDispenserChange}
                        >
                          <SelectTrigger
                            id="dispenser-credit"
                            className="w-full"
                          >
                            <SelectValue placeholder="Select dispenser" />
                          </SelectTrigger>
                          <SelectContent>
                            {dispensers.map((dispenser) => (
                              <SelectItem
                                key={dispenser.id}
                                value={dispenser.id}
                              >
                                {dispenser.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedDispenser && (
                        <div>
                          <Label htmlFor="fuelType-credit">
                            Select Fuel Type
                          </Label>
                          <Select
                            value={selectedFuelType}
                            onValueChange={handleFuelTypeChange}
                          >
                            <SelectTrigger
                              id="fuelType-credit"
                              className="w-full"
                            >
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                              {dispenser?.fuelTypes.map((fuel) => (
                                <SelectItem key={fuel.id} value={fuel.id}>
                                  {fuel.name} - ${fuel.pricePerLiter.toFixed(2)}
                                  /L
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </>
                  )}

                  {selectedFuelType && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="liters-credit">Liters</Label>
                        <Input
                          id="liters-credit"
                          type="number"
                          value={liters}
                          onChange={handleLitersChange}
                          placeholder="Enter liters"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount-credit">Amount ($)</Label>
                        <Input
                          id="amount-credit"
                          type="number"
                          value={amount}
                          onChange={handleAmountChange}
                          placeholder="Enter amount"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {selectedFuelType && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-2">Customer Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {
                              creditCustomers.find(
                                (c) => c.id === selectedCustomer,
                              )?.name
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-gray-500" />
                          <span>
                            {
                              creditCustomers
                                .find((c) => c.id === selectedCustomer)
                                ?.vehicles.find((v) => v.id === selectedVehicle)
                                ?.name
                            }
                            (
                            {
                              creditCustomers
                                .find((c) => c.id === selectedCustomer)
                                ?.vehicles.find((v) => v.id === selectedVehicle)
                                ?.plateNumber
                            }
                            )
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-2">Sale Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Dispenser:</span>
                          <span>{dispenser?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fuel Type:</span>
                          <span>{fuelType?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price per Liter:</span>
                          <span>${pricePerLiter.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Liters:</span>
                          <span>{liters || "0.00"}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total Amount:</span>
                          <span>${amount || "0.00"}</span>
                        </div>
                        <div className="flex justify-between text-blue-600 font-medium">
                          <span>Payment Method:</span>
                          <span>Credit Account</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                disabled={
                  !selectedCustomer ||
                  !selectedVehicle ||
                  !selectedDispenser ||
                  !selectedFuelType ||
                  !liters ||
                  !amount
                }
                onClick={processSale}
                className="flex items-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                Complete Sale
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sale Receipt</DialogTitle>
            <DialogDescription>
              Sale completed successfully. Receipt details below.
            </DialogDescription>
          </DialogHeader>

          {currentSale && (
            <div className="p-4 border rounded-lg space-y-3">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">Fuel Station Receipt</h3>
                <p className="text-sm text-gray-500">
                  {new Date(currentSale.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Receipt #{currentSale.id}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dispenser:</span>
                  <span>{currentSale.dispenser}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span>{currentSale.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Liters:</span>
                  <span>{currentSale.liters.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Liter:</span>
                  <span>${currentSale.pricePerLiter.toFixed(2)}</span>
                </div>

                {currentSale.customer && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span>{currentSale.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span>{currentSale.vehicle}</span>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>${currentSale.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="capitalize">
                    {currentSale.paymentMethod}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="text-center text-sm text-gray-500">
                <p>Thank you for your business!</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={resetForm}>
              New Sale
            </Button>
            <Button
              variant="secondary"
              onClick={() => setReceiptDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesInterface;
