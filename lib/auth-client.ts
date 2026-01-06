import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    // baseURL: "http://localhost:3000" // Commented out to allow relative path usage (default behavior)
    // Or we can use process.env.NEXT_PUBLIC_APP_URL if defined, but empty defaults to standard /api/auth relative to origin.
})

export const { signIn, signUp, useSession } = authClient;
