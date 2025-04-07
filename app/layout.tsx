import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased p-10`}
      >
        <div className="flex flex-nowrap justify-center items-center mx-auto mb-6 mt-5 p-3 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <Link href="/" className="bg-amber-500 mr-2 py-3 px-7 rounded-md">
            View
          </Link>
          <Link href="/create" className="bg-green-500 py-3 px-7 rounded-md">
            Create
          </Link>
        </div>

        {children}
      </body>
    </html>
  );
}
