import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Lock, Mail, UserCheck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { createUser } from "@/hooks/useUser";

const CreateUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  fullName: z.string().min(4, { message: "Full Name is required" }),
});

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateUserSchema>) => {
    setLoading(true);
    try {
      await createUser(values.email, values.password, values.fullName);
      toast({
        variant: "success",
        title: "Success",
        description: "User created successfully.",
        duration: 1000,
      });
      form.reset();
      onClose();
      onUserCreated();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user.",
        duration: 1000,
      });
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    form.clearErrors();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Create User</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2 mb-2">
                  <FormLabel>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2 mb-2">
                  <FormLabel>
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Password
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="grid gap-2 mb-2">
                  <FormLabel>
                    <div className="flex items-center">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Full Name
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="mr-2"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <ClipLoader size={20} color={"#fff"} /> : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateUserModal;
