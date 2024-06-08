import React from "react";
import { Controller, Control } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface GenderSelectProps {
    control: Control<any>;
}

const GenderSelect: React.FC<GenderSelectProps> = ({ control }) => {
    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
                Gender
            </Label>
            <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select gender">
                                {field.value && field.value.charAt(0).toUpperCase() + field.value.slice(1)}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    );
};

export default GenderSelect;
