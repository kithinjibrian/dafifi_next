import { MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { VarProps } from "./var-input";

export const Var_output: React.FC<VarProps> = ({
    id,
    getNode,
    updateNodeData,
    store
}) => {
    const {
        edges,
        setEdges
    } = store();

    return (
        <div className="flex justify-end items-center border-b">
            <span>Output:</span>
            <Button
                variant="ghost"
                onClick={() => {
                    const node = getNode(id);

                    const hasRemovableInput = node.data.spec.outputs.length > 0 &&
                        node.data.spec.outputs[node.data.spec.outputs.length - 1].removable;

                    if (hasRemovableInput) {
                        const output = node.data.spec.outputs[node.data.spec.outputs.length - 1];

                        const edge = edges.filter((edge) => {
                            return edge.source === id && edge.sourceHandle === output.name
                        })

                        if (edge.length > 0)
                            setEdges((edges) => edges.filter((e) => e.id !== edge[0].id));

                        updateNodeData(id, {
                            spec: {
                                ...node.data.spec,
                                outputs: node.data.spec.outputs.slice(0, -1),
                            },
                        });
                    }
                }}
            >
                <MinusCircle />
            </Button>
            <Button
                variant="ghost"
                onClick={() => {
                    const node = getNode(id);
                    updateNodeData(id, {
                        spec: {
                            ...node.data.spec,
                            outputs: [
                                ...node.data.spec.outputs,
                                {
                                    name: `${node.data.spec.prefix}${node.data.spec.outputs.length - 1}`,
                                    type: {
                                        tag: "TCon",
                                        tcon: {
                                            name: "flow",
                                            types: []
                                        }
                                    },
                                    removable: true,
                                    editable: true,
                                },
                            ]
                        },
                    });
                }}
            >
                <PlusCircle />
            </Button>
        </div>
    )
}