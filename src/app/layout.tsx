import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { CookieConsent } from "@/components/CookieConsent";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DayEat",
  description: "Menus du jour autour de vous",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-16`}
      >
        <main className="min-h-screen bg-background">
          {children}
        </main>
        <BottomNav />
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast: 'bg-white border-yellow-300 shadow-lg text-slate-800',
              success: 'bg-yellow-50 border-yellow-300 text-yellow-900 font-medium',
              error: 'bg-red-50 border-red-200 text-red-900 font-medium',
              info: 'bg-slate-50 border-slate-200 text-slate-800'
            }
          }}
        />
        <CookieConsent />
      </body>
    </html>
  );
}
