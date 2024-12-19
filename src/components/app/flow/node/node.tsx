import { NodeContainer } from "./node-container"

export type NodeProps = {
    id: any;
    data: any;
    selected: boolean,
    store: any
}

export const Node: React.FC<NodeProps> = ({
    id,
    data,
    selected,
    store
}) => {

    return (
        <NodeContainer
            id={id}
            data={data}
            store={store}
            selected={selected}
        >
        </NodeContainer>
    )
}
