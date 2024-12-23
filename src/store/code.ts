import { report_error, request } from "@/utils/request";
import { create } from "zustand";
import { FileDTO } from "./file";
import { debounce } from "@/utils/debounce";

export interface CodeStoreDTO {
    id: number;
    data: string;
    setData: (value: string) => void;
}

const push = debounce(async (state) => {
    try {
        await request.post("/file/save", {
            id: state.id,
            data: state.data
        })
    } catch (e) {
        report_error(e)
    }
}, 1000);

export const createCodeStore = async (file: FileDTO) => {
    const response = await request.get(`/file/${file.id}`);
    const data = response.data;
    return create<CodeStoreDTO>((set, get) => ({
        id: data.id,
        data: data.data,
        setData: (value: string) => {
            set(state => {
                const _state = { ...state, data: value };
                push(_state);
                return _state;
            })

        },
        fetchData: async () => {
            try {
                const response = await request.get(`/file/${get().id}`);
                set({ data: response.data.data });
            } catch (e) {
                report_error(e);
            }
        },
    }));
};