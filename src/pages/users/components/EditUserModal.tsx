import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserProfile } from "@/types/userProfile.type";
import { uploadToCloudinary } from "@/lib/apiUser";
import AvatarSection from "../../../components/modal/components/AvatarSection";
import UserProfileForm from "../../../components/modal/components/UserProfileForm";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onSave: (updatedUser: UserProfile) => void;
}

const schema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  phoneNumber: z.string()
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || val.length > 5, {
      message: "Phone number must be more than 5 characters if provided",
    }),
  address: z.string()
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || val.length > 5, {
      message: "Address must be more than 5 characters if provided",
    }),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Invalid gender" }),
  }).optional().nullable(),
  dateOfBirth: z.date().optional().nullable(),
});


const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [date, setDate] = useState<Date>();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<UserProfile>({
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
    if (
      date &&
      user &&
      date.getTime() !== new Date(user.dateOfBirth).getTime()
    ) {
      data.dateOfBirth = new Date(date.toISOString());
    }

    if (avatarFile) {
      try {
        const avatarUrl = await uploadToCloudinary(avatarFile);
        data.avatar = avatarUrl;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      }
    }

    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="flex justify-center items-center h-full">
          <DialogTitle className="mb-2">Edit User Profile</DialogTitle>
          {user && (
            <AvatarSection setAvatarFile={setAvatarFile} userData={user} />
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

export default EditUserModal;
