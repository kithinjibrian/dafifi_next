import { create } from "zustand";
import {
    Edge,
    addEdge,
    Connection,
    EdgeChange,
    NodeChange,
    applyEdgeChanges,
    applyNodeChanges,
} from "@xyflow/react";
import { report_error, request } from "@/utils/request";
import { nanoid } from "nanoid";
import { FileDTO } from "./file";
import debounce from "debounce";
import { showTypeClass, structTypeClass, Types } from "@kithinji/nac";
import { anyTypeClass } from "@/utils/compiler";

export interface Variable {
    id: string;
    name: string;
    type: Types;
    initialValue: any;
}

export interface Struct {
    id: string;
    name: string;
    color: string;
    schema: { name: string, type: Types }[];
}

export type Socket = {
    name: string;
    type: Types;
    isVisible?: boolean;
};

export type Node = {
    id: string;
    name: string;
    color: string;
    inputs: Socket[];
    outputs: Socket[];
    position: { x: number; y: number };
    data: {
        spec: {
            label: string;
            inputs: Socket[];
            outputs: Socket[];
            variableId?: string;
        };
        [key: string]: any;
    }
}

export interface FlowState {
    id: string;
    nodes: Node[];
    edges: Edge[];
    variables: Variable[];
    structs: any[];
    schemas: Struct[];
    tab: string;
    selectedNode: Node | null;

    // State modifiers
    setActiveTab: (tab: string) => void;
    setSelectedNode: (node: Node | null) => void;

    // Node and edge management
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    setNodesInStore: (nodes: Node[]) => void;
    setEdgesInStore: (edges: Edge[]) => void;

    // Struct management
    addStruct: (name?: string, schema?: Types[]) => void;
    updateStruct: (id: string, value: Partial<Struct>) => void;
    setSchemas: (schemas: Struct[]) => void;

    // Variable management
    addVariable: (name?: string, type?: Types) => void;
    updateVariable: (id: string, value: Partial<Variable>) => void;

    // Node-specific methods
    updateNodeData: (id: string, value: Partial<Node["data"]>) => void;
    getNode: (id: string) => Node | undefined;

    // Data persistence
    fetchData: () => Promise<void>;
    pushData: () => Promise<void>;

    getType: (type: Types) => string;
    getTypes: () => string[];
}

// Debounced push function to control server updates
const push = debounce(async (state: FlowState) => {
    try {
        const data = {
            nodes: state.nodes.map((node) => {
                const { data, selected, dragging, ...rest } = node;

                if (!data.spec.own_spec) {
                    const { label, collapse } = data.spec;
                    return {
                        ...rest,
                        data: { ...data, spec: { label, collapse } },
                    };
                }

                if (data.spec.hasOwnProperty("adapt_input")) {
                    // delete data.spec.adapt_input;
                }

                return {
                    ...rest,
                    data,
                };
            }),
            edges: state.edges,
            structs: state.structs,
            schemas: state.schemas,
            variables: state.variables,
        };

        await request.post("/file/save", {
            id: state.id,
            data: JSON.stringify(data, null, 4),
        });
    } catch (e) {
        report_error(e);
    }
}, 1000);

