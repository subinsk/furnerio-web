import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootLayout from "@/layouts/root-layout";
import Script from "next/script";
import { API_URL } from "@/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Furnerio",
  description: "Furnerio",
};

async function getCategories() {
  if (!API_URL) return [];

  const res = await fetch(`${API_URL}/category`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="en">
      <head>
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
        />
      </head>
      <body className={inter.className}>
        <RootLayout categories={categories.categories}>{children}</RootLayout>
      </body>
    </html>
  );
}
