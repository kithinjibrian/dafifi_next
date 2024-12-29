import { useEditor } from "@craftjs/core";
import { Toolbox } from "./toolbox";
import { Topbar } from "./topbar";
import { useEffect } from "react";

export const Viewport: React.FC<{ children?: React.ReactNode, file: any }> = ({
    children,
    file
}) => {

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
        <div className="viewport">
            <div className="h-full w-full">
                <Topbar file={file} />
                <div className="page-container flex h-full w-full">
                    <div
                        className={'craftjs-renderer flex-1 h-full w-full transition p-4 overflow-auto'}
                        ref={(ref) => connectors.select(connectors.hover(ref, null), null)}
                    >
                        <div className="relative flex-col flex items-center">
                            {children}
                        </div>
                    </div>
                    <Toolbox />
                </div>
            </div>
        </div>
    );
}