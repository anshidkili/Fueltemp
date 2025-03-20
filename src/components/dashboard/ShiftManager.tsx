import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  Clock,
  PlayCircle,
  StopCircle,
  Clipboard,
  CheckCircle,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ShiftManagerProps {
  isShiftActive?: boolean;
  shiftStartTime?: string;
  shiftDuration?: string;
  initialMeterReading?: number;
  currentMeterReading?: number;
  onStartShift?: (initialReading: number) => void;
  onEndShift?: (finalReading: number) => void;
}

const ShiftManager = ({
  isShiftActive = false,
  shiftStartTime = "",
  shiftDuration = "00:00:00",
  initialMeterReading = 0,
  currentMeterReading = 0,
  onStartShift = () => {},
  onEndShift = () => {},
}: ShiftManagerProps) => {
  const [shiftStatus, setShiftStatus] = useState<boolean>(isShiftActive);
  const [meterReading, setMeterReading] = useState<number>(initialMeterReading);
  const [finalReading, setFinalReading] = useState<number>(currentMeterReading);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleStartShift = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setShiftStatus(true);
      onStartShift(meterReading);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleEndShift = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setShiftStatus(false);
      onEndShift(finalReading);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Shift Management</CardTitle>
            <CardDescription>
              Start or end your shift and record meter readings
            </CardDescription>
          </div>
          <Badge
            variant={shiftStatus ? "success" : "destructive"}
            className={`${shiftStatus ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} px-3 py-1 text-sm font-medium rounded-full`}
          >
            {shiftStatus ? "Active Shift" : "No Active Shift"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Shift Status Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <h3 className="text-sm font-medium">Shift Status</h3>
            </div>
            <div className="pl-7">
              {shiftStatus ? (
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Started at:</p>
                  <p className="font-medium">{shiftStartTime || "08:00 AM"}</p>
                  <p className="text-sm text-gray-500 mt-2">Duration:</p>
                  <p className="font-medium">{shiftDuration}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No active shift</p>
              )}
            </div>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          {/* Meter Readings Section */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Clipboard className="h-5 w-5 text-gray-500" />
              <h3 className="text-sm font-medium">Meter Readings</h3>
            </div>

            {!shiftStatus ? (
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <Label htmlFor="initialReading">Initial Meter Reading</Label>
                  <Input
                    id="initialReading"
                    type="number"
                    placeholder="Enter initial meter reading"
                    value={meterReading || ""}
                    onChange={(e) => setMeterReading(Number(e.target.value))}
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleStartShift}
                        disabled={isSubmitting || meterReading <= 0}
                        className="w-full md:w-auto"
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Shift
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start your shift and record initial meter reading</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <div className="space-y-4 pl-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Initial Reading</Label>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{meterReading}</p>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finalReading">Final Meter Reading</Label>
                    <Input
                      id="finalReading"
                      type="number"
                      placeholder="Enter final meter reading"
                      value={finalReading || ""}
                      onChange={(e) => setFinalReading(Number(e.target.value))}
                    />
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={handleEndShift}
                        disabled={isSubmitting || finalReading <= meterReading}
                        className="w-full md:w-auto"
                      >
                        <StopCircle className="mr-2 h-4 w-4" />
                        End Shift
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>End your shift and record final meter reading</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 text-sm text-gray-500 border-t">
        {shiftStatus
          ? "Remember to record the final meter reading before ending your shift"
          : "Start your shift by entering the initial meter reading"}
      </CardFooter>
    </Card>
  );
};

export default ShiftManager;
