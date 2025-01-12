import { BugPlay, Pause, Play, Share2 } from "lucide-react";
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
import { LoadingButton } from "../utils/button";
import { useState } from "react";

export const Header = () => {
    const [isLoading, setIsLoading] = useState([false, false])
    const { project, updateProject } = useProjectStore();

    const setLoading = (index, value) => {
        const s = isLoading.map((bool, n) => n == index ? value : bool)
        setIsLoading(s);
    }

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
                {project?.state === "running" || project?.state === "queued" ? (
                    <LoadingButton
                        isLoading={isLoading[0]}
                        variant="ghost"
                        onClick={async () => {
                            setLoading(0, true)
                            try {
                                await updateProject({ state: "stopped" })
                            } finally {
                                setLoading(0, false)
                            }
                        }}
                    >
                        <Pause size={20} strokeWidth={1.5} />
                        <span>Pause</span>
                    </LoadingButton>
                ) : (
                    <Button
                        variant="ghost"
                        onClick={() => updateProject({ state: "queued" })}>
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
                    <Button disabled variant="ghost">
                        <BugPlay size={20} strokeWidth={1.5} />
                        <span>Debug</span>
                    </Button>
                )}
                <LoadingButton
                    disabled
                    isLoading={isLoading[1]}
                    variant="ghost"
                    onClick={() => { }}
                >
                    <Share2 size={20} strokeWidth={1.5} />
                    <span>Share</span>
                </LoadingButton>
                <ModeToggle />
            </div>
        </div>
    );
}
