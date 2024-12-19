import { create } from "zustand";
import { FileDTO } from "./file";
import { report_error, request } from "@/utils/request";

export type TableStoreDTO = {
    records: Record<string, any>[],
    insertRecord: (record: Record<string, any>) => Promise<void>
}

export const createTableStore = async (file: FileDTO) => {
    const response = await request.get(`/table/query?tableId=${file.id}`);
    return create((set, get) => ({
        tableId: file.id,
        records: response.data.map((i: { data: Record<string, any> }) => i.data),
        insertRecord: async (record: Record<string, any>) => {
            try {
                await request.post(`/table/insert`, { tableId: file.id, recordData: record });
                const response = await request.get(`/table/query?tableId=${file.id}`);
                set({ records: response.data.map((i: { data: Record<string, any> }) => i.data) });
            } catch (e) {
                report_error(e);
            }
        },
        updateRecord: async (where: Record<string, any>, record: Record<string, any>) => {
            try {
                await request.post(`/table/update`, {
                    tableId: file.id,
                    where,
                    recordData: record
                });

                const response = await request.get(`/table/query?tableId=${file.id}`);
                set({ records: response.data.map((i: { data: Record<string, any> }) => i.data) });
            } catch (e) {
                report_error(e);
            }
        },
        addColumn: async (column) => {
            try {
                await request.post(`/table/alter`, {
                    tableId: file.id,
                    action: "add",
                    tableSchema: [column]
                });

                return true;
            } catch (e) {
                report_error(e);
                throw new Error(e.message);
            }
        }
    }));
}