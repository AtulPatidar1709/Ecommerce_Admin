import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "react-hot-toast";
import ClientLayout from "@/app/components/ClientLayout"; // Import the client component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* Render the client-side component */}
          <ClientLayout>{children}</ClientLayout>
          <Toaster position="bottom-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
