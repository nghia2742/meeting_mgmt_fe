import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

interface DateOfBirthPickerProps {
    date: Date | undefined;
    setDate: (date: Date) => void;
}

const DateOfBirthPicker: React.FC<DateOfBirthPickerProps> = ({ date, setDate }) => {
    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateOfBirth" className="text-right">
                Date of Birth
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        fromYear={1920}
                        toYear={2004}
                        captionLayout="dropdown-buttons"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DateOfBirthPicker;
