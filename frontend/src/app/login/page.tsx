import { Metadata } from 'next';
import LoginForm from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login - MembrosTotal',
  description: 'Login to your MembrosTotal account',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col md:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col bg-black p-10 text-white lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="flex items-center">
            <span className="font-bold text-xl tracking-tight mr-2">NOHAU</span>
            <span className="text-md">MembrosTotal</span>
          </div>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Esta plataforma transformou a maneira como gerencio meus membros e conteúdo online."
            </p>
            <footer className="text-sm">João Silva</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="mx-auto flex w-full max-w-sm flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Faça seu login
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Entre com seu email e senha para acessar sua conta
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
