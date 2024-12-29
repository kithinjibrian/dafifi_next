import { Card, CardContent } from "@/components/ui/card";
import { useEditor, Element } from "@craftjs/core";
import { Layout, Type } from "lucide-react";

import { Text } from './components/text';
import { Container } from "./components/container";
import { ButtonComponent } from "./components/button";

export const Toolbox = () => {
    const { connectors } = useEditor();

    return (
        <Card className="w-48 rounded-none">
            <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Components</h2>
                <div className="space-y-3">
                    <div
                        ref={ref => connectors.create(ref, <Element is={Text} fontSize={16} />)}
                        className="flex items-center gap-2 p-2 border rounded cursor-move"
                    >
                        <Type size={16} />
                        <span>Text</span>
                    </div>

                    <div
                        ref={ref => connectors.create(ref, <Element is={ButtonComponent}>Button</Element>)}
                        className="flex items-center gap-2 p-2 border rounded cursor-move"
                    >
                        <Type size={16} />
                        <span>Button</span>
                    </div>

                    <div
                        ref={ref => connectors.create(ref,
                            <Element
                                canvas
                                is={Container}
                                height="100%"
                                width="100%"
                            />)}
                        className="flex items-center gap-2 p-2 border rounded cursor-move"
                    >
                        <Layout size={16} />
                        <span>Container</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};