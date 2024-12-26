import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    FlowState,
    Socket,
    Variable as TVariable,
    Type
} from "@/store/flow";
import { StoreApi, UseBoundStore } from "zustand";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    ArrowDownToLine,
    Plus,
    Settings2,
    Trash,
    Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Combobox } from "@/components/utils/combobox";
import { PolyInput } from "@/components/utils/poly-input";
import { useErrorStore } from "@/store/errors";
import { validateStruct } from "@/utils/validate";
import { createDefault, getDefaultValue } from "@/utils/default";

type VariableProps = {
    store: UseBoundStore<StoreApi<FlowState>>;
    variable: TVariable;
    onSelectNode: (node: any) => void;
};

// Utility functions for node specification creation
export const createGetNodeSpec = (variable: TVariable) => ({
    label: variable.name,
    own_spec: true,
    category: "Variable",
    collapse: true,
    inputs: [],
    outputs: [{
        name: "value",
        type: variable.type
    }],
});

export const createSetNodeSpec = (variable: TVariable) => ({
    label: variable.name,
    own_spec: true,
    category: "Variable",
    collapse: true,
    inputs: [
        {
            name: "flow",
            type: {
                tag: "TCon",
                tcon: {
                    name: "flow",
                    types: []
                }
            }
        },
        {
            name: "value",
            type: variable.type
        },
    ],
    outputs: [{
        name: "flow",
        type: {
            tag: "TCon",
            tcon: {
                name: "flow",
                types: []
            }
        }
    }],
});

