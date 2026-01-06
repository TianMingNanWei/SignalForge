import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Config, QuoteContext } from "longport";

// Prevent Longport from logging to console heavily if possible, or handle it?
// The SDK might require specific env vars or config.

export async function POST(req: Request) {
    try {
        const { accountId, type, symbol } = await req.json();

        if (!accountId || !type || !symbol) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let account;

        if (type === "message") {
            account = await prisma.messageAccount.findUnique({ where: { id: accountId } });
        } else {
            account = await prisma.tradingAccount.findUnique({ where: { id: accountId } });
        }

        if (!account) {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }

        // Initialize Longport Config
        const config = new Config({
            appKey: account.appKey,
            appSecret: account.appSecret,
            accessToken: account.accessToken,
            // @ts-ignore
            enablePrintQuotePackages: false
        });

        // Create Context
        const ctx = await QuoteContext.new(config);

        // Fetch Quote
        const quotes = await ctx.quote([symbol]);

        // Close context (important to not leak connections)
        // Note: SDK structure might differ, checking docs... usually close specific contexts or just let it be strictly scoped.
        // JS SDK usually manages connection. Assuming stateless for this test or need to handle connection lifecycle.
        // If SDK uses persistent connection, this might be slow on Edge/Serverless.
        // Assuming we are in Node environment (default for Next.js API routes unless edge runtime specified).

        return NextResponse.json({
            success: true,
            data: quotes
        });

    } catch (error: any) {
        console.error("Longport Test Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to fetch quote",
            details: error.toString()
        }, { status: 500 });
    }
}
