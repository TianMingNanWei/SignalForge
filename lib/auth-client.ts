import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000" // Make sure to handle production URL
})

export const { signIn, signUp, useSession } = authClient;
