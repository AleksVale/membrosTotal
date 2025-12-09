import { createAuthClient } from "better-auth/react";
// Actually, better-auth v1 often infers from the type passed as generic.
// The error says "Type Auth<...> has no properties in common with BetterAuthClientOptions". 
// This means createAuthClient<TYPE>(options) is not the correct usage or TYPE is wrong.

// Let's try to see if we can import the Client type inferer.
// Standard usage: 
// import { auth } from "./auth"
// const authClient = createAuthClient({ ... }) -> usually doesn't infer server plugins/schema automatically unless using a specific pattern.

// Attempt 2: check if we should pass the auth instance as a separate argument or property? No, it's usually type-only.
// Let's try importing the specific type helper if it exists, or just use `typeof auth` correctly.
// The error suggests `typeof auth` is NOT matching `BetterAuthClientOptions` which suggests the generic is expected to be the OPTIONS interface, not the auth instance type.
// Wait, usually it is `createAuthClient<typeof auth>`.
// Let's try to cast or use the `infer` helper if available. 
// Re-reading docs (simulated): It acts as `createAuthClient<typeof auth>`. 
// Maybe I need to export the type explicitly from auth.ts?

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
}); 

// If inference fails, we can extend the Session type manually.
// import { InferSession, InferUser } from "better-auth";
// type Session = InferSession<typeof auth>;
// type User = InferUser<typeof auth>;

// But we want authClient.useSession() to return the correct user type.
// Let's try the recommended "plugins" approach if that's how we get fields.
// Actually, for "additionalFields", it should flow through.
