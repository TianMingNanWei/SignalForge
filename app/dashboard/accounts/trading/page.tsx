"use client"

import { useState, useEffect } from "react";
import { TechCard } from "@/components/tech-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Activity } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

const accountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    appKey: z.string().min(1, "App Key is required"),
    appSecret: z.string().min(1, "App Secret is required"),
    accessToken: z.string().min(1, "Access Token is required"),
});

interface Account {
    id: string;
    name: string;
    appKey: string;
    createdAt: string;
}

export default function TradingAccountsPage() {
    // Similar implementation to MessageAccountsPage but pointing to /api/accounts/trading
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isTestOpen, setIsTestOpen] = useState(false);
    const [source, setSource] = useState<"longbridge" | "yahoo">("longbridge");
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [testSymbol, setTestSymbol] = useState("700.HK");
    const [testResult, setTestResult] = useState<string | null>(null);
    const [testing, setTesting] = useState(false);

    const form = useForm<z.infer<typeof accountSchema>>({
        resolver: zodResolver(accountSchema),
        defaultValues: { name: "", appKey: "", appSecret: "", accessToken: "" },
    });

    const fetchAccounts = async () => {
        try {
            const res = await fetch("/api/accounts/trading");
            if (res.ok) setAccounts(await res.json());
        } catch (error) { toast.error("Failed to fetch accounts"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAccounts(); }, []);

    const onSubmit = async (values: z.infer<typeof accountSchema>) => {
        try {
            const res = await fetch("/api/accounts/trading", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (res.ok) {
                toast.success("Trading Account created");
                setIsAddOpen(false);
                form.reset();
                fetchAccounts();
            } else {
                toast.error("Failed to create account");
            }
        } catch (error) { toast.error("An error occurred"); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this trading account?")) return;
        try {
            await fetch(`/api/accounts/trading?id=${id}`, { method: "DELETE" });
            fetchAccounts();
            toast.success("Account deleted");
        } catch { toast.error("Delete failed"); }
    };

    const runTestQuote = async () => {
        if (source === "longbridge" && !selectedAccount) return;
        setTesting(true);
        setTestResult(null);
        try {
            const body: any = {
                type: "trading",
                symbol: testSymbol,
                source
            };
            if (source === "longbridge" && selectedAccount) {
                body.accountId = selectedAccount.id;
            }

            const res = await fetch("/api/test-quote", {
                method: "POST",
                body: JSON.stringify(body),
            });
            setTestResult(JSON.stringify(await res.json(), null, 2));
        } catch { setTestResult("Error"); }
        finally { setTesting(false); }
    };

    const openTestDialog = (account: Account | null = null) => {
        setSelectedAccount(account);
        setSource(account ? "longbridge" : "yahoo");
        setIsTestOpen(true);
        setTestResult(null);
    };

    if (loading) return <div className="p-6"><Skeleton className="h-[200px] w-full" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                        Trading Accounts
                    </h2>
                    <p className="text-muted-foreground">Manage Longbridge trading API accounts.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => openTestDialog(null)}>
                        <Activity className="mr-2 h-4 w-4" /> Test Quote
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild><Button className="bg-orange-600 hover:bg-orange-700"><Plus className="mr-2 h-4 w-4" /> Add Account</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Add Trading Account</DialogTitle><DialogDescription>Enter trading credentials.</DialogDescription></DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="appKey" render={({ field }) => (<FormItem><FormLabel>App Key</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="appSecret" render={({ field }) => (<FormItem><FormLabel>App Secret</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="accessToken" render={({ field }) => (<FormItem><FormLabel>Access Token</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <Button type="submit" className="w-full">Save Account</Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                    <TechCard key={account.id}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold">{account.name}</h3>
                                <p className="text-xs text-muted-foreground font-mono mt-1">{account.appKey.substring(0, 8)}...</p>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => openTestDialog(account)}>
                                    <Activity className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(account.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Created: {new Date(account.createdAt).toLocaleDateString()}</div>
                    </TechCard>
                ))}
            </div>

            <Dialog open={isTestOpen} onOpenChange={setIsTestOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Test Trading Connection</DialogTitle><DialogDescription>Verify account with a quote.</DialogDescription></DialogHeader>
                    <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <Label>Source</Label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="source"
                                        value="longbridge"
                                        checked={source === "longbridge"}
                                        onChange={() => setSource("longbridge")}
                                        className="accent-orange-500"
                                    />
                                    <span>Longbridge (Account Required)</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="source"
                                        value="yahoo"
                                        checked={source === "yahoo"}
                                        onChange={() => setSource("yahoo")}
                                        className="accent-purple-500"
                                    />
                                    <span>Yahoo Finance (Free)</span>
                                </label>
                            </div>
                        </div>

                        {source === "longbridge" && (
                            <div className="text-sm">
                                <span className="text-muted-foreground">Account: </span>
                                <span className="font-bold">{selectedAccount ? selectedAccount.name : <span className="text-red-500">None Selected</span>}</span>
                            </div>
                        )}

                        <div className="flex space-x-2">
                            <Input value={testSymbol} onChange={(e) => setTestSymbol(e.target.value)} placeholder="Symbol" />
                            <Button onClick={runTestQuote} disabled={testing || (source === 'longbridge' && !selectedAccount)}>{testing ? "..." : "Test"}</Button>
                        </div>
                        {testResult && <pre className="bg-black/50 p-4 rounded text-xs font-mono overflow-auto max-h-[300px]">{testResult}</pre>}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
