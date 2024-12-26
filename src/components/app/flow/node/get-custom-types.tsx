import { parse } from "@/utils/compiler";
import { NodeTypes } from "@xyflow/react";

import { Node } from "./node";

export const getCustomTypes = (specs, store) => {
    const allNodes = specs.flatMap((x: any) => x.children);

    return allNodes.reduce((acc: any, node: any) => {
        const inputs = node.inputs;
        const outputs = node.outputs;

        if (inputs && inputs.length > 0) {
            inputs.forEach((input: any) => {
                if (typeof input.type === "string") {
                    input.type = parse(input.type);
                }
            });
        }

        if (outputs && outputs.length > 0) {
            outputs.forEach((output: any) => {
                if (typeof output.type === "string") {
                    output.type = parse(output.type);
                }
            });
        }


        acc[node.type] = (props) => {

            if (!node.own_spec) {
                props.data.spec = node;
            }

            return (
                <Node store={store} {...props} />
            );
        };
        return acc
    }, {} as NodeTypes);
}