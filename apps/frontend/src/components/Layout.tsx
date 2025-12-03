import { Outlet, Link, useLocation } from 'react-router-dom';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Membros Total
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant={location.pathname === '/' ? 'default' : 'ghost'}
              >
                Home
              </Button>
            </Link>
            <SignedIn>
              <Link to="/dashboard">
                <Button
                  variant={
                    location.pathname === '/dashboard' ? 'default' : 'ghost'
                  }
                >
                  Dashboard
                </Button>
              </Link>
              <UserButton />
            </SignedIn>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Membros Total. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

