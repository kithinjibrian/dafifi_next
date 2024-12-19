import { StateCreator } from "zustand";

import { FileDTO } from "./file";
import { nanoid } from "nanoid";
import { createClientStore } from "./client";
import { createCodeStore } from "./code";
import { createTableStore } from "./table";
import { createFlowStore } from "./flow";


export interface TabStoreDTO {
    tabs: FileDTO[],
    activeTab: string,
    addTab: (file: FileDTO) => void,
    removeTab: (id: string) => void,
    setActiveTab: (id: string) => void,
}

const createStore = async (file: FileDTO | undefined) => {
    if (!file || !file.ext) return null;

    switch (file.ext) {
        case "flw": {
            return createFlowStore(file);
        }
        case "txt": {
            return createCodeStore(file);
        }
        case "req": {
            return createClientStore(null);
        }
        case "tab": {
            return createTableStore(file);
        }
        default:
            return null;
    }
}

const welcomeUUID = nanoid();

export const createTabSlice: StateCreator<
    TabStoreDTO,
    [],
    [],
    TabStoreDTO
> = (set, get) => ({
    tabs: [{
        id: -1,
        uuid: welcomeUUID,
        name: "Welcome",
        ext: "wlc",
        type: "file"
    }],
    activeTab: welcomeUUID,
    setActiveTab: (uuid: string) => set({ activeTab: uuid }),
    addTab: async (file: FileDTO) => {
        const tabExists = get().tabs.some(tab => tab.uuid === file.uuid);

        if (tabExists) {
            set({ activeTab: file.uuid });
            return;
        }

        if (!file.store) {
            file.store = await createStore(file);
        }

        const updateTabs = [...get().tabs];
        const activeTabIndex = get().tabs.findIndex((tab) => tab.id === +get().activeTab);

        if (activeTabIndex !== -1) {
            updateTabs.splice(activeTabIndex + 1, 0, file);
        } else {
            updateTabs.push(file);
        }

        set({
            tabs: updateTabs,
            activeTab: file.uuid
        })
    },
    removeTab: (uuid: string) => {
        set({
            tabs: get().tabs.filter((tab) => tab.uuid !== uuid),
            activeTab: get().activeTab === uuid ? get().tabs[0].uuid : get().activeTab
        })
    }
})
