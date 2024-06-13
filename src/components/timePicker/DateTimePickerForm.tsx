"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "./TimePicker";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
    dateTime: z.date(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function DateTimePickerForm({
    time, title, onChangeDate }: { time?: Date, title: string, onChangeDate: (date: Date | undefined) => void }) {
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dateTime: time,
        }
    });

    return (
        <Form {...form}>
            <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel className="text-left">{title}</FormLabel>
                        <Popover>
                            <FormControl className="w-full">
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                            format(field.value, "PPP HH:mm:ss")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                            </FormControl>
                            <PopoverContent className="w-full p-0">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                        console.log("Calendar date selected:", date);
                                        field.onChange(date);
                                        onChangeDate(date);
                                    }}
                                    initialFocus
                                />
                                <div className="p-3 border-t border-border">
                                    <TimePicker
                                        setDate={(date) => {
                                            console.log("TimePicker date selected:", date);
                                            field.onChange(date);
                                            onChangeDate(date);
                                        }}
                                        date={new Date(field.value)}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </FormItem>
                )}
            />
        </Form>
    );
}
