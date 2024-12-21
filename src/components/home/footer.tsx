import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";


const FooterLinks = [
    {
        title: 'Product',
        links: [
            { name: 'Features', href: '#features' },
            { name: 'Pricing', href: '#pricing' },
            { name: 'Integrations', href: '#integrations' },
            { name: 'Roadmap', href: '#roadmap' }
        ]
    },
    {
        title: 'Company',
        links: [
            { name: 'About', href: '/about' },
            { name: 'Careers', href: '/careers' },
            { name: 'Press', href: '/press' },
            { name: 'Blog', href: '/blog' }
        ]
    },
    {
        title: 'Resources',
        links: [
            { name: 'Documentation', href: '/docs' },
            { name: 'Guides', href: '/guides' },
            { name: 'Support', href: '/support' },
            { name: 'Status', href: '/status' }
        ]
    }
];

export const Footer = () => {
    return (
        <footer className="bg-background text-foreground border-t">
            <div className="container mx-auto px-4 py-16 space-y-16">
                {/* Top Section */}
                <div className="grid md:grid-cols-12 gap-8">
                    {/* Brand & Description */}
                    <div className="md:col-span-4">
                        <div className="flex items-center space-x-3 mb-4">
                            {/* Replace with your logo */}
                            <Image
                                src="/logo.svg"
                                alt="Dafifi logomark"
                                width={50}
                                height={50}
                            />
                            <span className="text-2xl font-bold">Dafifi</span>
                        </div>
                        <p className="text-muted-foreground">
                            Automate Now, Every Second Matters.
                        </p>
                    </div>

                    {/* Footer Links */}
                    <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {FooterLinks.map((section, idx) => (
                            <div key={idx}>
                                <h4 className="font-semibold mb-4 text-foreground">{section.title}</h4>
                                <ul className="space-y-2">
                                    {section.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <a
                                                href={link.href}
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section: Newsletter & Socials */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Newsletter Signup */}
                    <div>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-end space-x-4">
                        <Button variant="outline" size="icon">
                            <Github className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Linkedin className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Twitter className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-muted-foreground flex items-center justify-between border-t pt-8">
                    <div>Made with ❤️ in Kenya</div>
                    <div>
                        © {new Date().getFullYear()} Dafifi. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};