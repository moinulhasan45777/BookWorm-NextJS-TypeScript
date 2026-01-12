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
import { josefin } from "@/app/layout";
import Image from "next/image";
import loginImage from "@/assets/loginhero.png";
import Link from "next/link";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
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
                <FieldLabel htmlFor="name">Email</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Snow"
                  required
                  className="hover:ring-1"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="photo">Profile Picture</FieldLabel>
                <Input
                  id="photo"
                  type="file"
                  required
                  className="hover:ring-1"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="hover:ring-1"
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="hover:ring-1"
                />
              </Field>
              <Field>
                <Button type="submit" className="cursor-pointer">
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
        By clicking register, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
