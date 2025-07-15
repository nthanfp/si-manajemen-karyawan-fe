"use client";

import { Label, TextInput, Button, Card, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Login gagal.");
            }

            const data = await res.json();
            document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan saat login.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
                    Masuk ke Sistem
                </h2>

                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <TextInput
                            id="username"
                            placeholder="johndoe"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <TextInput
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner size="sm" className="mr-2" /> Loading...
                            </>
                        ) : (
                            "Masuk"
                        )}
                    </Button>
                </form>
            </Card>
        </div>
    );
}