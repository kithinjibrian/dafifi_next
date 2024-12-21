import { report_error, request } from "@/utils/request";
import { StateCreator } from "zustand";
import { nanoid } from "nanoid";
import { parse } from "@/utils/compiler";

export type tableSchema = {
    columnName: string,
    dataType: string,
    constraints?: {
        primaryKey?: boolean,
        primaryKeyStrategy?: "uuid" | "auto-increment" | "custom"
    }
}

export interface Schema {
    id: number,
    tableName: string,
    tableSchema: tableSchema[]
}

export interface SchemaStoreDTO {
    schemas: Schema[];
    rawSchemas: any[];
    createSchema: (data: any) => Promise<Schema>;
    fetchSchemas: (projectId: number) => Promise<void>;
    fetchSchema: (id: number) => Promise<void>;
    renameSchema: (data: any) => Promise<void>;
}

export const createSchemaSlice: StateCreator<
    SchemaStoreDTO,
    [],
    [],
    SchemaStoreDTO
> = (set, get) => ({
    schemas: [],
    rawSchemas: [],
    fetchSchemas: async (projectId: number) => {
        try {
            const response = await request.get(`/project/${projectId}/schemas`);
            set({
                schemas: response.data.schemas,
                rawSchemas: response.data.schemas.map((x: any) => {
                    return {
                        id: nanoid(),
                        name: `struct ${x.tableName}Schema`,
                        color: "blue",
                        isSchema: true,
                        schema: x.tableSchema.map((y: any) => {
                            return {
                                name: y.columnName,
                                type: parse(y.dataType)
                            }
                        })
                    }
                })
            });
        } catch (e) {
            report_error(e);
        }
    },
    fetchSchema: async (id: number) => {
        try {
            const response = await request.get(`/table/schema?tableId=${id}`);
            const schema = response.data;

            set(state => ({
                schemas: state.schemas.map((x: any) =>
                    x.id === id ? schema : x
                )
            }));

        } catch (e) {
            report_error(e);
        }
    },
    createSchema: async (data: any) => {
        try {
            const response = await request.post(`/table/create`, data);
            set({ schemas: [...get().schemas, response.data] });
            return response.data;
        } catch (e) {
            report_error(e);
        }
    },
    renameSchema: async ({ tableId, tableName }) => {
        try {
            const response = await request.post(`/table/rename`, {
                tableName,
                tableId
            });

            set(state => ({
                schemas: state.schemas.map((x: any) =>
                    x.id === tableId ? response.data : x
                )
            }));
        } catch (e) {
            report_error(e);
        }
    },
    getSchema: (id: number) => {
        return get().schemas.find((x: any) => x.id === id);
    }
})