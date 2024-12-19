import React, { useState, memo, useCallback } from "react";
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card";

import { PolyInput } from "@/components/utils/poly-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Types } from "@/components/utils/type";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useChangeNodeData } from "@/hooks/useChangeNodeData";
import { Node, Socket } from "@/store/flow";

interface StoreProps {
    getNode: (id: string) => Node | undefined;
    getTypes: () => string[];
    selectedNode: { id: string; type: string } | null;
    updateVariable: (variableId: string, updates: { name: string }) => void;
}

export const NodeSettings: React.FC<{ store: () => StoreProps }> = ({ store }) => {
    const {
        getNode,
        getTypes,
        selectedNode,
        updateNodeData,
        updateVariable,
    } = store();

    // Improved error handling with more descriptive placeholder
    if (!selectedNode?.id) return (
        <div className="flex items-center justify-center h-full text-gray-500">
            No node selected. Please select a node to configure its settings.
        </div>
    );

    const node = getNode(selectedNode.id);
    if (!node) return (
        <div className="flex items-center justify-center h-full text-gray-500">
            Selected node could not be found. Please try again.
        </div>
    );

    const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
        <div className="mb-4">
            <div className="text-sm font-medium mb-2">{title}</div>
            {children}
        </div>
    );

    return (
        <Card className="border-0 bg-background h-full">
            <CardHeader>
                <CardTitle>Node {node.data.spec.label}</CardTitle>
                <CardDescription>Settings</CardDescription>
            </CardHeader>
            <CardContent className="h-full p-2">
                <ScrollArea className="h-4/5 pb-10">
                    <Section title="Label:">
                        <PolyInput
                            type="string"
                            name="label"
                            value={node.data.spec.label ?? ""}
                            onChange={() => { }}
                        />
                    </Section>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};