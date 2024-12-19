import { create } from "zustand";

export type Error = {
    severity: "error" | "warning" | "info" | "success";
    message: string;
    timestamp: number;
};

type ErrorStore = {
    errors: Error[];
    log_error: (message: string) => void;
    log_warning: (message: string) => void;
    log_info: (message: string) => void;
    log_success: (message: string) => void;
    addError: (error: Omit<Error, "timestamp">) => void;
    removeError: (timestamp: number) => void;
    clearErrors: () => void;
};

export const useErrorStore = create<ErrorStore>((set, get) => ({
    errors: [],

    log_error: (message: string) => {
        get().addError({ severity: "error", message });
    },

    log_warning: (message: string) => {
        get().addError({ severity: "warning", message });
    },

    log_info: (message: string) => {
        get().addError({ severity: "info", message });
    },

    log_success: (message: string) => {
        get().addError({ severity: "success", message });
    },

    addError: (error) =>
        set((state) => ({
            errors: [...state.errors, { ...error, timestamp: Date.now() }]
        })),

    removeError: (timestamp) =>
        set((state) => ({
            errors: state.errors.filter((e) => e.timestamp !== timestamp)
        })),

    clearErrors: () => set({ errors: [] }),
}));
