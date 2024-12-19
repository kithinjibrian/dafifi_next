'use client'

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import {
    Button
} from "@/components/ui/button"

import { ArrowRight, Clock1, Hourglass, Rocket, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

export const HeroSection = () => {
    const { user } = useAuthStore();
    return (
        <div className="relative overflow-hidden bg-background">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background opacity-50 -z-10"></div>

            {/* Main Hero Container */}
            <div className="container mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-6">
                    <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                        <Hourglass className="inline-block mr-2 -mt-1" size={20} />
                        Powerful tools that save you time — so you can conquer the world.
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                        You're a creator.
                        <span className="block text-primary">Create.</span>
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-xl">
                        Create apps, automation workflows, and APIs in seconds with our powerful no-code tools — saving you time without sacrificing control or flexibility.
                    </p>

                    <div className="flex space-x-4">
                        <Link
                            href={user ? "/project" : "/user/signup"}>
                            <Button
                                size="lg"
                                aria-label="Start Creating"
                                className="bg-sky-500"
                            >
                                Start Creating
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="text-sky-500">
                            Learn More
                        </Button>
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center space-x-4 text-muted-foreground">
                        <Shield className="text-green-500" size={24} />
                        <span className="text-sm">
                            Trusted by 1000+ people worldwide, just like you.
                        </span>
                    </div>
                </div>

                {/* Right Content - Feature Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <Clock1 className="text-primary mb-4" size={36} />
                            <CardTitle>Rapid Collaboration</CardTitle>
                            <CardDescription>
                                Work together in real-time on projects.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow md:translate-y-12">
                        <CardHeader>
                            <Zap className="text-red-500 mb-4" size={36} />
                            <CardTitle>Power in your hands</CardTitle>
                            <CardDescription>
                                No-code tools that go the extra mile to deliver the power and flexibility of a programming language in a simple, user-friendly interface..
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow md:-translate-y-12 col-span-full md:col-span-2 lg:col-span-1">
                        <CardHeader>
                            <Rocket className="text-orange-500 mb-4" size={36} />
                            <CardTitle>Scalable Solutions</CardTitle>
                            <CardDescription>
                                All your database tables and webpages are hosted on our servers, allowing you to focus entirely on creating and automating.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    );
};
