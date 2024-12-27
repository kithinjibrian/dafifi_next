"use client"

import { Input } from "@/components/ui/input"
import { Type } from "@/store/flow"
import MonacoEditor from '@monaco-editor/react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";

export type PolyInputProps = {
    type: string | Type,
    name?: string,
    value: any,
    disabled?: boolean,
    defaultValue?: any,
    className?: string,
    onChange?: (name: string, value: any) => void,
    onBlur?: (name: string, value: any) => void,
}

const generic: React.FC<PolyInputProps> = ({
    type,
    name,
    value,
    style,
    disabled,
    onChange,
    onBlur,
    defaultValue,
    className
}) => {
    const map: { [key: string]: string } = {
        "string": "text",
        "float": "number",
        "integer": "number"
    }

    return (
        <Input
            disabled={disabled ? true : false}
            style={style}
            type={map[type] || "text"}
            placeholder={name}
            className={className}
            value={value ? String(value) : defaultValue ? String(defaultValue) : ""}
            onChange={(e) => onChange && onChange(name, e.currentTarget.value)}
            onBlur={(e) => onBlur && onBlur(name, value)}
        />
    )
}

const boolean: React.FC<PolyInputProps> = ({
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

const struct: React.FC<PolyInputProps> = ({
    type,
    name,
    value,
    style,
    disabled,
    onChange,
    defaultValue,
    className
}) => {
    const handleEditorChange = (value: string | undefined) => {
        if (value && onChange)
            onChange(name, value);
    };

    return (
        <>
            <div className="w-full">
                <Dialog>
                    <DialogTrigger
                        className="w-full bg-sky-500 p-1.5"
                    >Edit Struct</DialogTrigger>
                    <DialogContent className="h-[90%]">
                        <DialogHeader>
                            <DialogTitle>Struct</DialogTitle>
                            <DialogDescription>
                            </DialogDescription>
                        </DialogHeader>
                        <MonacoEditor
                            height="100%"
                            width="100%"
                            language={"json"}
                            value={value}
                            onChange={handleEditorChange}
                            theme="vs-dark"
                            options={{
                                lineNumbers: 'off',
                                minimap: { enabled: false }
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}


const jumpTable: Record<string, React.FC<PolyInputProps>> = {
    "flow": generic,
    "string": generic,
    "float": generic,
    "integer": generic,
    "boolean": boolean,
    "struct": generic
}

export const PolyInput: React.FC<PolyInputProps> = (props) => {
    let type = null, _props = { ...props };
    if (typeof props.type === "string") {
        type = props.type;
    } else {
        if (props.type.tag == "TCon") {
            const t = props.type.tcon.types;
            const _t = t[0];
            if (t.length > 0) {
                type = _t.tag == "TCon" ? _t.tcon.name : null;
            } else {
                type = props.type.tcon.name;
            }

            if (type)
                _props.type = type;
        } else {
            type = "string";
            _props.disabled = true;
            _props.defaultValue = "unknown";
        }
    }

    return (
        <>
            {type && (jumpTable[type] ? jumpTable[type](_props) : struct(_props))}
        </>
    )
}