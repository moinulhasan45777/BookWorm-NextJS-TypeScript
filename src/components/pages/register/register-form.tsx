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
import { RegistrationForm } from "@/types/registrationForm";
import "dotenv/config";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { setToken } from "@/lib/token";
import { useAuth } from "@/hooks/useAuth";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // States
  const [loading, setLoading] = useState<boolean>(false);

  const { setUserData } = useAuth();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationForm>();

  const handleRegistration: SubmitHandler<RegistrationForm> = async (data) => {
    setLoading(true);
    // Upload Image
    const profileImage = data.photo[0];
    const formData = new FormData();
    formData.append("image", profileImage);

    const image_API_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${process.env.NEXT_PUBLIC_IMAGE_API}`;
    const res = await axios.post(image_API_URL, formData);

    const photo = res.data.data.display_url;

    const newUser = {
      name: data.name,
      photo: photo,
      email: data.email,
      password: data.password,
      role: "Normal",
      joiningDate: new Date().toISOString().split("T")[0],
    };

    await axios
      .post("/api/register", newUser)
      .then((registrationRes) => {
        toast.success("Registration Successful!");
        setUserData({
          name: newUser.name,
          email: newUser.email,
          photo: newUser.photo,
          role: newUser.role,
          joiningDate: new Date(newUser.joiningDate),
        });
        setToken(registrationRes.data.token);

        window.location.href = "/reader/home";
      })
      .catch((err) => {
        toast.error(
          "Status: " + err.response?.status + ".  " + err.response?.data?.error
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
            onSubmit={handleSubmit(handleRegistration)}
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
                  Create a new BookWorm account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Snow"
                  className="hover:ring-1"
                  {...register("name", { required: true })}
                />
                {errors.name?.type === "required" && (
                  <p className="text-red-500 text-sm">
                    Please enter your name.
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="photo">Profile Picture</FieldLabel>
                <Input
                  id="photo"
                  type="file"
                  className="hover:ring-1"
                  {...register("photo", { required: true })}
                />
                {errors.photo?.type === "required" && (
                  <p className="text-red-500 text-sm">
                    Please upload a profile picture.
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
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
                  {...register("password", {
                    required: true,
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
                  })}
                />
                {errors.password?.type === "required" && (
                  <p className="text-red-500 text-sm">
                    Password cannot be empty!
                  </p>
                )}
                {errors.password?.type === "pattern" && (
                  <p className="text-red-500 text-sm">
                    Password must contain at least one uppercase, one lowercase,
                    one number and one special character.
                  </p>
                )}
              </Field>
              <Field>
                <Button
                  disabled={loading}
                  type="submit"
                  className="cursor-pointer"
                >
                  Register
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <Link href="/">Login</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={loginImage}
              alt="Image"
              priority
              placeholder="blur"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking Register, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
