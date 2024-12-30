import { report_error, request } from "@/utils/request";
import { FileDTO } from "./file";
import { create, StateCreator } from "zustand";
import debounce from "debounce";
import { renderToHTML } from "@/components/app/gui/utils/toHtml";

const push = debounce(async (state) => {
    try {
        const data = {
            type: state.type,
            json: state.json,
            html: state.html
        }

        await request.post("/file/save", {
            id: state.id,
            data: JSON.stringify(data, null, 2)
        });

    } catch (e) {
        report_error(e)
    }
}, 1000);

const createTabSlice: StateCreator<
    any,
    [],
    [],
    any
> = (set, get) => ({
    tab: "setActiveTab",
    data: null,
    setActiveTab: (name: string, data: any) => set({ name, data })
})

export const createGuiStore = async (_file: FileDTO) => {
    const response = await request.get(`/file/${_file.id}`);
    const file = response.data;

    const { id, data } = file || {};
    const {
        type = "DAFIFIUI",
        json = "",
        html = ""
    } = JSON.parse(data) || {};

    return create((set, get) => ({
        id,
        type,
        json,
        html,
        tab: "Add Templates",
        tabData: null,
        setActiveTab: (tab: string, tabData: any = null) => set({ tab, tabData }),
        fetchData: async () => {
            try {
                const response = await request.get(`/file/${id}`);
                const { nodes, edges } = response.data.data;
                set({ nodes, edges });
            } catch (e) {
                report_error(e);
            }
        },
        setData: (json, html) => {
            set({
                json,
                html
            })
            push(get())
        },
    }))
}