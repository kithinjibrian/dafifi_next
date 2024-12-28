import { X } from "lucide-react";
import Image from "next/image";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";

import { useProjectStore } from "@/store/project";
import { FileDTO } from "@/store/file";
import { Welcome } from "./welcome";
import { RequestArea } from "./request/request-area";
import { CodeEditor } from "./code/code-area";
import { TableArea } from "./table/table-area";
import { FlowEditor } from "./flow/flow-area";
import { GuiEditor } from "./gui/gui-area";

const Open = ({ file }: { file: FileDTO }) => {
    if ('ext' in file) {
        switch (file.ext) {
            case 'wlc':
                return <Welcome file={file} />;
            case 'flw':
                return <FlowEditor file={file} />;
            case 'txt':
                return <CodeEditor file={file} />;
            case 'ui':
                return <GuiEditor file={file} />;
            case 'req':
                return <RequestArea file={file} />;
            case 'tab':
                return <TableArea file={file} />;
        }
    }
};


export const MainArea = () => {
    const { tabs, activeTab, setActiveTab, removeTab } = useProjectStore();

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full relative">
            <TabsList className="bg-background w-full justify-start relative border-b p-0 m-0">
                {tabs.map((tab, index) => (
                    <TabsTrigger
                        key={index}
                        value={tab.uuid}
                        className={`
                            ring-0
                            w-32
                            border-x
                            border-t-2
                            border-b-4
                            border-y-transparent
                            data-[state=active]:bg-card 
                            data-[state=active]:border-t-sky-500
                            data-[state=active]:shadow-none
                            relative group z-10`}>
                        {tab.name}
                        <X
                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeTab(tab.uuid)} />
                    </TabsTrigger>
                ))}
            </TabsList>
            {tabs.length > 0 ? tabs.map((tab, index) => (
                <TabsContent className="m-0 p-0 bg-card h-full" key={index} value={tab.uuid}>
                    {tab.ext && <Open file={tab} />}
                </TabsContent>
            )) : (
                <div className="h-full flex items-center justify-center">
                    <Image
                        src="/logo.svg"
                        alt="dafifi logo"
                        width={500}
                        height={500}
                    />
                </div>
            )}
        </Tabs>
    );
}