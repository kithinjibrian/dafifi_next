import { cn } from "@/lib/utils"
import { Hidden } from "./hidden"
import { Show } from "./show"
import { HeaderNode } from "./header"
import React, { useState } from "react"
import { NodeProps } from "./node"
import { Var_input } from "./var-input"
import { Var_output } from "./var-output"

export const NodeContainer: React.FC<NodeProps> = ({
    id,
    selected,
    data,
    store,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(data.spec.collapse ?? false);

    const { setActiveTab, updateNodeData, getNode } = store();

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        const node = getNode(id);
        updateNodeData(id, {
            spec: {
                ...node.data.spec,
                collapse: !isCollapsed,
            },
        });
    };


    return (
        <div
            className={cn(
                "bg-background shadow rounded min-w-[180px] relative",
                selected && "outline outline-1"
            )}>

            <HeaderNode
                isCollapsed={isCollapsed}
                onToggleCollapse={toggleCollapse}
                data={data}
                setActiveTab={setActiveTab}
            />

            {isCollapsed ? (
                <Hidden inputs={data.spec.inputs} outputs={data.spec.outputs} store={store} />
            ) : (
                <>
                    {data.spec.variadic_output && (
                        <Var_output id={id} store={store} getNode={getNode} updateNodeData={updateNodeData} />
                    )}
                    <Show data={data} id={id} store={store} />
                    {data.spec.variadic_input && (
                        <Var_input id={id} getNode={getNode} updateNodeData={updateNodeData} />
                    )}
                </>
            )}
        </div>
    )
}