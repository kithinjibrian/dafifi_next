import { Workflow, Variable, Settings2, LayoutPanelTop } from 'lucide-react';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"

import { NodeTree } from './node-tree'
import { VariableTab } from './variables-tab';
import useResizeObserver from 'use-resize-observer';
import { NodeSettings } from './node-settings';
import { StructTab } from './struct-tab';
import { TooltipComponent } from '@/components/utils/tooltip';


const navItems = [
    { value: 'Add Nodes', icon: Workflow, content: NodeTree },
    { value: 'Create variables', icon: Variable, content: VariableTab },
    { value: 'Create structs', icon: LayoutPanelTop, content: StructTab },
    { value: 'Node settings', icon: Settings2, content: NodeSettings },
]

export const NodeBar: React.FC<any> = (props) => {
    const { ref, width, height } = useResizeObserver<HTMLDivElement>();
    const { tab, setActiveTab } = props.store();
    return (
        <div className="h-full" ref={ref}>
            <Tabs
                value={tab}
                onValueChange={setActiveTab}
                orientation="vertical"
                className="flex h-full w-full">
                <div className="flex-1">
                    {navItems.map((item, index) => (
                        <TabsContent
                            className="m-0 p-0 h-full"
                            value={item.value}
                            key={index}>
                            {item.content && <item.content {...props} />}
                        </TabsContent>
                    ))}
                </div>
                <TabsList
                    style={{ height: height }}
                    className="m-0 p-0 flex flex-col justify-start bg-background border-x">
                    {navItems.map((item, index) => (
                        <TabsTrigger
                            value={item.value}
                            key={index}
                            className="border-r-4 border-r-transparent data-[state=active]:border-r-sky-500 data-[state=active]:shadow-none">
                            <TooltipComponent
                                side="left"
                                description={item.value}>
                                {<item.icon size={30} strokeWidth={1} />}
                            </TooltipComponent>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}