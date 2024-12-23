import { Edge } from "@xyflow/react";

export const isHandleConnected = (
    edges: Edge[],
    nodeId: string,
    handleId: string,
    type: "source" | "target"
) => {
    return edges.some(
        (edge) => edge[type] === nodeId && edge[`${type}Handle`] === handleId
    );
};