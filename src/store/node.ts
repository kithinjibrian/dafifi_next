import { report_error, request } from "@/utils/request"
import { StateCreator } from "zustand"

interface socket {
    name: string,
    valueType: string
}

interface node {
    type: string,
    label: string,
    inputs: socket[],
    outputs: socket[]
}

interface category {
    category: string,
    nodes: node[]
}

export interface NodeStoreDTO {
    specs: category[],
    setSpecs: (specs: category[]) => void,
    fetchSpecNodes: (id: number) => void,
    getSpecNode: (type: string) => any
}

export const createNodeSlice: StateCreator<
    NodeStoreDTO,
    [],
    [],
    NodeStoreDTO
> = (set, get) => ({
    specs: [],
    setSpecs: (specs: category[]) => set({ specs }),
    fetchSpecNodes: async (id: number) => {
        try {
            const response = await request.get(`project/nodes/${id}`);
            set({ specs: response.data });
        } catch (e) {
            report_error(e);
        }
    },
    getSpecNode: (type: string) => {
        const all = get().specs.flatMap((x: any) => x.children);
        return all.find((x: any) => x.type === type);
    }
})