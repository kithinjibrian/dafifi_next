import { useChangeNodeData } from "@/hooks/useChangeNodeData";
import { InputSocket } from "./input-socket"
import { OutputSocket } from "./output-socket"
import { useEdges } from "@xyflow/react";
import { isHandleConnected } from "@/utils/isHandleConnected";

export const Show = ({
    id,
    data,
    store,
}) => {
    const edges = useEdges();
    const handleChange = useChangeNodeData(id);

    return (
        <div className="flex flex-col gap-2 py-2">
            {data.spec.outputs.map((output, index) => (
                <div
                    key={index}
                    className="flex flex-grow justify-between gap-8 relative px-2 mt-2">
                    <OutputSocket
                        {...output}
                        id={id}
                        index={index}
                        store={store}
                        connected={isHandleConnected(edges, id, output.name, "source")} />
                </div>
            ))}
            {data.spec.inputs.map((input, index) => {
                if (input.hide) return null
                return (
                    <div
                        key={index}
                        className="flex flex-grow justify-between gap-8 relative px-2 mt-2">
                        <InputSocket
                            {...input}
                            id={id}
                            store={store}
                            value={data[input.name] ?? input.defaultValue}
                            onChange={handleChange}
                            connected={isHandleConnected(edges, id, input.name, "target")}
                        />
                    </div>
                )
            })}
        </div>
    )
}