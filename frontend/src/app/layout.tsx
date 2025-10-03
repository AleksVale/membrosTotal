import ClientSideToastContainer from "@/components/client-toast-container";
import ReactQueryProvider from "@/components/query";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Colaborador Nohau - Sistema de Gerenciamento",
  description: "Sistema de gerenciamento para colaboradores Nohau",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="colaborador-nohau-theme"
          >
            <ReactQueryProvider>{children}</ReactQueryProvider>
            <ClientSideToastContainer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
