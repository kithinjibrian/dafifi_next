import { MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type VarProps = {
    id: string,
    getNode: (id: string) => any,
    updateNodeData: (id: string, data: any) => void
}

export const Var_input: React.FC<VarProps> = ({
    id,
    getNode,
    updateNodeData
}) => {
    return (
        <div className="flex justify-start items-center border-t pl-2">
            <span>Input:</span>
            <Button
                variant="ghost"
                onClick={() => {
                    const node = getNode(id);

                    const hasRemovableInput = node.data.spec.inputs.length > 0 &&
                        node.data.spec.inputs[node.data.spec.inputs.length - 1].removable;

                    if (hasRemovableInput) {
                        updateNodeData(id, {
                            spec: {
                                ...node.data.spec,
                                inputs: node.data.spec.inputs.slice(0, -1),
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
                            inputs: [
                                ...node.data.spec.inputs,
                                {
                                    name: `input_${node.data.spec.inputs.length + 1}`,
                                    type: {
                                        tag: "TCon",
                                        tcon: {
                                            name: "flow",
                                            types: []
                                        }
                                    },
                                    removable: true
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