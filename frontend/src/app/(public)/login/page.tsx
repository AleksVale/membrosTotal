import { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login - MembrosTotal",
  description: "Login to your MembrosTotal account",
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "linear-gradient(135deg, #E04D01 0%, #0C1742 100%)",
        backgroundImage: "url(/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex min-h-screen flex-col md:grid lg:grid-cols-2 min-w-full">
        <div className="relative h-full flex-col lg:flex items-center justify-center">
          <div className="relative z-20 flex flex-col items-center p-10">
            <Image
              priority
              src="/logo.png"
              alt="NOHAU Logo"
              width={700}
              height={700}
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="bg-background/90 backdrop-blur-sm mx-auto flex w-full max-w-md flex-col justify-center px-8 py-12 rounded-xl shadow-lg border border-gray-200/30">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Faça seu login
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Entre com seu email e senha para acessar sua conta
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
