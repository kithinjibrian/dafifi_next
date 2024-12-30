import {
    Tabs,
    TabsList,
    TabsContent,
    TabsTrigger,
} from "@/components/ui/tabs";

export const TabView = ({ tabs, defaultValue, extraProps = {} }) => (
    <Tabs defaultValue={defaultValue} className="h-full">
        <TabsList className="bg-card border-b w-full justify-start">
            {tabs.map((tab) => (
                <TabsTrigger
                    key={tab.name}
                    value={tab.name}
                    className={`
                            border-b-2
                            border-y-transparent
                            data-[state=active]:bg-card 
                            data-[state=active]:border-b-sky-500
                            data-[state=active]:shadow-none
                            relative group z-10`}
                >
                    {tab.name}
                </TabsTrigger>
            ))}
        </TabsList>
        {tabs.map((tab) => (
            <TabsContent
                key={tab.name}
                value={tab.name}
                className="h-full"
            >
                {tab.content(extraProps)}
            </TabsContent>
        ))}
    </Tabs>
);