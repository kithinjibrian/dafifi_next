import React from "react";
import Image from "next/image";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { cn } from "@/lib/utils";
import Link from "next/link";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Flow Builder",
        href: "/docs/flows/flow-builder",
        description:
            "Design and customize flows visually with our intuitive drag-and-drop builder.",
    },
    {
        title: "Triggers",
        href: "/docs/flows/triggers",
        description:
            "Set up event-based triggers to start your flows automatically.",
    },
    {
        title: "Actions",
        href: "/docs/flows/actions",
        description:
            "Define the steps and actions that make up your flow logic.",
    },
    {
        title: "Conditions",
        href: "/docs/flows/conditions",
        description: "Create conditional logic to add decision points in your flows.",
    },
    {
        title: "Loops",
        href: "/docs/flows/loops",
        description:
            "Repeat actions multiple times with loops, perfect for batch processing.",
    },
    {
        title: "Integrations",
        href: "/docs/flows/integrations",
        description:
            "Connect to external services and APIs to extend your flow capabilities.",
    },
]

export const NavigationBar = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <Image
                                            src="/logo.svg"
                                            alt="Dafifi logomark"
                                            width={50}
                                            height={50}
                                        />
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            Dafifi
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Build, automate, and launch flows with our no-code visual builder.
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/docs" title="Introduction">
                                Learn the basics of creating and managing your flows.
                            </ListItem>
                            <ListItem href="/docs/primitives/typography" title="Flow Concepts">
                                Key concepts and principles for designing effective flows.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Flow Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Documentation
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}


const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"