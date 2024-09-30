import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles/globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import { Navbar } from "./_components/Navbar/Navbar";
import { Providers } from "./_components/Providers";
import { Footer } from "./_components/Footer";
import { Toaster } from "sonner";
// import bgImage from "@/public/concrete-bg.jpg";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "relative h-full font-sans antialiased",
          // "bg-contain bg-[url(/concrete-bg.jpg)]",
          geistSans,
          geistMono,
        )}
      >
        <main className="relative flex min-h-screen flex-col">
          <Providers>
            <Navbar />
            <div className="flex-1 flex-grow">{children}</div>
            <Footer />
          </Providers>
        </main>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
