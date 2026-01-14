"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { josefin } from "@/fonts/fonts";
import Image from "next/image";
import loginImage from "@/assets/loginhero.png";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginForm as LoginFormType } from "@/types/loginForm";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { setToken } from "@/lib/token";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState<boolean>(false);
  const { setUserData } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  const handleLogin: SubmitHandler<LoginFormType> = async (data) => {
    setLoading(true);

    await axios
      .post("/api/login", data)
      .then((loginRes) => {
        toast.success("Login Successful!");
        setUserData({
          name: loginRes.data.user.name,
          email: loginRes.data.user.email,
          photo: loginRes.data.user.photo,
          role: loginRes.data.user.role,
          joiningDate: new Date(loginRes.data.user.joiningDate),
        });
        setToken(loginRes.data.token);

        const redirectUrl =
          loginRes.data.user.role === "Admin"
            ? "/admin/overview"
            : "/reader/home";
        window.location.href = redirectUrl;
      })
      .catch((err) => {
        toast.error(
          "Status: " + err.response?.status + ". " + err.response?.data?.error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="p-6 md:p-8"
            noValidate
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className={`text-2xl font-bold ${josefin.className}`}>
                  Welcome to BookWorm
                </h1>
                <p
                  className={`text-muted-foreground text-balance ${josefin.className}`}
                >
                  Login to your BookWorm account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="hover:ring-1"
                  {...register("email", { required: true })}
                />
                {errors.email?.type === "required" && (
                  <p className="text-red-500 text-sm">
                    Please enter your email.
                  </p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="hover:ring-1"
                  {...register("password", { required: true })}
                />
                {errors.password?.type === "required" && (
                  <p className="text-red-500 text-sm">
                    Password cannot be empty!
                  </p>
                )}
              </Field>
              <Field>
                <Button
                  disabled={loading}
                  type="submit"
                  className="cursor-pointer"
                >
                  Login
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link href="/register">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={loginImage}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking Login, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
