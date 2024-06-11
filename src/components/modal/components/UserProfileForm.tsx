import React, { Dispatch, FormEvent, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { UserProfile } from "@/types/userProfile.type";
import GenderSelect from "./GenderSelect";
import DateOfBirthPicker from "./DateOfBirthPicker";
import { DialogFooter } from "@/components/ui/dialog";

interface UserProfileFormProps {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    register: UseFormRegister<UserProfile>;
    control: Control<UserProfile>;
    setValue: (name: keyof UserProfile, value: any) => void;
    errors: FieldErrors<UserProfile>;
    date: Date | undefined;
    setDate: Dispatch<SetStateAction<Date | undefined>>;
    avatarFile: File | null;
    onClose: () => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit, register, control, setValue, errors, date, setDate, avatarFile, onClose }) => {
    
    return (
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                    Full Name
                </Label>
                <Input
                    id="fullName"
                    {...register("fullName", { required: "Full name is required" })}
                    className="col-span-3"
                />
                {errors.fullName && <p className="col-span-3 col-start-2 text-red-500">{errors.fullName.message}</p>}
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
                    {...register("email", { required: "Email is required" })}
                    className="col-span-3"
                />
                {errors.email && <p className="col-span-3 col-start-2 text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                    Phone
                </Label>
                <Input
                    id="phone"
                    {...register("phoneNumber", { required: "Phone number is required" })}
                    className="col-span-3"
                />
                {errors.phoneNumber && <p className="col-span-3 col-start-2 text-red-500">{errors.phoneNumber.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="provider" className="text-right">
                    Provider
                </Label>
                <Input
                    id="provider"
                    {...register("provider")}
                    className="col-span-3"
                />
            </div>
            <GenderSelect control={control} error={errors.gender?.message} />
            <DateOfBirthPicker date={date} setDate={setDate} error={errors.dateOfBirth?.message}/>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                    Address
                </Label>
                <Input
                    id="address"
                    {...register("address", { required: "Address is required" })}
                    className="col-span-3"
                />
                {errors.address && <p className="col-span-3 col-start-2 text-red-500">{errors.address.message}</p>}
            </div>
            <DialogFooter>
                <Button type="submit">Save changes</Button>
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            </DialogFooter>
        </form>
    );
};

export default UserProfileForm;
