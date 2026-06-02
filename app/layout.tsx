import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "NavkarOS — The Operating System for Indian Logistics",
  description:
    "One platform for every player in Indian logistics — C&F agents, freight forwarders, CHA, transporters, importers & exporters. Shipment ops, AI document extraction, GST billing, client portal, and full freight accounting.",
  openGraph: {
    title: "NavkarOS — The Operating System for Indian Logistics",
    description:
      "One platform. Every stakeholder. Total control over your logistics business.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
