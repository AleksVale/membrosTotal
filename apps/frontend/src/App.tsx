import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

function App() {
  return (
    <main>
      <h1>Membros Total</h1>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <p>Welcome! You are signed in.</p>
      </SignedIn>
    </main>
  );
}

export default App;

