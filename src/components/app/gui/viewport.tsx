import { useEditor } from "@craftjs/core";
import { Toolbox } from "./toolbox";
import { Topbar } from "./topbar";
import { useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Blocks, Layers2, LayoutGrid, Settings2 } from "lucide-react";
import { SideBar } from "@/components/utils/sidebar";
import { Settings } from "./settings";
import { Layers } from "./layer";

const navItems = [
    { value: 'Components', icon: Blocks, content: () => { } },
    { value: 'Node Settings', icon: Settings2, content: Settings },
    { value: 'Layers', icon: Layers2, content: Layers },
    { value: 'Add Templates', icon: LayoutGrid, content: Toolbox },
]

export const Viewport: React.FC<{ children?: React.ReactNode, file: any }> = ({
    children,
    file
}) => {

    const { tab, setActiveTab } = file.store();

    const {
        enabled,
        connectors,
        actions: { setOptions },
    } = useEditor((state) => ({
        enabled: state.options.enabled,
    }));


    useEffect(() => {
        if (!window) {
            return;
        }

        window.requestAnimationFrame(() => {
            // Notify doc site
            window.parent.postMessage(
                {
                    LANDING_PAGE_LOADED: true,
                },
                '*'
            );

            setTimeout(() => {
                setOptions((options) => {
                    options.enabled = true;
                });
            }, 200);
        });
    }, [setOptions]);

    return (
        <ResizablePanelGroup
            direction="horizontal"
            style={{ height: '85%' }}
        >
            <ResizablePanel
                defaultSize={73}
                className="h-full"
            >
                <div className="border page-container flex flex-1 h-full flex-col">
                    <Topbar file={file} />
                    <div
                        className="craftjs-renderer flex-1 h-full w-full transition pb-8 overflow-auto"
                        ref={(ref) => connectors.select(connectors.hover(ref as HTMLElement, ''), '')}
                    >
                        <div
                            className="relative flex-col flex items-center pt-8 justify-center"
                            style={{ maxWidth: '800px', margin: 'auto' }}
                        >
                            {children}
                        </div>
                        <div className={'flex items-center justify-center w-full pt-6 text-xs text-gray-400'}>
                            Powered by Dafifi
                        </div>
                    </div>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={27}>
                <SideBar
                    tab={tab}
                    items={navItems}
                    setActiveTab={setActiveTab}
                    store={file.store}
                />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}