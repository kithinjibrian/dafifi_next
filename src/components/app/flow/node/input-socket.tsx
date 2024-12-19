import { Position } from "@xyflow/react";
import { PolyInput } from "@/components/utils/poly-input";
import { NodeHandle } from "./handle";

export const InputSocket = ({
    name,
    type,
    value,
    store,
    onChange,
    connected,
    defaultValue
}) => {
    const { getType } = store();

    const backgroundColor = getType(type);

    let showName = false;

    if (connected) {
        showName = true;
    } else if (type.tag === "TVar") {
        showName = true;
    } else if (
        type.tag === "TCon" &&
        (type.tcon.name === "flow" ||
            type.tcon.name === "map" ||
            type.tcon.name === "array" ||
            type.tcon.name.startsWith("struct")
        )
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
                        type={type.tcon.name}
                        name={name}
                        className="py-1 px-2 nodrag"
                        value={value}
                        defaultValue={defaultValue ?? ""}
                        onChange={onChange}
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
