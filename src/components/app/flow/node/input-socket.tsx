import { Position } from "@xyflow/react";
import { PolyInput } from "@/components/utils/poly-input";
import { NodeHandle } from "./handle";

export const InputSocket = ({
    id,
    name,
    type,
    value,
    store,
    onChange,
    connected,
    defaultValue,
}) => {
    const { getType, structs, getNode, updateNodeData } = store();

    const backgroundColor = getType(type);

    let showName = false;

    if (connected) {
        showName = true;
    } else if (type.tag === "TVar") {
        showName = true;
    } else if (
        type.tag === "TCon" && type.tcon.name === "flow"
    ) {
        showName = true;
    }

    return (
        <div className="flex grow items-center justify-start w-full">
            <div className="ml-3 w-full">
                {showName && (
                    <div className="flex items-center">{name}</div>
                )}
                {!showName && (
                    <PolyInput
                        structs={structs}
                        type={type}
                        name={name}
                        className="py-1 px-2 nodrag"
                        value={value}
                        defaultValue={defaultValue ?? ""}
                        onChange={(name, data) => {
                            if (
                                data &&
                                typeof data == "object" &&
                                'magic' in data &&
                                data.magic == "nac"
                            ) {
                                const node = getNode(id);
                                const spec = node.data.spec;

                                onChange("spec", {
                                    ...spec,
                                    inputs: [
                                        ...spec.inputs.filter(o => !o.removable),
                                        ...data.type.inputs
                                    ],
                                    outputs: [
                                        ...spec.outputs.filter(o => !o.removable),
                                        ...data.type.outputs
                                    ]
                                });
                                onChange(name, data.value);
                            } else {
                                onChange(name, data);
                            }
                        }}
                        onType={(data) => {
                            if (!data) return;

                            const node = getNode(id);

                            updateNodeData(id, {
                                spec: {
                                    ...node.data.spec,
                                    inputs: [

                                    ],
                                    outputs: [
                                        ...node.data.spec.outputs,
                                        ...data.outputs
                                    ]
                                }
                            })

                            //console.log(getNode(id));
                        }}
                    />
                )}
            </div>
            <NodeHandle
                id={name}
                handle_type="target"
                type={type}
                position={Position.Left}
                style={{
                    background: backgroundColor,
                    height: "10px",
                    width: "10px",
                    top: "13px",
                }}
                className="flex-shrink-0"
            />
        </div>
    );
};
