import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AuthProvider from "./providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookWorm",
  description: "Your digital library for discovering and enjoying great books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.className} `}>
      <body className="bg-background">
        <main>
          <AuthProvider>{children}</AuthProvider>
        </main>
        <Toaster position="bottom-center" richColors></Toaster>
      </body>
    </html>
  );
}
