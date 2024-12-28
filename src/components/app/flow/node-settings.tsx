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

const More = ({ field, node, updateNodeData, getTypes, isInput }) => {
    const [isVisible, setIsVisible] = useState(field.isVisible ?? true);
    const [dataType, setDataType] = useState(field.type);

    const handleVisibilityChange = useCallback((e) => {
        setIsVisible(e.target.checked);
        updateNodeData({ ...field, isVisible: e.target.checked });
    }, [field, updateNodeData]);

    const handleTypeChange = useCallback((newType) => {
        setDataType(newType);
        updateNodeData({ ...field, type: newType });
    }, [field, updateNodeData]);

    return (
        <Card className="rounded-none border-0 bg-card py-4 px-1">
            <div className="text-sm font-medium mb-2">
                <label className="flex items-center">
                    <input
                        className="mr-2"
                        type="checkbox"
                        checked={isVisible}
                        onChange={handleVisibilityChange}
                        aria-label="Toggle field visibility"
                    />
                    Is visible
                </label>
            </div>
            <div className="text-sm font-medium mb-2">Data Type:</div>
            <Types
                type={dataType}
                getTypes={getTypes}
                onChange={handleTypeChange}
            />
            {isInput && (
                <>
                    <div className="text-sm font-medium my-2">Initial Value:</div>
                    <PolyInput
                        type={field.type}
                        name={field.name}
                        value={node.data[field.name] ?? ""}
                        onChange={(value) => updateNodeData({ [field.name]: value })}
                    />
                </>
            )}
        </Card>
    );
};

const Field = ({ field, isInput, node, selectedNode, updateNodeData, getTypes }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const handleChange = useChangeNodeData(selectedNode.id);

    const handleNameChange = useCallback((value) => {
        handleChange({ ...field, name: value });
    }, [field, handleChange]);

    return (
        <div>
            <div className="flex p-0 m-0 items-center">
                <button
                    className="bg-card flex items-center py-1.5 px-1 hover:bg-slate-100"
                    onClick={() => setIsExpanded(prev => !prev)}
                    aria-label={isExpanded ? "Collapse field details" : "Expand field details"}
                >
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                </button>
                <PolyInput
                    type="string"
                    name={field.name}
                    value={field.name}
                    onChange={handleNameChange}
                />
            </div>

            {isExpanded && (
                <More
                    field={field}
                    node={node}
                    updateNodeData={updateNodeData}
                    getTypes={getTypes}
                    isInput={isInput}
                />
            )}
        </div>
    );
};

const RenderNodeFields = ({ fields, type, node, selectedNode, updateNodeData, getTypes }) => (
    <>
        {fields.map((field, index) => (
            <div key={`${field.name}-${index}`} className="mb-2">
                <Field
                    field={field}
                    isInput={type === 'inputs'}
                    node={node}
                    selectedNode={selectedNode}
                    updateNodeData={updateNodeData}
                    getTypes={getTypes}
                />
            </div>
        ))}
    </>
);

const Section = ({ title, children }) => (
    <div className="mb-4">
        <div className="text-sm font-medium mb-2">{title}</div>
        {children}
    </div>
);

export const NodeSettings = ({ store }) => {
    const {
        getNode,
        getTypes,
        selectedNode,
        updateNodeData,
    } = store();

    if (!selectedNode?.id) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No node selected. Please select a node to configure its settings.
            </div>
        );
    }

    const node = getNode(selectedNode.id);
    if (!node) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Selected node could not be found. Please try again.
            </div>
        );
    }

    const handleLabelChange = useCallback((value) => {
        updateNodeData({ spec: { ...node.data.spec, label: value } });
    }, [node.data.spec, updateNodeData]);

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
                            onChange={handleLabelChange}
                        />
                    </Section>
                    <Section title="Inputs:">
                        <RenderNodeFields
                            node={node}
                            fields={node.data.spec.inputs}
                            type="inputs"
                            selectedNode={selectedNode}
                            updateNodeData={updateNodeData}
                            getTypes={getTypes}
                        />
                    </Section>
                    <Section title="Outputs:">
                        <RenderNodeFields
                            node={node}
                            fields={node.data.spec.outputs}
                            type="outputs"
                            selectedNode={selectedNode}
                            updateNodeData={updateNodeData}
                            getTypes={getTypes}
                        />
                    </Section>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

NodeSettings.displayName = 'NodeSettings';