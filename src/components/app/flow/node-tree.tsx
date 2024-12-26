import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Search } from "lucide-react"
import { NodeRendererProps, Tree } from "@/components/react-arborist"
import { useProjectStore } from "@/store/project"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import useResizeObserver from "use-resize-observer";
import { Nac } from "@kithinji/nac"
import { defs } from "@/components/utils/builtin"

export function DefaultNode2<T>(props: NodeRendererProps<T>) {
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
                className="flex items-center justify-center rounded transition"
            >
                {props.node.isLeaf ? (
                    <></>
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
            <span>{props.node.data.label}</span>
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


export const NodeTree = ({
    onSelectNode,
}) => {
    const [search, setSearch] = useState("")
    const { project, specs, fetchSpecNodes } = useProjectStore();

    const { ref, width, height } = useResizeObserver<HTMLDivElement>();

    useEffect(() => {
        if (project && (!specs || specs.length == 0)) {
            fetchSpecNodes(+project.id)
        }
    }, [project, specs]);

    const open = (node) => {
        if (node.isLeaf) {

            if (node.data?.actions?.on_before_select) {
                new Nac(node.data.actions.on_before_select, defs);
            }

            const newNode = onSelectNode(node.data);

            if (newNode.data?.spec?.actions?.on_select) {
                defs["NODE_G"] = {
                    type: "variable",
                    value: newNode
                };

                new Nac(newNode.data.spec.actions.on_select, defs);
            }
        }
    }

    return (
        <div
            className="h-full p-4">
            <div className="mb-4">
                <div className="relative">
                    <Input
                        className="pl-10 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search nodes..."
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search />
                    </div>
                </div>
            </div>
            <div style={{ height: "80%" }} ref={ref}>
                <Tree
                    width={"100%"}
                    height={height}
                    data={specs}
                    rowHeight={36}
                    searchTerm={search}
                    openByDefault={false}
                    onActivate={open}
                    idAccessor="label">
                    {DefaultNode2}
                </Tree>
            </div>
        </div>
    )
}


/*
                let new_node = add_node("lifecycle/onStart", {
                    x: NODE_G.position.x - 300,
                    y: NODE_G.position.y - 50
                });

                connect_edge({
                    source: new_node.id,
                    target: NODE_G.id,
                    sourceHandle: "flow",
                    targetHandle: "flow"
                });

*/