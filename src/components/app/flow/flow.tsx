import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable";

import {
    ReactFlow,
    Background,
    Connection,
    useReactFlow
} from '@xyflow/react';
import { FlowEdge } from "./node/flow-edge";
import { useCallback, useEffect, useRef } from "react";
import { useProjectStore } from "@/store/project";
import { nanoid } from "nanoid";
import { Socket, Type } from "@/store/flow";
import { report_error } from "@/utils/request";
import { apply, unify } from "@/utils/type";
import { NodeBar } from "./node-bar";
import { defs } from "@/components/utils/builtin";
import { useErrorStore } from "@/store/errors";
import { parse } from "@/utils/compiler";
import { createGetNodeSpec } from "./variable";
import dagre from 'dagre';
import { AlignHorizontalJustifyStart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipComponent } from "@/components/utils/tooltip";

const EDGE_TYPES = { flowedge: FlowEdge };

const createEdgeData = (getType: Function, sourceType: Type, targetType: Type) => {
    const t = getType(sourceType);
    const t2 = getType(targetType);
    return {
        gradientColors: [t, t2],
        dashed: t == "dodgerblue",
        animated: t == "dodgerblue",
    }
};

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction });

    // Set nodes
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: node.measured.width, height: node.measured.height });
    });

    // Set edges
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // Apply layout
    dagre.layout(dagreGraph);

    // Get the positioned nodes
    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - (node.measured.width / 2),  // Center node by subtracting half the width
                y: nodeWithPosition.y - (node.measured.height / 2),  // Center node by subtracting half the height
            }
        };
    });

    return { nodes: layoutedNodes, edges };
};

