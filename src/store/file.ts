import { report_error, request } from "@/utils/request";
import { StateCreator, StoreApi, UseBoundStore } from "zustand";

export interface FileDTO {
    id: number;
    uuid: string;
    name: string;
    ext?: string;
    type: string;
    path?: string;
    parent?: string;
    children?: FileDTO[];
    store?: UseBoundStore<StoreApi<any>> | null;
}

export interface FileStoreDTO {
    files: FileDTO[];
    fetchFiles: (projectId: number) => Promise<void>;
}

export const createFileSlice: StateCreator<
    FileStoreDTO,
    [],
    [],
    FileStoreDTO
> = (set) => ({
    files: [],
    fetchFiles: async (projectId: number) => {
        try {
            const response = await request.get(`/project/${projectId}/files`);
            set({ files: response.data.files });
        } catch (e) {
            report_error(e);
        }
    }
})