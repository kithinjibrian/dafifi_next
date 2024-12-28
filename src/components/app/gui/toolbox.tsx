import { Card, CardContent } from "@/components/ui/card";
import { useEditor, Element } from "@craftjs/core";
import { Layout, Type } from "lucide-react";

import { Text } from './components/text';
import { Container } from "./components/container";

export const Toolbox = () => {
    const { connectors } = useEditor();

    return (
        <Card className="w-48 rounded-none">
            <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Components</h2>
                <div className="space-y-3">
                    <div
                        ref={ref => connectors.create(ref, <Element is={Text} fontSize={16} />)}
                        className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-gray-100"
                    >
                        <Type size={16} />
                        <span>Text</span>
                    </div>

                    <div
                        ref={ref => connectors.create(ref, <Element is={Container} canvas />)}
                        className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-gray-100"
                    >
                        <Layout size={16} />
                        <span>Container</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};