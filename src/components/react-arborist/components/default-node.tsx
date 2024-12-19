import React, { useEffect, useRef } from "react";
import { NodeRendererProps } from "../types/renderers";
import { IdObj } from "../types/utils";
import { ChevronDown, ChevronRight, File } from "lucide-react";
import { cn } from "@/lib/utils";

export function DefaultNode<T>(props: NodeRendererProps<T>) {
    return (
        <div
            ref={props.dragHandle}
            style={props.style}
            className={cn(
                "flex items-center space-x-1 rounded transition cursor-pointer",
                props.node.isSelected && "bg-sky-500"
            )}
        >
            {/* Icon for expanding or leaf */}
            <span
                onClick={(e) => {
                    e.stopPropagation();
                    props.node.toggle();
                }}
                className="flex items-center justify-center w-6 h-6 rounded transition"
            >
                {props.node.isLeaf ? (
                    <File className="w-4 h-4" />
                ) : props.node.isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                ) : (
                    <ChevronRight className="w-4 h-4" />
                )}
            </span>

            {/* Node content */}
            <div className="flex-grow">
                {props.node.isEditing ? (
                    <Edit {...props} />
                ) : (
                    <Show {...props} />
                )}
            </div>
        </div>
    );
}

function Show<T>(props: NodeRendererProps<T>) {
    return (
        <>
            {/* @ts-ignore */}
            <span>{props.node.data.name}</span>
        </>
    );
}

function Edit<T>({ node }: NodeRendererProps<T>) {
    const input = useRef<any>();

    useEffect(() => {
        input.current?.focus();
        input.current?.select();
    }, []);

    return (
        <input
            ref={input}

            defaultValue={node.data.name}
            onBlur={() => node.reset()}
            onKeyDown={(e) => {
                if (e.key === "Escape") node.reset();
                if (e.key === "Enter") node.submit(input.current?.value || "");
            }}
        ></input>
    );
}