export const Flow = ({ store, customNodeTypes }) => {

    const edgeReconnectSuccessful = useRef(true);

    const { project, getSpecNode } = useProjectStore();

    const { log_error } = useErrorStore();

    const { setEdges } = useReactFlow();

    const {
        nodes,
        edges,
        structs,
        schemas,
        getNode,
        setNodesInStore,
        setEdgesInStore,
        selectedNode,
        onNodesChange,
        onEdgesChange,
        setSelectedNode,
        getType,
        updateNodeData,
        addVariable,
        addStruct
    } = store();

    const onNodeClick = useCallback((_, node) => setSelectedNode(node), [setSelectedNode]);

    const handleAddNode = useCallback(
        (node: any, position: { x: number; y: number } | null = null) => {

            const lastPosition = selectedNode ? selectedNode.position : { x: 0, y: 0 };

            const newPosition = position || {
                x: lastPosition.x + 250,
                y: lastPosition.y,
            };

            const {
                data,
                ...rest
            } = node;

            const newNode = {
                id: nanoid(),
                type: rest.type,
                position: newPosition,
                data: {
                    ...data,
                    spec: JSON.parse(JSON.stringify(rest))
                }
            };

            onNodesChange([{ type: 'add', item: newNode }]);
            return newNode;
        },
        [onNodesChange, selectedNode, project],
    );

    const createEdge = (connection: Connection, sourceType: Type, targetType: Type) => ({
        id: nanoid(),
        type: 'flowedge',
        data: createEdgeData(getType, sourceType, targetType),
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
    });

    const handleConnection = useCallback((connection: Connection) => {
        const sourceNode = getNode(connection.source);
        const targetNode = getNode(connection.target);
        if (!sourceNode || !targetNode) return;

        const sourceOutput = sourceNode.data.spec.outputs.find((o: Socket) => o.name === connection.sourceHandle);
        const targetInput = targetNode.data.spec.inputs.find((i: Socket) => i.name === connection.targetHandle);
        if (!sourceOutput || !targetInput) return;

        try {
            const subst = unify(sourceOutput.type, targetInput.type);

            if (!subst) return;

            const applyToSockets = (sockets: Socket[]) =>
                sockets.map((socket) => ({ ...socket, type: apply(subst, socket.type) }));

            sourceNode.data.spec.inputs = applyToSockets(sourceNode.data.spec.inputs);
            sourceNode.data.spec.outputs = applyToSockets(sourceNode.data.spec.outputs);
            targetNode.data.spec.inputs = applyToSockets(targetNode.data.spec.inputs);
            targetNode.data.spec.outputs = applyToSockets(targetNode.data.spec.outputs);

            updateNodeData(sourceNode.id, sourceNode.data);
            updateNodeData(targetNode.id, targetNode.data);

            const sourceOutput2 = sourceNode.data.spec.outputs.find((o: Socket) => o.name === connection.sourceHandle);
            const targetInput2 = targetNode.data.spec.inputs.find((i: Socket) => i.name === connection.targetHandle);

            const edge = createEdge(connection, sourceOutput2.type, targetInput2.type);
            onEdgesChange([{ type: 'add', item: edge }]);

            return edge;

        } catch (e) {
            log_error(e.message);
            throw new Error(e.message);
        }
    }, [getNode, report_error, updateNodeData, onEdgesChange]);

    function adaptSpecField(targetNode, sourceNode, sourceHandle, fieldKey, mergeStrategy) {
        if (!sourceNode) {
            log_error(`Source node not found for handle: ${sourceHandle}`);
            return false;
        }

        const sourceOutput = sourceNode.data.spec.outputs.find((o: Socket) => o.name === sourceHandle);
        if (!sourceOutput) {
            log_error(`Source output not found for handle: ${sourceHandle}`);
            return false;
        }

        const type = sourceOutput.type.tcon.name;
        if (type.startsWith("struct")) {
            const struct = [...schemas, ...structs].find((s) => s.name === type);
            if (struct) {
                targetNode.data.spec[fieldKey] = mergeStrategy(targetNode.data.spec[fieldKey], struct.schema);
                return true;
            } else {
                log_error(`Struct not found for type: ${type}`);
            }
        } else {
            log_error(`Type Mismatch: Type '${type}' is not a struct`);
        }
        return false;
    }

    const onConnect = useCallback((connection: Connection) => {
        try {
            const targetNode = getNode(connection.target);
            if (!targetNode) {
                log_error(`Target node not found for connection: ${connection.target}`);
                return;
            }

            const targetInput = [...targetNode.data.spec.inputs];

            const edge = handleConnection(connection);
            if (!edge) {
                log_error(`Failed to create edge for connection: ${connection}`);
                return;
            }


            if (targetNode?.data.spec.adapt_output == connection.targetHandle) {
                const sourceNode = getNode(connection.source);
                const didAdapt = adaptSpecField(
                    targetNode,
                    sourceNode,
                    connection.sourceHandle,
                    'outputs',
                    (original, schema) => schema
                );

                if (!didAdapt) {
                    targetNode.data.spec.inputs = targetInput;
                    setEdges((edges) => edges.filter((e) => e.id !== edge.id));
                }
            }

            if (targetNode?.data.spec.adapt_input == connection.targetHandle) {
                const sourceNode = getNode(connection.source);
                const didAdapt = adaptSpecField(
                    targetNode,
                    sourceNode,
                    connection.sourceHandle,
                    'inputs',
                    (original, schema) => original.concat(schema) // stop concat
                );

                if (!didAdapt) {
                    targetNode.data.spec.inputs = targetInput;
                    setEdges((edges) => edges.filter((e) => e.id !== edge.id));
                } else {
                    updateNodeData(targetNode.id, {
                        ...targetNode.data,
                        spec: {
                            ...targetNode.data.spec,
                            adapt_input: false
                        }
                    })
                }
            }
        } catch (e) {
        }
    }, [handleConnection, getNode, setEdges, structs]);

    const onReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback(
        (oldEdge, newConnection) => {
            edgeReconnectSuccessful.current = true;

            setEdges((edges) => edges.filter((e) => e.id !== oldEdge.id));

            const connection = {
                source: oldEdge.source,
                sourceHandle: oldEdge.sourceHandle,
                target: newConnection.target,
                targetHandle: newConnection.targetHandle,
            };

            handleConnection(connection);
        },
        [handleConnection],
    );

    const onReconnectEnd = useCallback(
        (_, edge) => {
            if (!edgeReconnectSuccessful.current) {
                setEdges((edges) => edges.filter((e) => e.id !== edge.id));
            }
            edgeReconnectSuccessful.current = true;
        },
        [setEdges],
    );

    useEffect(() => {
        defs["add_node"] = {
            type: "function",
            signature: "",
            exec: (args: any[]) => {
                const node = getSpecNode(args[0])
                return handleAddNode(node, args[1]);
            }
        }

        defs["get_node"] = {
            type: "function",
            signature: "",
            exec: (args: any[]) => {
                const node = getNode(args[0])
                console.log(node);
            }
        }

        defs["connect_edge"] = {
            type: "function",
            signature: "",
            exec: (args: any[]) => {
                onConnect(args[0]);
            }
        }

        defs["add_variable"] = {
            type: "function",
            signature: "(name: string, type: string) -> variable",
            exec: (args: any[]) => {
                const value = typeof args[2] == "object" ? args[2].map(v => JSON.stringify(v, null, 2)) : args[2];
                return addVariable(args[0], parse(args[1]), value);
            }
        }

        defs["get_variable"] = {
            type: "function",
            signature: "(variable: variable) -> node",
            exec: (args: any[]) => {
                let variable = args[0];
                return handleAddNode({
                    type: "variable/get",
                    data: {
                        variableId: variable.id,
                    },
                    ...createGetNodeSpec(variable)
                }, args[1])
            }
        }

        defs["add_struct"] = {
            type: "function",
            signature: "",
            exec: (args: any[]) => {
                return addStruct(args[0], Object.entries(args[1]).map(([key, value]) => {
                    return {
                        name: key,
                        type: parse(value)
                    }
                }));
            }
        }

    }, [handleAddNode, getNode, onConnect, addVariable, addStruct])

    const onLayout = useCallback(
        () => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                nodes,
                edges,
                "LR"
            );

            setNodesInStore([...layoutedNodes]);
            setEdgesInStore([...layoutedEdges]);
        },
        [nodes, edges]
    );

    return (
        <ResizablePanelGroup direction="horizontal" style={{ height: '94%' }}>
            <ResizablePanel className="h-full">
                <div className="flex justify-end p-2 bg-transparent h-10">
                    <TooltipComponent
                        description={"re-arrange"}
                        side="left">
                        <Button
                            variant={"ghost"}
                            size="icon"
                            className=""
                            onClick={() => onLayout()}>
                            <AlignHorizontalJustifyStart />
                        </Button>
                    </TooltipComponent>
                </div>
                <ReactFlow
                    className="h-full"
                    nodeTypes={customNodeTypes}
                    edgeTypes={EDGE_TYPES}
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={onNodeClick}
                    onConnect={onConnect}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onReconnect={onReconnect}
                    onReconnectStart={onReconnectStart}
                    onReconnectEnd={onReconnectEnd}
                    proOptions={{
                        hideAttribution: true
                    }}
                >
                    <Background color="#434343" />
                </ReactFlow>
            </ResizablePanel>
            <ResizableHandle className="hover:bg-sky-500" />
            <ResizablePanel defaultSize={30} collapsible className="bg-background h-full">
                <NodeBar onSelectNode={handleAddNode} store={store} />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}