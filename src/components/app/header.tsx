import { BugPlay, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Menubar,
    MenubarItem,
    MenubarMenu,
    MenubarContent,
    MenubarTrigger,
    MenubarSeparator
} from "@/components/ui/menubar"

import { useProjectStore } from "@/store/project";
import { ModeToggle } from "../utils/mode-toggle";
import Link from "next/link";

export const Header = () => {
    const { project, updateProject } = useProjectStore();

    return (
        <div className="flex w-full border h-[40px]">
            <div className="flex-1">
                <Menubar className="border-0">
                    <MenubarMenu>
                        <MenubarTrigger>File</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <a href="/project">
                                    Home
                                </a>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>
                                New Flow File
                            </MenubarItem>
                            <MenubarItem>
                                New Script File
                            </MenubarItem>
                            <MenubarItem>
                                New UI File
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>Import File</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
            <div className="ml-auto flex items-center space-x-2">
                {project?.state === "running" ? (
                    <Button
                        variant="ghost"
                        onClick={() => updateProject({ state: "stopped" })}>
                        <Pause size={20} strokeWidth={1.5} />
                        <span>Pause</span>
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        onClick={() => updateProject({ state: "running" })}>
                        <Play size={20} strokeWidth={1.5} />
                        <span>Run</span>
                    </Button>
                )}
                {project?.state === "debugging" ? (
                    <Button variant="ghost">
                        <Pause size={20} strokeWidth={1.5} />
                        <span>Pause</span>
                    </Button>
                ) : (
                    <Button variant="ghost">
                        <BugPlay size={20} strokeWidth={1.5} />
                        <span>Debug</span>
                    </Button>
                )}
                <ModeToggle />
            </div>
        </div>
    );
}