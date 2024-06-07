import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { UserProfile } from "@/types/userProfile.type";
import { fetchUserProfile } from "@/lib/apiClient";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [date, setDate] = useState<Date>();
    const [image, setImage] = useState("https://github.com/shadcn.png");
    const handleChangeImage = (newImage: React.SetStateAction<string>) => {
        setImage(newImage);
    };

    const { register, handleSubmit,control, setValue, formState: { errors } } = useForm<UserProfile>();

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const userData = await fetchUserProfile();
                console.log(userData);
                setValue("fullName", userData.fullName);
                setValue("email", userData.email);
                setValue("dateOfBirth", new Date(userData.dateOfBirth));
                setValue("address", userData.address);
                setValue("gender", userData.gender);
                setValue("phoneNumber", userData.phoneNumber);
                setImage(userData.avatar);
                setDate(new Date(userData.dateOfBirth));
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        getUserProfile();
    }, [setValue]);

    const gender = useWatch({
        control,
        name: "gender",
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                <DialogHeader className="flex justify-center items-center h-full">
                    <DialogTitle className="mb-2">Edit profile</DialogTitle>
                    <Popover>
                        <PopoverTrigger>
                            <Avatar className="h-[200px] w-[200px] cursor-pointer">
                                <AvatarImage src={image} className="rounded-full" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent>
                            <button onClick={() => handleChangeImage("new_image_url")}>Change Image</button>
                        </PopoverContent>
                    </Popover>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fullName" className="text-right">
                            FullName
                        </Label>
                        <Input
                            id="fullName"
                            {...register("fullName")}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input
                            id="password"
                            placeholder="**************"
                            className="col-span-3"
                            type="password"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            {...register("email")}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            {...register("phoneNumber")}
                            className="col-span-3"
                        />
                    </div>
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
                                            {gender && gender.charAt(0).toUpperCase() + gender.slice(1)}
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                            Address
                        </Label>
                        <Input
                            id="address"
                            {...register("address")}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;
