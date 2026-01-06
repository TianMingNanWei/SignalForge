import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateProfileSchema = z.object({
    name: z.string().min(2),
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
});

export async function PUT(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { name } = updateProfileSchema.parse(body);

        const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: { name },
        });

        return NextResponse.json(updated);
    } catch (e: any) {
        return new NextResponse(e.message || "Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { currentPassword, newPassword } = changePasswordSchema.parse(body);

        // We use auth.api.changePassword provided by Better Auth
        // Usage: auth.api.changePassword({ body: { currentPassword, newPassword, revokeOtherSessions: true } })
        // Note: verify exact signature or fallback to manual if tricky.

        const res = await auth.api.changePassword({
            body: {
                currentPassword,
                newPassword,
                revokeOtherSessions: true // Security best practice
            },
            headers: await headers() // Pass headers for session context
        });

        if (!res) {
            return new NextResponse("Failed to change password", { status: 400 });
        }

        return NextResponse.json({ success: true });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error(e);
        return new NextResponse(e.body?.message || e.message || "Error changing password", { status: 500 });
    }
}
