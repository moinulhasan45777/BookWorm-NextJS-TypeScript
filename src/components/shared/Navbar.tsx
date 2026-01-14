"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { IconMenu2, IconX, IconLogout } from "@tabler/icons-react";
import { josefin } from "@/fonts/fonts";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const authContext = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await authContext?.logout();
          Swal.fire({
            title: "Logged Out!",
            text: "You have been successfully logged out.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      }
    });
  };

  const navLinks = [
    { href: "/reader/home", label: "Home" },
    { href: "/reader/browse-books", label: "Browse Books" },
    { href: "/reader/my-library", label: "My Library" },
    { href: "/reader/tutorials", label: "Tutorials" },
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/reader/home"
            className={`text-2xl font-bold ${josefin.className}`}
          >
            BookWorm
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-foreground hover:text-primary transition-colors font-medium",
                  pathname === link.href && "border-b-2 border-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <IconLogout className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-muted"
          >
            {isOpen ? (
              <IconX className="h-6 w-6" />
            ) : (
              <IconMenu2 className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base hover:bg-muted transition-colors",
                  pathname === link.href && "border-b-2 border-primary"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base hover:bg-muted transition-colors flex items-center gap-2 cursor-pointer"
            >
              <IconLogout className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
