"use client";
import ScrollToTop from "@/components/common/ScrollTop";
import QueryProvider from "@/components/providers/QueryProvider";
import Aos from "aos";
// Original theme styles (Bootstrap + all custom CSS/SCSS)
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "aos/dist/aos.css";
import "../../public/scss/main.scss";
import "rc-slider/assets/index.css";
// Tailwind CSS
import "./globals.css";
import { DM_Sans, Poppins } from "next/font/google";
import { useEffect } from "react";

// DM_Sans font
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--body-font-family",
});

// Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--title-font-family",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap");
    }
  }, []);
  useEffect(() => {
    Aos.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <html lang="en">
      <body
        className={`body ${poppins.variable} ${dmSans.variable}`}
        cz-shortcut-listen="false"
      >
        <QueryProvider>
          <div className="wrapper ovh">{children}</div>
          <ScrollToTop />
        </QueryProvider>
      </body>
    </html>
  );
}
