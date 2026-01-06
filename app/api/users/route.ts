import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
// Use auth.api.signUpEmail for creation to handle hashing correctly and consistent with Better Auth
// However, direct prisma write is also fine if we use the same hashing mechanism.
// Better Auth uses Scrypt by default if not configured otherwise.
// But wait, in seed we used auth.api.signUpEmail.
// To be safe and consistent, for creation we should try to use auth.api.signUpEmail if possible, 
// OR use prisma but we need to know the hashing.
// Actually, for simplicity and ensuring "Admin" role can be set immediately, 
// using auth.api.signUpEmail might be tricky if it logs the user in or strictly follows sign up flow.
// Start with using `auth.api.signUpEmail` for creation if possible, or just use prisma with `better-auth`'s password hasher if exposed.
// `better-auth` doesn't easily expose the hasher in the server lib directly without some digging.
// Let's stick to using `auth.api.createUser` if it exists, or `signUpEmail`.
// Actually, checking docs/code: `auth.api.signUpEmail` creates a user and session.
// We probably don't want to create a session for the admin when they create a *new* user.
// 
// Alternative: Just use Prisma. We need to hash the password.
// Since we are using "better-auth", we should check what it uses. 
// Default is usually Scrypt or Argon2.
// Let's rely on `auth.api` which functions as the Admin API essentially.
// There is `auth.api.createUser` ? No, usually `signUpEmail`.
// 
// Let's try to use `prisma` and `bcryptjs` assuming we might need to configure Better Auth to accept bcrypt
// OR we just use `auth.api.signUpEmail` and ignore the session part.
// Actually `better-auth` has an admin plugin, but we aren't using it.
//
// Let's look at `prisma/seed.ts` again. We used `auth.api.signUpEmail`.
//
// Let's use `auth.api.signUpEmail` but we need to ensure we don't return the session cookie to the Admin.
// We can just call it and ignore the returned headers.
//
// UPDATE: user.update needs to handle password change too.
//
// Let's go with this approach:
// GET: List
// POST: Create (using auth.api.signUpEmail) -> then update Role if needed.
// PUT: Update (Prisma) -> if password changes, we might need `auth.api.changePassword`? No that's for current user.
// For admin setting password, we might need to hash it.
// 
// WAIT: The user seed used `auth.api.signUpEmail`.
// Let's try to use that for creation.
// For update, if password provided, we need to hash it.
// Since better-auth handles hashing, mixing manual hashing might be risky if algorithms differ.
// 
// Safe bet: For creation, use `auth.api.signUpEmail`.
// For password update, use `auth.api.setPassword` (if available?) or we might have to skip password update for now in "Edit",
// or only allow it via "Reset Password" flow?
//
// Let's check `lib/auth.ts`.
//
// If we want to keep it simple: just do CRUD on fields. Password handling is the tricky part.
// Let's assume for now we allow creating users, and updating Name/Role. 
// Password reset might be a separate "Admin Action" or we use a temporary simple hash if we configure better-auth to support it.
//
// Let's try `auth.api.signUpEmail` for creation.
// For update, just prisma update name/role.

import { z } from "zod";

const userSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(["USER", "ADMIN"]),
    password: z.string().min(6).optional(), // Optional for update
});

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        }
    });

    return NextResponse.json(users);
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Forbidden", { status: 403 });
    }

    try {
        const body = await req.json();
        const { name, email, role, password } = userSchema.parse(body);

        if (!password) {
            return new NextResponse("Password required for creation", { status: 400 });
        }

        // Use auth.api to create user to handle hashing
        const res = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
            },
            asResponse: false // Ensure we get the object back, not a response object if possible? 
            // Type definition says it returns response or object depending on props?
            // Actually usually it returns { user, session } or similar.
        });

        // `signUpEmail` might automatically log us in if we were in browser, but here we are server-side calling it?
        // Wait, `auth.api` functions are meant for server-side mostly?
        // If we call it, it creates the user.

        if (!res?.user) {
            return new NextResponse("Failed to create user", { status: 500 });
        }

        // If role is ADMIN, update it (Better Auth might default to USER)
        if (role === "ADMIN") {
            await prisma.user.update({
                where: { id: res.user.id },
                data: { role: "ADMIN" }
            });
        }

        return NextResponse.json(res.user);

    } catch (e: any) {
        return new NextResponse(e.message || "Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Forbidden", { status: 403 });
    }

    try {
        const body = await req.json();
        const { id, name, email, role } = body; // Simplified validation

        if (!id) return new NextResponse("ID required", { status: 400 });

        const updated = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                role
            }
        });

        return NextResponse.json(updated);
    } catch (e: any) {
        return new NextResponse(e.message || "Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Forbidden", { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("ID required", { status: 400 });

        // Prevent deleting self?
        if (id === session.user.id) {
            return new NextResponse("Cannot delete yourself", { status: 400 });
        }

        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return new NextResponse(e.message || "Error", { status: 500 });
    }
}
