import { File, GitBranch, Blocks, Users, Table, Bot, ArrowDownUp } from 'lucide-react';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"

import { FileExplorer } from './file-explorer';
import { Client } from './client';
import { Schemas } from './schema';
import { AiTab } from './ai';


const navItems = [
    { value: 'Files', icon: File, content: FileExplorer },
    { value: 'Schemas', icon: Table, content: Schemas },
    { value: 'Endpoints', icon: ArrowDownUp, content: Client },
    { value: 'AiTab', icon: Bot, content: AiTab },
    { value: 'Branches', icon: GitBranch, content: () => <h1>Version control</h1> },
    { value: 'Users', icon: Users, content: () => <h1>Users collaborating on this project</h1> },
    { value: 'Commits', icon: Blocks, content: () => <h1>Apps store</h1> },
]

export const NavBar = () => {
    return (
        <div>
            <Tabs
                orientation='vertical'
                defaultValue="Files"
                className="flex h-[calc(100vh-65px)] w-full">
                <TabsList
                    className="m-0 p-0 flex flex-col justify-start bg-background border-x h-full">
                    {navItems.map((item, index) => (
                        <TabsTrigger
                            value={item.value}
                            key={index}
                            className="border-l-4 border-l-transparent data-[state=active]:border-l-sky-500 data-[state=active]:shadow-none">
                            {<item.icon size={30} strokeWidth={1} />}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <div className="flex-1">
                    {navItems.map((item, index) => (
                        <TabsContent
                            className="m-0 p-0 h-full"
                            value={item.value}
                            key={index}>
                            {item.content && <item.content />}
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
}