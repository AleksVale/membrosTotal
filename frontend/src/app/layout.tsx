import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientSideToastContainer from "@/components/client-toast-container";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MembrosTotal - Sistema de Gerenciamento",
  description: "Sistema de gerenciamento para o negócio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <ClientSideToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
