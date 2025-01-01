import { Handle, Position } from "@xyflow/react";
import { NodeHandle } from "./handle";

export const OutputSocket = ({
    id,
    name,
    type,
    store,
    index,
    editable
}) => {
    const { updateNodeData, getNode, getType } = store();

    const backgroundColor = getType(type);

    return (
        <div className="flex grow items-center justify-end">
            <div
                contentEditable={editable}
                suppressContentEditableWarning={editable}
                spellCheck={false}
                className="mr-3 flex items-center"
                onBlur={(e) => {

                    if (!e.target.textContent || e.target.textContent == "") {
                        e.target.textContent = name;
                    };

                    const node = getNode(id);
                    const outputs = node.data.spec.outputs;

                    outputs[index] = {
                        ...outputs[index],
                        name: e.target.textContent
                    };

                    updateNodeData(id, {
                        spec: {
                            ...node.data.spec,
                            outputs: [...outputs]
                        }
                    })
                }}>
                {name}
            </div>
            <NodeHandle
                id={name}
                handle_type="source"
                type={type}
                position={Position.Right}
                style={{ background: backgroundColor, height: "10px", width: "10px", top: "14px" }}
                className="flex-shrink-0"
            />
        </div>
    );
}
