import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Membros Total</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your membership management platform
        </p>
      </div>

      <SignedOut>
        <div className="flex flex-col items-center gap-4">
          <SignInButton>
            <Button size="lg">Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">You are signed in!</p>
          <Link to="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </SignedIn>
    </div>
  );
}

