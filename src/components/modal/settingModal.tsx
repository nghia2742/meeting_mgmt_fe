import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserProfile } from "@/types/userProfile.type";
import { fetchUserProfile, updateUserProfile, uploadToCloudinary } from "@/lib/apiUser";
import AvatarSection from "./components/AvatarSection";
import UserProfileForm from "./components/UserProfileForm";
import useUserStore from "@/hooks/useUserStore";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const schema = z.object({
    fullName: z.string().nonempty("Full name is required"),
    email: z.string().email("Invalid email format").nonempty("Email is required"),
    phoneNumber: z.string().nonempty("Phone number is required"),
    address: z.string().nonempty("Address is required"),
    gender: z.enum(['male', 'female', 'other'], { errorMap: () => ({ message: 'Invalid gender' }) }),
    dateOfBirth: z.date().optional(),
});

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [date, setDate] = useState<Date>();

    const queryClient = useQueryClient();

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<UserProfile>({
        resolver: zodResolver(schema),
    });

    const { userProfile, isLoading, isError, error, fetchUserProfile, avatarFile, setAvatarFile } = useUserStore();


    useEffect(() => {
        if (!userProfile) {
            fetchUserProfile();
        } else {
            setValue("fullName", userProfile.fullName);
            setValue("email", userProfile.email);
            if (userProfile.dateOfBirth) {
                setValue("dateOfBirth", new Date(userProfile.dateOfBirth));
                setDate(new Date(userProfile.dateOfBirth));
            }
            setValue("address", userProfile.address);
            setValue("gender", userProfile.gender);
            setValue("phoneNumber", userProfile.phoneNumber);
            setValue("provider", userProfile.provider);
            setValue("avatar", userProfile.avatar);
        }
    }, [userProfile, setValue]);

    const mutation = useMutation({
        mutationFn: (updatedUser: UserProfile) => updateUserProfile(updatedUser.email, updatedUser),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            onClose();
        }
    });

    const onSubmit: SubmitHandler<UserProfile> = async (data) => {
        if (date && date.getTime() !== new Date(userProfile.dateOfBirth).getTime()) {
            data.dateOfBirth = new Date(date.toISOString());
        }

        if (avatarFile) {
            try {
                const avatarUrl = await uploadToCloudinary(avatarFile);
                mutation.mutate({
                    ...data,
                    avatar: avatarUrl,
                });
            } catch (error) {
                console.error("Error uploading image to Cloudinary:", error);
            }
        } else {
            mutation.mutate(data);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading user data: {error}</div>;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                <DialogHeader className="flex justify-center items-center h-full">
                    <DialogTitle className="mb-2">Edit profile</DialogTitle>
                    {userProfile && (
                        <AvatarSection setAvatarFile={setAvatarFile} userData={userProfile} />
                    )}
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

export default SettingsModal;
