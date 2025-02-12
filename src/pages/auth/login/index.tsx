import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ClipLoader from "react-spinners/ClipLoader";
import useLogin from "@/hooks/useLogin";
import Head from "next/head";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function LoginPage() {
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { watch, control, handleSubmit } = form;

  const handleLoginError = (error: any) => {
    setLoginError(error.response.data.message);
  };

  const {
    mutate: handleLogin,
    isPending: isLoggingIn,
    isError: isLoginError,
  } = useLogin(handleLoginError);

  useEffect(() => {
    const subscription = watch(() => {
      if (loginError) {
        setLoginError(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, loginError]);

  function onSubmit(values: z.infer<typeof loginSchema>) {
    handleLogin(values);
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className='w-full lg:grid lg:grid-cols-2 lg:min-h-screen'>
        <div className='hidden bg-[#94d0fd8c] lg:block p-20 relative'>
          <Link href='/' className='absolute top-0 left-0 m-2'>
            <Image
              src='/images/logoCLT.png'
              alt='Image'
              width={0}
              height={0}
              priority
            />
          </Link>
          <Image
            src='/images/loginImage.png'
            alt='Image'
            width='1080'
            height='1080'
            className='dark:brightness-[0.2] dark:grayscale'
            priority
          />
        </div>
        <div className='flex items-center justify-center py-12'>
          <div className='mx-auto grid w-[350px] gap-6'>
            <div className='grid gap-2 text-center'>
              <h1 className='text-2xl font-bold'>Cyberlogitec</h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email below to login to your account
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
                <FormField
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='grid gap-2 mb-2'>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Enter your email'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='grid gap-2 mb-2'>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Enter your password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isLoginError && loginError && (
                  <p className='text-destructive'>{loginError}</p>
                )}
                <Button className='w-full' type='submit' disabled={isLoggingIn}>
                  {isLoggingIn && (
                    <ClipLoader className='mr-2' color='#36d7b7' size={20} />
                  )}
                  Submit
                </Button>
              </form>
            </Form>
            <Separator className='my-2 px-2' />
            <Button variant='outline' disabled={isLoggingIn}>
              <GoogleIcon className='mr-2 h-4 w-4' />
              Login with Google
            </Button>
            {/* <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="#" className="underline">
                Sign up
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
