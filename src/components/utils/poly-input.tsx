"use client"

import { Input } from "@/components/ui/input"
import { Type } from "@/store/flow"
import MonacoEditor from '@monaco-editor/react';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { setDefaultValue } from "./default";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { parse } from "@/utils/compiler";
import { Trash } from "lucide-react";
import { validateStruct } from "@/utils/validate";
import { ScrollArea } from "../ui/scroll-area";

export type PolyInputProps = {
    type: Type,
    name: string,
    structs?: any,
    value?: any,
    disabled?: boolean,
    defaultValue?: any,
    className?: string,
    onChange?: (name: string, value: any) => void,
    onBlur?: (name: string, value: any) => void,
    onErrorChange?: (name: string, bool: boolean) => void,
    onError?: (name: string, errors: string[]) => void,
}

const Boolean: React.FC<PolyInputProps> = ({
    type,
    name,
    value,
    disabled,
    onChange,
    className,
    defaultValue,
}) => {
    return (
        <>
            <input
                disabled={disabled}
                type="checkbox"
                id={`${name}-boolean`}
                className={className}
                checked={!!(value ?? defaultValue)}
                onChange={(e) => {
                    onChange(name, e.currentTarget.checked);
                }}
            />

            <label
                htmlFor={`${name}-boolean`}
                className="px-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {name}
            </label>
        </>
    )
}

