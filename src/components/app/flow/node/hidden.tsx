import { Handle, Position } from "@xyflow/react"
import { NodeHandle } from "./handle";

export const Hidden = ({
    inputs,
    outputs,
    store
}) => {
    const calculateHandlePosition = (index: number, total: number) => {

        if (total === 1) return '50%';

        const padding = 25;
        const availableHeight = 100 - (2 * padding);

        return `${padding + (index * (availableHeight / (total - 1)))}%`;
    };

    const { getType } = store();

    return (
        <div>
            {outputs.map((output, index) => (
                <NodeHandle
                    key={`output-${output.name}`}
                    id={output.name}
                    handle_type="source"
                    type={output.type}
                    position={Position.Right}
                    style={{
                        background: getType(output.type),
                        height: "10px",
                        width: "10px",
                        top: calculateHandlePosition(index, outputs.length),
                    }}
                    className="flex-shrink-0"
                />
            ))}
            {inputs.filter(input => !input.hide).map((input, index) => (
                <NodeHandle
                    key={`input-${input.name}`}
                    id={input.name}
                    handle_type="target"
                    type={input.type}
                    position={Position.Left}
                    style={{
                        background: getType(input.type),
                        height: "10px",
                        width: "10px",
                        top: calculateHandlePosition(index, inputs.filter(i => !i.hide).length),
                    }}
                    className="flex-shrink-0"
                />
            ))}
        </div>
    )
}