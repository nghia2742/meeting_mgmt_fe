import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserProfile } from "@/types/userProfile.type";
import { uploadToCloudinary } from "@/lib/apiUser";
import AvatarSection from "../../../components/modal/components/AvatarSection";
import UserProfileForm from "../../../components/modal/components/UserProfileForm";

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile | null;
    onSave: (updatedUser: UserProfile) => void;
    loading: boolean;

}

const schema = z.object({
    fullName: z.string().nonempty("Full name is required").min(5, { message: "The fullname must be at least 5 characters" }),
    email: z.string().email("Invalid email format").nonempty("Email is required"),
    dateOfBirth: z.date().optional(),
});

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
    const [date, setDate] = useState<Date>();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<UserProfile>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (user) {
            setValue("fullName", user.fullName);
            setValue("email", user.email);
            if (user.dateOfBirth) {
                setValue("dateOfBirth", new Date(user.dateOfBirth));
                setDate(new Date(user.dateOfBirth));
            }
            setValue("address", user.address);
            setValue("gender", user.gender);
            setValue("phoneNumber", user.phoneNumber);
            setValue("provider", user.provider);
            if (user.avatar) {
                setAvatarFile(null);
            }
        }
    }, [user, setValue]);

    const onSubmit: SubmitHandler<UserProfile> = async (data) => {
        setLoading(true);
        try {
            if (date && user && date.getTime() !== new Date(user.dateOfBirth).getTime()) {
                data.dateOfBirth = new Date(date.toISOString());
            }

            if (avatarFile) {
                const avatarUrl = await uploadToCloudinary(avatarFile);
                data.avatar = avatarUrl;
            }

            onSave(data);
            onClose();
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                <DialogHeader className="flex justify-center items-center h-full">
                    <DialogTitle className="mb-2">Edit User Profile</DialogTitle>
                    {user && <AvatarSection setAvatarFile={setAvatarFile} userData={user} />}
                </DialogHeader>
                <UserProfileForm
                    onSubmit={handleSubmit(onSubmit)}
                    register={register}
                    control={control}
                    setValue={setValue}
                    errors={errors}
                    date={date}
                    setDate={setDate}
                    avatarFile={avatarFile}
                    onClose={onClose}
                />
               
            </DialogContent>
        </Dialog>
    );
};

export default EditUserModal;
