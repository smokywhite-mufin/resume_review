import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import Providers from "./providers";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: "resume review",
  description: "resume review",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
