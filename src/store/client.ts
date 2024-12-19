import { create } from "zustand";

type Methods =
    "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

export type ClientStore = {
    method: Methods,
    url: string,
    headers?: Record<string, any>[],
    query?: Record<string, any>[],
    data?: any,
    bodyType?: any,
    bodyContent?: any
}

export const createClientStore = (data) => {
    return create<ClientStore>((set, get) => ({
        method: "GET" as Methods,
        url: "",
        bodyType: "JSON",
        bodyContent: "",
        headers: [
            {
                key: 'Accept',
                value: '*/*'
            },
            {
                key: 'User-Agent',
                value: 'Dafifi Client'
            },
        ],
        query: [
            {
                key: '',
                value: ''
            }
        ],
        data: undefined,
        setMethod: (method: Methods) => {
            set({ method: method })
        },
        setUrl: (url: string) => {
            set({ url });
        },
        setQuery: (query: { key: string, value: any }[]) => {
            set({ query });
        },
        setHeaders: (headers: { key: string, value: any }[]) => {
            set({ headers })
        },
        setBodyType: (bodyType: string) => {
            set({ bodyType });
        },
        setBodyContent: (bodyContent: any) => {
            set({ bodyContent });
        },
    }))
}