import type { Metadata } from "next";
import { Asap } from "next/font/google";
import "./styles/globals.css";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ThemeProvider } from "./components/themeProvider";
import { QueryProvider } from "@/lib/providers/queryProvider";
import { PageTracker } from "./components/PageTracker";

const asap = Asap({
  variable: "--font-asap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aeromagasia",
  description: "A magazine dedicated to aerospace &amp; defence industry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${asap.className} antialiased`}>
        <PageTracker />
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
