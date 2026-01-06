"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { MoreHorizontal, Plus, Pencil, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// Define User type based on API response
interface User {
    id: string;
    name: string | null;
    email: string;
    role: "ADMIN" | "USER";
    createdAt: string;
}

const userFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email(),
    role: z.enum(["ADMIN", "USER"]),
    password: z.string().optional(),
});

// Wrapper for the form logic to separate it from the dialog state if possible, 
// but for simplicity we'll inline logic or use a sub-component pattern if it gets too large.

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "USER",
            password: "",
        },
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users");
            if (res.status === 403) {
                setError("Access Denied");
                return;
            }
            if (!res.ok) {
                throw new Error("Failed to fetch users");
            }
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (!isDialogOpen) {
            form.reset({
                name: "",
                email: "",
                role: "USER",
                password: "",
            });
            setEditingUser(null);
        } else if (editingUser) {
            form.reset({
                name: editingUser.name || "",
                email: editingUser.email,
                role: editingUser.role,
                password: "", // Password is blank on edit
            });
        }
    }, [isDialogOpen, editingUser, form]);


    const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
        setIsSubmitting(true);
        try {
            const method = editingUser ? "PUT" : "POST";
            const body = editingUser ? { ...values, id: editingUser.id } : values;

            const res = await fetch("/api/users", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            toast.success(editingUser ? "User updated successfully" : "User created successfully");
            setIsDialogOpen(false);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (user: User) => {
        if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

        try {
            const res = await fetch(`/api/users?id=${user.id}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }
            toast.success("User deleted");
            fetchUsers();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    User Management
                </h1>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>

            {/* Content */}
            <div className="rounded-xl border bg-background/50 backdrop-blur-sm shadow-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className={user.role === "ADMIN" ? "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20" : ""}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => { setEditingUser(user); setIsDialogOpen(true); }}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(user)} className="text-red-600 focus:text-red-600">
                                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
                        <DialogDescription>
                            {editingUser ? "Make changes to the user account here." : "Add a new user to the system."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password {editingUser && "(Leave blank to keep current)"}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="******" type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="USER">User</SelectItem>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingUser ? "Save Changes" : "Create User"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
