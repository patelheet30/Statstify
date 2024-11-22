import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Statstify",
  description: "Re-discover your music preferences",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h=full">
      <body className={`${jakartaSans.className} h-full`}>
        <div className="h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
