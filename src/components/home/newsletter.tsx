"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

export const NewsletterSignup = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return;
        }

        setIsLoading(true);

        try {
            const response: { success: boolean } = await new Promise((resolve) =>
                setTimeout(() => resolve({ success: true }), 1500)
            );

            if (response.success) {
                setEmail('');
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                    Subscribe to the Dafifi newsletter
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Get the latest updates, insights, and exclusive content delivered straight to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 sm:flex sm:items-center">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full sm:max-w-xs"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Subscribing...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Subscribe
                            </>
                        )}
                    </Button>
                </form>

                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </div>
        </div>
    );
};