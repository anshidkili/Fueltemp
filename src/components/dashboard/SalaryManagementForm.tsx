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
import { Calendar, DollarSign } from "lucide-react";

interface SalaryManagementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  employee?: any;
}

const SalaryManagementForm = ({
  isOpen,
  onClose,
  onSubmit,
  employee,
}: SalaryManagementFormProps) => {
  const [salaryAmount, setSalaryAmount] = useState(employee?.hourly_rate || "");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [paymentType, setPaymentType] = useState("hourly");
  const [hoursWorked, setHoursWorked] = useState("40");
  const [bonusAmount, setBonusAmount] = useState("0");
  const [notes, setNotes] = useState("");

  const calculateTotalPay = () => {
    const base =
      paymentType === "hourly"
        ? Number(salaryAmount) * Number(hoursWorked)
        : Number(salaryAmount);
    const bonus = Number(bonusAmount);
    return base + bonus;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      employee_id: employee?.id,
      employee_name: employee?.profiles?.full_name,
      salary_amount: Number(salaryAmount),
      payment_date: paymentDate,
      payment_type: paymentType,
      hours_worked: paymentType === "hourly" ? Number(hoursWorked) : null,
      bonus_amount: Number(bonusAmount),
      total_amount: calculateTotalPay(),
      notes: notes || null,
    };

    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Manage Salary Payment</DialogTitle>
          <DialogDescription>
            Process salary payment for{" "}
            {employee?.profiles?.full_name || "employee"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment-type" className="text-right">
              Payment Type
            </Label>
            <Select value={paymentType} onValueChange={setPaymentType}>
              <SelectTrigger id="payment-type" className="col-span-3">
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="salary">Fixed Salary</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="salary-amount" className="text-right">
              {paymentType === "hourly" ? "Hourly Rate" : "Salary Amount"}
            </Label>
            <div className="relative col-span-3">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="salary-amount"
                type="number"
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(e.target.value)}
                className="pl-10"
                placeholder={
                  paymentType === "hourly"
                    ? "Enter hourly rate"
                    : "Enter salary amount"
                }
                required
              />
            </div>
          </div>

          {paymentType === "hourly" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hours-worked" className="text-right">
                Hours Worked
              </Label>
              <Input
                id="hours-worked"
                type="number"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                className="col-span-3"
                placeholder="Enter hours worked"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bonus-amount" className="text-right">
              Bonus Amount
            </Label>
            <div className="relative col-span-3">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="bonus-amount"
                type="number"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
                className="pl-10"
                placeholder="Enter bonus amount (if any)"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment-date" className="text-right">
              Payment Date
            </Label>
            <div className="relative col-span-3">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="pl-10"
              />
            </div>
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
            <div className="text-right col-span-2 font-medium">
              Total Payment:
            </div>
            <div className="col-span-2 font-bold text-xl">
              ${calculateTotalPay().toFixed(2)}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Process Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SalaryManagementForm;
