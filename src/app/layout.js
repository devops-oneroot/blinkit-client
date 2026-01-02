import { Inter } from "next/font/google";
import "./globals.css"; // <--- THIS is the magic line that loads your colors!

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blinkit Logistics",
  description: "Inbound Entry Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}