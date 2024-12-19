'use client'

import { Search } from "lucide-react"

import {
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"

import { AppSidebar } from "@/components/project/app-sidebar"
import { Start } from "@/components/project/start"

import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import { useEffect, useState } from "react"
import { request, setupInterceptors } from "@/utils/request"
import { Recent } from "@/components/project/recent"
import { useAuthStore } from "@/store/auth"

setupInterceptors();

export default function ProjectHome() {
    const [projects, setProjects] = useState([]);
    const { user } = useProtectedRoute();
    const { isAuthenticated, refreshToken } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            refreshToken();
        }
    }, [isAuthenticated, refreshToken]);

    useEffect(() => {
        const fetch = async () => {
            const response = await request.get("project/all");
            setProjects(response.data);
        }
        fetch();
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="bg-card flex justify-between py-2">
                    <SidebarTrigger />
                    <div className="relative w-1/2">
                        <Input
                            className="pl-10 py-2 w-full bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search..."
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search />
                        </div>
                    </div>
                    <div></div>
                </div>
                <div className="mx-4 h-full">
                    <Start />
                    <Recent projects={projects} setProjects={setProjects} />
                </div>
            </main>
        </SidebarProvider>
    )
}