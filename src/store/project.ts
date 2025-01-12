import { report_error, request } from "@/utils/request";
import { create, StateCreator } from "zustand";
import { createFileSlice, FileStoreDTO } from "./file";
import { createTabSlice, TabStoreDTO } from "./tab";
import { createSchemaSlice, SchemaStoreDTO } from "./schema";
import { createNodeSlice, NodeStoreDTO } from "./node";

export interface Project {
    id: number;
    name: string;
    startFile: string;
    description: string;
    state: 'running' | 'debugging' | 'stopped' | 'crashed';
}

export interface ProjectStore {
    project: Project | null;
    path: string[];
    setPath: (arr: string[]) => void;
    fetchProject: (id: number) => Promise<void>;
    updateProject: (data: any) => Promise<void>;
}

const createProjectSlice: StateCreator<
    ProjectStore,
    [],
    [],
    ProjectStore
> = (set: any, get: any) => ({
    project: null,
    path: [],
    setPath: (arr: string[]) => {
        set({ path: [...arr] });
    },
    fetchProject: async (id: number) => {
        try {
            const response = await request.get(`/project/${id}`);
            set({ project: response.data, path: [response.data.name] });
        } catch (e) {
            report_error(e);
        }
    },
    updateProject: async (data: any) => {
        try {
            const response = await request.patch(`/project/${get().project.id}`, data);
            set({ project: response.data });
        } catch (e) {
            report_error(e);
        }
    },
    shareProject: async () => {
        
    }
})

export const useProjectStore = create<
    ProjectStore & FileStoreDTO & TabStoreDTO & SchemaStoreDTO & NodeStoreDTO
>((...a) => ({
    ...createTabSlice(...a),
    ...createFileSlice(...a),
    ...createNodeSlice(...a),
    ...createSchemaSlice(...a),
    ...createProjectSlice(...a),
}))