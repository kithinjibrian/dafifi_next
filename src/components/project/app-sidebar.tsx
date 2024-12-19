'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { useAuthStore } from "@/store/auth";
import { Calendar, ChevronUp, Inbox, Search, Settings } from "lucide-react";
import Link from "next/link";

const items = [
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

export const AppSidebar = () => {
    const { user, logout } = useAuthStore();
    return (
        <Sidebar>
            <SidebarHeader>
                <Link href="/" className="flex items-center">
                    <Avatar
                        className="h-16 w-16">
                        <AvatarImage
                            src="/logo.svg"
                            style={{
                                width: "60px"
                            }} />
                        <AvatarFallback
                            className="bg-white text-black">
                            DA
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                        <h1 className="text-lg font-bold">Dafifi </h1>
                        <p className="text-sm italic">v1.0.4 Amethyst</p>
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    className="h-12">
                                    <Avatar>
                                        <AvatarImage src="" />
                                        <AvatarFallback
                                            className="bg-orange-600">
                                            {user?.username && (
                                                (
                                                    user.username.charAt(0)
                                                    + user.username.charAt(user.username.length - 1)
                                                ).toUpperCase()
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h1 className="text-lg">{user?.username}</h1>
                                        <p className="text-xs">{user?.email}</p>
                                    </div>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <Separator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        logout();
                                    }}>
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar >
    )
}