const Generic: React.FC<PolyInputProps> = (props) => {
    const map: { [key: string]: string } = {
        "string": "text",
        "float": "number",
        "integer": "number",
    };

    const [errors, setErrors] = useState<string[]>([]);

    const validate = (value: string): string[] => {
        const validationErrors: string[] = [];

        switch (props.type.tcon.name) {
            case "string":
                if (value == "") {
                    validationErrors.push("String can't be empty");
                }
                break;
            case "float":
                if (isNaN(parseFloat(value))) {
                    validationErrors.push("Value must be a valid floating-point number");
                }
                break;

            case "integer":
                if (!/^\d+$/.test(value)) {
                    validationErrors.push("Value must be a valid integer");
                }
                break;

            case "boolean":
                if (value !== "true" && value !== "false") {
                    validationErrors.push("Value must be 'true' or 'false'");
                }
                break;

            default:
                break;
        }

        return validationErrors;
    };

    const handleValidation = (value: string) => {
        const validationErrors = validate(value);

        // Update errors state and notify parent if state changes
        if (validationErrors.join(",") !== errors.join(",")) {
            setErrors(validationErrors);

            if (props.onErrorChange) {
                props.onErrorChange(props.name, validationErrors.length > 0);
            }

            if (validationErrors.length && props.onError) {
                props.onError(props.name, validationErrors);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;

        handleValidation(value);

        if (props.onChange) {
            props.onChange(props.name, value);
        }
    };

    return (
        <div className="input-container">
            <Input
                disabled={props.disabled || false}
                style={props.style}
                type={map[props.type.tcon.name] || "text"}
                placeholder={props.name}
                className={`${props.className} ${errors.length ? "border-red-500" : ""} w-full`}
                value={
                    props.value
                        ? String(props.value)
                        : props.defaultValue
                            ? String(props.defaultValue)
                            : ""
                }
                onChange={handleChange}
                onBlur={(e) => {
                    handleValidation(e.currentTarget.value);

                    if (props.onBlur) {
                        props.onBlur(props.name, props.value);
                    }
                }}
            />
            {errors.length > 0 && (
                <div className="error-messages text-red-500 text-sm mt-1">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

const Struct: React.FC<PolyInputProps> = ({
    type,
    structs,
    name,
    value,
    onChange,
}) => {
    const [errors, setErrors] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const [editorValue, setEditorValue] = useState(value || setDefaultValue(type, structs))

    const handleEditorChange = (newValue: string) => {
        setEditorValue(newValue)
        onChange?.(name, null)
    }

    const handleOpenChange = (open: boolean) => {

        if (!open) {
            const newErrors: string[] = [];
            const struct = structs.find(s => s.name == type.tcon.name);
            validateStruct(editorValue, struct.schema, newErrors);
            setErrors(newErrors);

            if (newErrors.length > 0)
                return;
        }

        onChange?.(name, editorValue)
        setIsOpen(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger className="w-full bg-sky-500 p-1.5 text-white hover:bg-sky-600 transition-colors">
                Edit Struct
            </DialogTrigger>
            <DialogContent
                className="h-[90vh]"
                onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Edit Struct</DialogTitle>
                </DialogHeader>
                <MonacoEditor
                    height="90%"
                    width="100%"
                    language="json"
                    value={editorValue}
                    onChange={(value) => handleEditorChange(value)}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                    }}
                />
                <ScrollArea className="h-32">
                    {errors.map((i, n) => (
                        <p key={n}>{`${n}. `}{i}</p>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

const ArrayInput: React.FC<PolyInputProps> = (props) => {
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [elements, setElements] = useState<any[]>(Array.isArray(props.value) ? props.value : [])
    const elementType = props.type.tcon.types[0]

    useEffect(() => {
        props.onChange?.(props.name, null)
    }, [elements])

    const handleValueChange = (index: number, val: any) => {
        setElements(prev => prev.map((item, i) => i === index ? val : item))
    }

    const handleOpenChange = (open: boolean) => {
        if (!open && error) {
            return;
        }

        props.onChange?.(props.name, elements);
        setIsOpen(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger className="w-full bg-sky-500 p-1.5 text-white hover:bg-sky-600 transition-colors">
                Edit Array
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Edit Array</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    {elements.map((val, index) => (
                        <div key={index} className="flex gap-2">
                            <PolyInput
                                disabled
                                type={parse("string")}
                                value={`Element ${index}`}
                                name={"index"}
                            />
                            <PolyInput
                                {...props}
                                type={elementType}
                                value={val}
                                onChange={(_, val) => handleValueChange(index, val)}
                                onErrorChange={(name, b) => {
                                    setError(b);
                                }}
                            />
                            <Button
                                variant="destructive"
                                onClick={() => setElements(prev => prev.filter((_, i) => i !== index))}
                            >
                                <Trash />
                            </Button>
                        </div>
                    ))}
                    <Button
                        className="w-full bg-sky-500 hover:bg-sky-600"
                        onClick={() => setElements(prev => [...prev, setDefaultValue(elementType, props.structs)])}
                    >
                        Add Element
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


const Map: React.FC<PolyInputProps> = (props) => {
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [entries, setEntries] = useState<Array<{ key: string, value: any }>>(
        Array.isArray(props.value)
            ? props.value.map(entry =>
                typeof entry === 'string' ? JSON.parse(entry) : entry
            )
            : []
    )
    const valueType = props.type.tcon.types[0]

    useEffect(() => {
        props.onChange?.(props.name, null)
    }, [entries])

    const handleUpdate = (index: number, key: string, value: any) => {
        setEntries(prev => prev.map((entry, i) =>
            i === index ? { key, value } : entry
        ))
    }

    const handleOpenChange = (open: boolean) => {
        if (!open && error) {
            return;
        }

        props.onChange?.(props.name, entries);
        setIsOpen(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger className="w-full bg-sky-500 p-1.5 text-white hover:bg-sky-600 transition-colors">
                Edit Map
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Edit Map</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    {entries.map((entry, index) => (
                        <div key={index} className="flex gap-2">
                            <PolyInput
                                type={parse("string")}
                                value={entry.key}
                                onChange={(_, key) => handleUpdate(index, key, entry.value)}
                                name="Key"
                                onErrorChange={(name, b) => {
                                    setError(b);
                                }}
                            />
                            <PolyInput
                                {...props}
                                type={valueType}
                                value={entry.value}
                                onChange={(_, value) => handleUpdate(index, entry.key, value)}
                                onErrorChange={(name, b) => {
                                    setError(b);
                                }}
                            />
                            <Button
                                variant="destructive"
                                onClick={() => setEntries(prev => prev.filter((_, i) => i !== index))}
                            >
                                <Trash />
                            </Button>
                        </div>
                    ))}
                    <Button
                        className="w-full bg-sky-500 hover:bg-sky-600"
                        onClick={() => setEntries(prev => [...prev, {
                            key: "",
                            value: setDefaultValue(valueType, props.structs)
                        }])}
                    >
                        Add Entry
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


export const PolyInput: React.FC<PolyInputProps> = (props) => {
    let type = props.type;
    if (type.tag == "TVar") return (<></>);

    if (type.tcon.name.startsWith("struct")) {
        return <Struct {...props} />
    } else if (type.tcon.name == "array") {
        return <ArrayInput {...props} />
    } else if (type.tcon.name == "map") {
        return <Map {...props} />
    } else if (type.tcon.name == "boolean") {
        return <Boolean {...props} />
    } else {
        return <Generic {...props} />
    }
}