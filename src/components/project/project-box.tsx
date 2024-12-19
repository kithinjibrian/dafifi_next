import { Box, EllipsisVertical, Pause, Play } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Card,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


export const ProjectBox = ({ project, onUpdate }) => {
    return (
        <Card
            key={project.id}
            className="w-52 h-52 hover:outline hover:outline-1">
            <a
                href={`/project/${project.id}`}>
                <CardContent className="flex h-32 items-center justify-center">
                    <Box className="h-16 w-16" />
                </CardContent>
            </a>
            <Separator />
            <CardFooter className="p-4 justify-between">
                <Button
                    variant={"ghost"}
                    size="icon"
                    onClick={() => {
                        onUpdate(
                            project.id,
                            {
                                state: project.state == "stopped" ? "running" : "stopped"
                            })
                    }}>
                    {project.state == "stopped" && <Play />}
                    {project.state == "running" && <Pause />}
                </Button>
                <div>
                    <p className="text-md font-bold">{project.name}</p>
                    <p className="text-xs">Opened 2hrs ago</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={"ghost"}
                            size="icon">
                            <EllipsisVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="bottom"
                        className="w-52"
                    >
                        <DropdownMenuItem
                            onClick={() => {
                                onUpdate(
                                    project.id,
                                    {
                                        pinned: !project.pinned
                                    }
                                )
                            }}>
                            <span>
                                {project.pinned ? "unpin" : "pin"}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span>Rename</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    )
}