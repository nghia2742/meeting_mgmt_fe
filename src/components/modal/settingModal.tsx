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
import { fetchUserProfile, updateUserProfile } from "@/lib/apiClient";
import AvatarSection from "./components/AvatarSection";
import UserProfileForm from "./components/UserProfileForm";

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
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const queryClient = useQueryClient();

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<UserProfile>({
        resolver: zodResolver(schema),
    });

    const { data: userData, isLoading, isError, error } = useQuery({
        queryKey: ['userProfile'],
        queryFn: fetchUserProfile,
    });

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const userData = await fetchUserProfile();
                setValue("fullName", userData.fullName);
                setValue("email", userData.email);
                if (userData.dateOfBirth) {
                    setValue("dateOfBirth", new Date(userData.dateOfBirth));
                    setDate(new Date(userData.dateOfBirth));
                }
                setValue("address", userData.address);
                setValue("gender", userData.gender);
                setValue("phoneNumber", userData.phoneNumber);
                setValue("provider", userData.provider);
                if (userData.avatar) {
                    // Assuming userData.avatar is a base64 string
                    setAvatarFile(null); // Reset to null because base64 string is not a File object
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        getUserProfile();
    }, []); // Removed userData and setValue from the dependency array

    const mutation = useMutation({
        mutationFn: (updatedUser: UserProfile) => updateUserProfile(updatedUser.email, updatedUser),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            onClose();
        }
    });

    const onSubmit: SubmitHandler<UserProfile> = async (data) => {
        if (date && date.getTime() !== new Date(userData.dateOfBirth).getTime()) {
            data.dateOfBirth = new Date(date.toISOString());
        }

        if (avatarFile) {
            try {
                const resizedImageBlob = await resizeImage(avatarFile);
                const base64String = await convertBlobToBase64(resizedImageBlob);

                mutation.mutate({
                    ...data,
                    avatar: base64String,
                });
            } catch (error) {
                console.error("Error resizing or compressing image:", error);
            }
        } else {
            mutation.mutate(data);
        }
    };

    const resizeImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error("Failed to resize image"));
                        }
                    }, file.type);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const convertBlobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading user data: {error.message}</div>;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                <DialogHeader className="flex justify-center items-center h-full">
                    <DialogTitle className="mb-2">Edit profile</DialogTitle>
                    <AvatarSection setAvatarFile={setAvatarFile} userData={userData} />
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
                />
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;