export const Variable: React.FC<VariableProps> = ({
    store,
    variable,
    onSelectNode
}) => {
    const { log_error } = useErrorStore();
    const {
        nodes,
        updateNodeData,
        updateVariable,
        getTypes,
        structs
    } = store();

    // Initial state derivation
    const [selectedType, setSelectedType] = useState(() =>
        variable.type.tag === "TCon"
            ? variable.type.tcon.types[0]?.tag === "TCon"
                ? variable.type.tcon.types[0].tcon.name
                : variable.type.tcon.name
            : null
    );

    const [selectedContainer, setSelectedContainer] = useState(() =>
        variable.type.tag === "TCon"
            ? variable.type.tcon.types.length > 0
                ? variable.type.tcon.name
                : "single"
            : "single"
    );

    const [isHovered, setIsHovered] = useState(false);
    const [menu, setMenu] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const setDefaultValue = (type) => {
        const isPrimitive = ["string", "boolean", "integer", "float"].includes(type.tcon.name);
        if (isPrimitive) {
            return getDefaultValue(type.tcon.name);
        } else {
            const elemType = type.tcon.types[0];
            if (type.tcon.name == "array" || type.tcon.name == "map") {
                return setDefaultValue(elemType);
            } else {
                const struct = structs.find((struct) => struct.name === type.tcon.name);
                if (struct) {
                    return JSON.stringify(createDefault(struct.schema, structs), null, 2);
                }
            }
        }

        return "";
    };

    const isPrimitive = useMemo(() =>
        ["string", "boolean", "integer", "float", "array", "map"].includes(variable.type.tcon.name),
        [variable.type.tcon.name]
    );

    useEffect(() => {
        if (!isPrimitive && !variable.initialValue) {
            updateVariable(variable.id, { initialValue: setDefaultValue(variable.type) });
        }
    }, [isPrimitive, variable.initialValue, variable.id, setDefaultValue, variable.type]);

    // Node-related utility functions
    const findRelatedNodes = useCallback((id: string) =>
        nodes.filter(node =>
            (node.type === "variable/get" || node.type === "variable/set") &&
            node.data.variableId === id
        ), [nodes]
    );

    const updateRelatedNodes = useCallback((id: string, updateFn: (spec: any) => any) => {
        const relatedNodes = findRelatedNodes(id);
        relatedNodes.forEach(node =>
            updateNodeData(node.id, { spec: updateFn(node.data.spec) })
        );
    }, [findRelatedNodes, updateNodeData]);

    // Event Handlers
    const handleNameChange = (e: React.FocusEvent<HTMLDivElement>) => {
        const name = e.target.innerText;
        updateVariable(variable.id, { name });

        updateRelatedNodes(variable.id, (spec) => ({
            ...spec,
            label: name,
        }));
    };

    const handleTypeChange = (type: string, container: string) => {
        setSelectedType(type);
        setSelectedContainer(container);

        const tcon: Type = {
            tag: "TCon",
            tcon: {
                name: "",
                types: [],
            },
        };

        if (container === "single") {
            tcon.tcon.name = type;
        } else {
            tcon.tcon.name = container;
            tcon.tcon.types = [{
                tag: "TCon",
                tcon: {
                    name: type,
                    types: [],
                },
            }];
        }

        updateVariable(variable.id, {
            type: tcon,
            initialValue: null
        });

        updateRelatedNodes(variable.id, (spec) => ({
            ...spec,
            outputs: spec.outputs.map((output: Socket) =>
                output.name === "value" ? { ...output, type: tcon } : output
            ),
            inputs: spec.inputs.map((input: Socket) =>
                input.name === "value" ? { ...input, type: tcon } : input
            ),
        }));
    };

    // Validation and change handler for single container
    const handleSingleContainerChange = useCallback((name: string, value: string) => {
        const newErrors: string[] = [];
        const isPrimitive = ["string", "boolean", "integer", "float"].includes(variable.type.tcon.name);

        if (!isPrimitive) {
            const struct = structs.find(struct => struct.name === variable.type.tcon.name);
            if (struct) {
                const isValid = validateStruct(value, struct.schema, newErrors);
                if (!isValid) {
                    setErrors(newErrors);
                    return;
                }
            }
        }

        setErrors([]);
        updateVariable(variable.id, { initialValue: value });
    }, [structs, variable.type.tcon.name, variable.id, updateVariable]);

    // Render Helpers
    const RenderSingleContainer = () => {
        return (
            <div>
                {errors.length > 0 && (
                    <div className="text-red-500 mb-2">
                        {errors.map((error, index) => (
                            <div key={index}>• {error}</div>
                        ))}
                    </div>
                )}
                <PolyInput
                    type={variable.type}
                    name=""
                    value={variable.initialValue ?? ""}
                    onChange={handleSingleContainerChange}
                />
            </div>
        )
    };

    const RenderArrayContainer = () => {
        const elemType = variable.type.tcon.types[0];
        const isPrimitive = ["string", "integer", "boolean", "float"].includes(elemType.tcon.name);

        const handleValueChange = (index: number, val: string) => {
            const newErrors: string[] = [];

            if (!isPrimitive) {
                const struct = structs.find(struct => struct.name === elemType.tcon.name);
                if (struct) {
                    const isValid = validateStruct(val, struct.schema, newErrors);
                    if (!isValid) {
                        setErrors(newErrors);
                        return;
                    }
                }
            }

            const updatedArray = (variable.initialValue || []).map((item, i) =>
                i === index ? val : item
            );
            setErrors([]);
            updateVariable(variable.id, { initialValue: updatedArray });
        };

        const addArrayElement = () => {
            updateVariable(variable.id, {
                initialValue: [...(variable.initialValue || []), setDefaultValue(elemType)]
            });
        };


        return (
            <>
                {(variable.initialValue || []).map((value, index) => {
                    return (
                        <div className={isPrimitive ? "flex" : "block"} key={`array-item-${index}`}>
                            {errors.length > 0 && (
                                <div className="text-red-500 mb-2">
                                    {errors.map((error, idx) => (
                                        <div key={idx}>• {error}</div>
                                    ))}
                                </div>
                            )}
                            <PolyInput
                                disabled
                                type="string"
                                name={`Array(${index})`}
                                value={`Array(${index})`}
                            />
                            <PolyInput
                                type={variable.type}
                                name=""
                                value={value ?? ""}
                                onChange={(name, val) => handleValueChange(index, val)}
                            />
                        </div>
                    );
                })}
                <Button
                    className="w-full bg-sky-500 text-foreground mt-2"
                    onClick={addArrayElement}
                >
                    Add Element
                </Button>
            </>
        );
    };


    const RenderMapContainer = () => {
        const elemType = variable.type.tcon.types[0];
        const isPrimitive = ["string", "integer", "boolean", "float"].includes(elemType.tcon.name);

        const handleKeyChange = (index: number, val: string) => {
            const updatedArray = (variable.initialValue || []).map((item, i) =>
                i === index ? { key: val, value: item.value } : item
            );
            updateVariable(variable.id, { initialValue: updatedArray });
        };

        const handleValueChange = (index: number, val: string) => {
            const newErrors: string[] = [];

            if (!isPrimitive) {
                const struct = structs.find(struct => struct.name === elemType.tcon.name);
                if (struct) {
                    const isValid = validateStruct(val, struct.schema, newErrors);
                    if (!isValid) {
                        setErrors(newErrors);
                        return;
                    }
                }
            }

            const updatedArray = (variable.initialValue || []).map((item, i) =>
                i === index ? { key: item.key, value: val } : item
            );
            setErrors([]);
            updateVariable(variable.id, { initialValue: updatedArray });
        };

        const addKeyValue = () => {
            const newEntry = { key: "", value: setDefaultValue(elemType) };
            updateVariable(variable.id, {
                initialValue: [...(variable.initialValue || []), newEntry]
            });
        };

        return (
            <>
                {(variable.initialValue || [])
                    .map(kv => typeof kv == "string" ? JSON.parse(kv) : kv)
                    .map((kv, index) => (
                        <div className={isPrimitive ? "flex" : "block"} key={`map-item-${index}`}>
                            {errors.length > 0 && (
                                <div className="text-red-500 mb-2">
                                    {errors.map((error, idx) => (
                                        <div key={idx}>• {error}</div>
                                    ))}
                                </div>
                            )}
                            <PolyInput
                                type="string"
                                value={kv.key ?? ""}
                                onChange={(name, val) => handleKeyChange(index, val)}
                            />
                            <PolyInput
                                type={variable.type}
                                value={kv.value ?? ""}
                                onChange={(name, val) => handleValueChange(index, val)}
                            />
                        </div>
                    ))}
                <Button
                    className="w-full bg-sky-500 text-foreground mt-2"
                    onClick={addKeyValue}
                >
                    Add Key Value
                </Button>
            </>
        );
    };

    const RenderSettings = () => (
        <Card className="border-0 bg-background w-full">
            <CardHeader>
                <CardTitle>Additional Settings</CardTitle>
                <CardDescription>Variable ({variable.name}) Settings</CardDescription>
            </CardHeader>
            <CardContent className="p-2 w-full">
                <div className="mb-2 w-full">
                    <div className="text-sm font-medium mb-2">Data Type:</div>
                    <div className="flex justify-between w-full">
                        <Combobox
                            name="valueType"
                            value={selectedType}
                            options={{
                                default: variable.type.tcon.name,
                                options: getTypes()
                            }}
                            onChange={(name, value) => handleTypeChange(value, selectedContainer)}
                        />
                        <Combobox
                            name="container"
                            value={selectedContainer}
                            options={{
                                default: "single",
                                options: ["single", "array", "map"],
                            }}
                            onChange={(name, value) => handleTypeChange(selectedType, value)}
                        />
                    </div>
                </div>
                <div className="text-sm font-medium mb-2">Initial Value:</div>
                {variable.type.tcon.name === "array"
                    ? <RenderArrayContainer />
                    : variable.type.tcon.name === "map"
                        ? <RenderMapContainer />
                        : <RenderSingleContainer />
                }
            </CardContent>
        </Card>
    );

    return (
        <div className="border-b">
            <div
                className="flex items-center justify-between group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    className="outline-none focus:border-b focus:border-gray-300 flex-grow"
                    onBlur={handleNameChange}
                >
                    {variable.name}
                </div>
                <div
                    className={`flex items-center transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-accent">
                                <Plus />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 space-y-4">
                            <h4 className="font-medium leading-none">Variable Actions</h4>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        if (variable.initialValue == null) {
                                            log_error(`Variable '${variable.name}' has no initial value`);
                                            return;
                                        }
                                        onSelectNode({
                                            type: "variable/get",
                                            data: {
                                                variableId: variable.id,
                                            },
                                            ...createGetNodeSpec(variable)
                                        });
                                    }}
                                >
                                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                                    Get
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        if (variable.initialValue == null) {
                                            log_error(`Variable '${variable.name}' has no initial value`);
                                            return;
                                        }

                                        onSelectNode({
                                            type: "variable/set",
                                            data: {
                                                variableId: variable.id,
                                            },
                                            ...createSetNodeSpec(variable)
                                        });
                                    }}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Set
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-accent"
                        onClick={() => setMenu(!menu)}
                    >
                        <Settings2 />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-accent">
                        <Trash />
                    </Button>
                </div>
            </div>
            {menu && <RenderSettings />}
        </div>
    );
};