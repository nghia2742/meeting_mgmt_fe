import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserProfile } from "@/types/userProfile.type";
import AvatarSection from "../userProfile/AvatarSection";
import UserProfileForm from "../userProfile/UserProfileForm";
import useUserStore from "@/stores/userStore";
import { toast } from "../ui/use-toast";
import { Inter } from "next/font/google";
import { updateUserProfile, uploadToCloudinary } from "@/hooks/useUser";
import { USER_RESPONSE_MESSAGE } from "@/lib/constants/RequestMessage";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inter = Inter({ subsets: ["latin"] });

const schema = z.object({
  fullName: z
    .string()
    .min(5, { message: "Full name is too short" })
    .max(50, { message: "Full name is too long" })
    .nonempty("Full name is required"),
  email: z
    .string()
    .min(10, { message: "Email is too short" })
    .max(50, { message: "Email is too long" })
    .email("Invalid email format")
    .nonempty("Email is required"),
  phoneNumber: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || /^(\+84|0)\d{9}$/.test(val), {
      message: "Invalid phone number format",
    }),
  address: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || /^[a-zA-Z0-9\s\,\-\.]+$/.test(val), {
      message:
        "Invalid address format (letters, numbers, spaces, commas, hyphens, and periods allowed)",
    })
    .nullable(),
  gender: z.enum(["male", "female", "other"]).nullable(),
  dateOfBirth: z.date().optional().nullable(),
});

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<UserProfile>({
    resolver: zodResolver(schema),
  });

  const { userProfile, fetchUserProfile, avatarFile, setAvatarFile } =
    useUserStore((state) => ({
      userProfile: state.userProfile,
      fetchUserProfile: state.fetchUserProfile,
      avatarFile: state.avatarFile,
      setAvatarFile: state.setAvatarFile,
    }));

  useEffect(() => {
    if (isOpen && !userProfile) {
      fetchUserProfile();
    }
  }, [isOpen, fetchUserProfile, userProfile]);

  useEffect(() => {
    if (userProfile) {
      setValue("fullName", userProfile.fullName);
      setValue("email", userProfile.email);
      if (userProfile.dateOfBirth) {
        setValue("dateOfBirth", new Date(userProfile.dateOfBirth));
        setDate(new Date(userProfile.dateOfBirth));
      }
      setValue("address", userProfile.address);
      setValue("gender", userProfile.gender);
      setValue("phoneNumber", userProfile.phoneNumber);
    }
  }, [userProfile, setValue]);

  useEffect(() => {
    if (!isOpen) {
      clearErrors();
    }
  }, [isOpen, clearErrors]);

  const mutation = useMutation({
    mutationFn: (updatedUser: UserProfile) =>
      updateUserProfile(updatedUser.email, updatedUser),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      useUserStore.setState({ userProfile: data });
      onClose();
      setLoading(false);
    },
  });

  const onSubmit: SubmitHandler<UserProfile> = async (data) => {
    setLoading(true);
    try {
      if (
        date &&
        date.getTime() !== new Date(userProfile?.dateOfBirth || "").getTime()
      ) {
        data.dateOfBirth = new Date(date.toISOString());
      }

      if (avatarFile) {
        const avatarUrl = await uploadToCloudinary(avatarFile);
        mutation.mutate({
          ...data,
          avatar: avatarUrl,
        });
      } else {
        mutation.mutate(data);
        toast({
          variant: "success",
          title: "Success",
          description: USER_RESPONSE_MESSAGE.EDIT.SUCCESS,
          duration: 1000,
        });
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    clearErrors();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[425px] overflow-y-auto max-h-[90vh] ${inter.className}`}
      >
        <DialogHeader className="flex justify-center items-center h-full">
          <DialogTitle className="mb-2">Edit profile</DialogTitle>
          {userProfile && (
            <AvatarSection
              setAvatarFile={setAvatarFile}
              userData={userProfile}
            />
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
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
