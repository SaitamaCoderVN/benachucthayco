import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '600', '700'],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11",
  description: "Thiệp chúc mừng ngày nhà giáo 20/11",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
