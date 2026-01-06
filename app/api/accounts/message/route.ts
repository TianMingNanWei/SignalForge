import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth"; // Assuming you have auth setup
import { headers } from "next/headers";

const accountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    appKey: z.string().min(1, "App Key is required"),
    appSecret: z.string().min(1, "App Secret is required"),
    accessToken: z.string().min(1, "Access Token is required"),
});

export async function GET() {
    try {
        const accounts = await prisma.messageAccount.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(accounts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = accountSchema.parse(body);

        const account = await prisma.messageAccount.create({
            data: validated
        });

        return NextResponse.json(account);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        const validated = accountSchema.parse(data);

        const account = await prisma.messageAccount.update({
            where: { id },
            data: validated
        });

        return NextResponse.json(account);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        await prisma.messageAccount.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }
}
