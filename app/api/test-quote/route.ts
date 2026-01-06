import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Config, QuoteContext } from "longport";
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { accountId, type, symbol, source = 'longbridge' } = body;

        if (!symbol) {
            return NextResponse.json({ error: "Missing symol" }, { status: 400 });
        }

        // Yahoo Finance Handler
        if (source === 'yahoo') {
            try {
                const quote = await yahooFinance.quote(symbol);
                return NextResponse.json({
                    success: true,
                    data: [quote], // Return as array to match Longbridge somewhat
                    source: 'yahoo'
                });
            } catch (error: any) {
                console.error("Yahoo Finance Error:", error);
                return NextResponse.json({
                    error: "Failed to fetch from Yahoo Finance",
                    details: error.message
                }, { status: 500 });
            }
        }

        // Longbridge Handler
        if (!accountId || !type) {
            return NextResponse.json({ error: "Missing required fields for Longbridge" }, { status: 400 });
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

        return NextResponse.json({
            success: true,
            data: quotes,
            source: 'longbridge'
        });

    } catch (error: any) {
        console.error("Test Quote Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to fetch quote",
            details: error.toString()
        }, { status: 500 });
    }
}
