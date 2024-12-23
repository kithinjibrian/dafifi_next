import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable";

import {
    ReactFlow,
    Background,
    Connection
} from '@xyflow/react';
import { FlowEdge } from "./node/flow-edge";
import { useCallback, useRef } from "react";
import { useProjectStore } from "@/store/project";
import { nanoid } from "nanoid";
import { Socket, Type } from "@/store/flow";
import { report_error } from "@/utils/request";
import { apply, unify } from "@/utils/type";
import { NodeBar } from "./node-bar";

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

export const Flow = ({ store, customNodeTypes }) => {

    const edgeReconnectSuccessful = useRef(true);

    const { project } = useProjectStore();

    const {
        nodes,
        edges,
        structs,
        schemas,
        getNode,
        setEdges,
        selectedNode,
        onNodesChange,
        onEdgesChange,
        setSelectedNode,
        getType,
        updateNodeData,
    } = store();

    const onNodeClick = useCallback((_, node) => setSelectedNode(node), [setSelectedNode]);

    const handleAddNode = useCallback(
        (node: any, position: { x: number; y: number } | null = null) => {
            const lastPosition = selectedNode ? selectedNode.position : { x: 0, y: 0 };

            const newPosition = position || {
                x: lastPosition.x + 250,
                y: lastPosition.y,
            };

            const data = {
                ...node.data,
                ...(node.type === 'io/in' ? { projectId: project?.id || -1 } : {}),
            };

            const newNode = { id: nanoid(), type: node.type, position: newPosition, data };

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

            const edge = createEdge(connection, sourceOutput.type, targetInput.type);
            onEdgesChange([{ type: 'add', item: edge }]);

            return edge;

        } catch (e) {
            report_error(e.message);
            throw new Error(e.message);
        }
    }, [getNode, report_error, updateNodeData, onEdgesChange]);

    function adaptSpecField(targetNode, sourceNode, sourceHandle, fieldKey, mergeStrategy) {
        if (!sourceNode) {
            report_error(`Source node not found for handle: ${sourceHandle}`);
            return false;
        }

        const sourceOutput = sourceNode.data.spec.outputs.find((o: Socket) => o.name === sourceHandle);
        if (!sourceOutput) {
            report_error(`Source output not found for handle: ${sourceHandle}`);
            return false;
        }

        const type = sourceOutput.type.tcon.name;
        if (type.startsWith("struct")) {
            const struct = [...schemas, ...structs].find((s) => s.name === type);
            if (struct) {
                targetNode.data.spec[fieldKey] = mergeStrategy(targetNode.data.spec[fieldKey], struct.schema);
                return true;
            } else {
                report_error(`Struct not found for type: ${type}`);
            }
        } else {
            report_error(`Type Mismatch: Type '${type}' is not a struct`);
        }
        return false;
    }

    const onConnect = useCallback((connection: Connection) => {
        try {
            const targetNode = getNode(connection.target);
            if (!targetNode) {
                report_error(`Target node not found for connection: ${connection.target}`);
                return;
            }

            const targetInput = [...targetNode.data.spec.inputs];
            const edge = handleConnection(connection);
            if (!edge) {
                report_error(`Failed to create edge for connection: ${connection}`);
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
                    (original, schema) => original.concat(schema)
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

    return (
        <ResizablePanelGroup direction="horizontal" style={{ height: '94%' }}>
            <ResizablePanel className="h-full">
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