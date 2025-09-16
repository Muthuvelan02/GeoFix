// src/fonts/libertinus-sans.ts
import localFont from "next/font/local";

export const libertinusSans = localFont({
  src: [
    {
      path: "../../public/fonts/libertinus-sans/LibertinusSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/libertinus-sans/LibertinusSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-libertinus-sans",
  display: "swap",
});
