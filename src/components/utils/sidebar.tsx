import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"

import useResizeObserver from "use-resize-observer";
import { TooltipComponent } from "./tooltip";

export const SideBar: React.FC<any> = ({ items, tab, setActiveTab, ...props }) => {
    const { ref, width, height } = useResizeObserver<HTMLDivElement>();

    return (
        <div className="h-full" ref={ref}>
            <Tabs
                value={tab}
                onValueChange={setActiveTab}
                orientation="vertical"
                className="flex h-full w-full">
                <div className="flex-1">
                    {items.map((item, index) => (
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
                    {items.map((item, index) => (
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