export const createFlowStore = async (_file: FileDTO) => {

    const response = await request.get(`/file/${_file.id}`);
    const file = response.data;

    const { id, data } = file || {};
    const { schemas = [], nodes = [], edges = [], variables = [], structs = [] } = data || {};

    return create<FlowState>((set, get) => ({
        id,
        nodes,
        edges,
        structs,
        schemas,
        variables,
        tab: "Add Nodes",
        selectedNode: null,

        // Tab management
        setActiveTab: (tab) => set({ tab }),

        // Node and edge management
        onNodesChange: (changes) => {
            set((state) => ({
                nodes: applyNodeChanges(changes, state.nodes),
            }));
            push(get());
        },
        onEdgesChange: (changes) => {
            set((state) => ({
                edges: applyEdgeChanges(changes, state.edges),
            }));
            push(get());
        },
        onConnect: (connection) => {
            set((state) => ({
                edges: addEdge(connection, state.edges),
            }));
            push(get());
        },
        setNodesInStore: (nodes: Node[]) => {
            set({ nodes })
            push(get());
        },
        setEdgesInStore: (edges: Edge[]) => {
            set({ edges })
            push(get());
        },

        setSchemas: (schemas: Struct[]) => {
            set(() => ({
                schemas: [...schemas],
            }));
            push(get());
        },

        addStruct: (name?: string, types: Record<string, Types> = {}) => {
            const struct = get().structs.find((s) => s.name == name);

            if (struct)
                return struct;

            set((state) => ({
                structs: [
                    ...(state.structs || []),
                    {
                        tag: "TRec",
                        id: nanoid(),
                        color: "magenta",
                        trec: {
                            name: name ?? "NewStruct",
                            types,
                            constraints: [showTypeClass, structTypeClass, anyTypeClass]
                        }
                    },
                ],
            }));
            push(get());
        },

        deleteStruct: (id) => {
            set((state) => {
                return {
                    structs: state.structs.filter(struct => struct.id !== id)
                }
            })

            push(get());
        },
        updateStruct: (id, value) => {
            set((state) => {
                const index = state.structs.findIndex((struct) => struct.id === id);
                if (index === -1) return state;

                const updatedStructs = [...state.structs];
                updatedStructs[index] = { ...state.structs[index], ...value };

                return { structs: updatedStructs };
            });
            push(get());
        },

        // Variable management
        addVariable: (name?: string, type?: Types, value: any = null) => {
            const va = get().variables.find(v => v.name == name);

            if (va) {
                return va;
            }

            let variable = {
                id: nanoid(),
                name: name ?? `MyVar${get().variables.length}`,
                initialValue: value,
                type: type ?? {
                    tag: "TCon",
                    tcon: {
                        name: "integer",
                        types: [],
                    }
                }
            }
            set((state) => ({
                variables: [
                    ...state.variables,
                    variable,
                ],
            }));
            push(get());

            return variable;
        },

        deleteVariable: (id) => {
            set((state) => {
                return {
                    variables: state.variables.filter(variable => variable.id !== id)
                }
            })

            push(get());
        },
        updateVariable: (id, value) => {
            set((state) => {
                const index = state.variables.findIndex((variable) => variable.id === id);
                if (index === -1) return state;

                const updatedVariables = [...state.variables];
                updatedVariables[index] = { ...state.variables[index], ...value };

                return { variables: updatedVariables };
            });
            push(get());
        },

        // Node-specific methods
        updateNodeData: (id, updateFn) => {
            set((state) => {
                const updatedNodes = state.nodes.map((node) => {
                    if (node.id !== id) return node;

                    // If updateFn is a function, call it with current node data
                    const updates = typeof updateFn === 'function'
                        ? updateFn(node.data)
                        : updateFn;

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...updates
                        }
                    };
                });

                return { nodes: updatedNodes };
            });

            push(get());
        },
        getNode: (id) => get().nodes.find((node) => node.id === id),

        // Data persistence
        fetchData: async () => {
            try {
                const response = await request.get(`/file/${id}`);
                const { nodes, edges } = response.data.data;
                set({ nodes, edges });
            } catch (e) {
                report_error(e);
            }
        },
        pushData: async () => {
            await push(get());
        },

        // Selected node
        setSelectedNode: (node) => set({ selectedNode: node }),

        // get types
        getTypes: () => {
            const basic = [
                "integer",
                "float",
                "string",
                "boolean",
                "flow"
            ]

            const c = [...get().schemas, ...get().structs];

            c.forEach((struct) => {
                basic.push(struct.name);
            });

            return basic
        },
        getType: (type: Types) => {
            const basic: Record<string, string> = {
                integer: "green",
                float: "cyan",
                string: "gold",
                boolean: "red",
                flow: "dodgerblue",
                nac: "teal",
                any: "grey"
            }

            const c = [...get().schemas, ...get().structs];

            c.forEach((struct) => {
                basic[struct.trec.name] = struct.color;
            });

            if (type.tag == "TCon") {
                const types = type.tcon.types;
                if (types.length > 0) {
                    const _t = types[0];
                    if (_t.tag == "TVar") {
                        return basic["any"];
                    }
                    return get().getType(_t);
                }

                return basic[type.tcon.name];
            } else if (type.tag == "TRec") {
                return basic[type.trec.name]
            }

            return basic["any"];
        }
    }));
};
