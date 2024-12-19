import { useEffect, useState } from "react";
import { useProjectStore } from "@/store/project";
import { Bell, AlertCircle, Info, CheckCircle, AlertTriangle, X } from "lucide-react";
import { useErrorStore, Error } from "@/store/errors";

const severityStyles = {
    error: {
        icon: AlertCircle,
        color: "bg-red-500",
    },
    warning: {
        icon: AlertTriangle,
        color: "bg-yellow-500",
    },
    info: {
        icon: Info,
        color: "bg-blue-500",
    },
    success: {
        icon: CheckCircle,
        color: "bg-green-500",
    },
};

export const StatusBar = () => {
    const { project } = useProjectStore();
    const { errors, removeError } = useErrorStore();

    const [currentError, setCurrentError] = useState<Error | null>(errors[0] || null);

    useEffect(() => {
        if (errors.length > 0) {
            const newestError = errors[errors.length - 1];
            setCurrentError(newestError);

            const timer = setTimeout(() => {
                setCurrentError(null);
                removeError(newestError.timestamp); // Automatically remove the error after the timer
            }, 7000);

            return () => clearTimeout(timer);
        }
    }, [errors, removeError]);

    const dismissError = () => {
        if (currentError) {
            removeError(currentError.timestamp);
            setCurrentError(null);
        }
    };

    const RenderError = () => {
        if (!currentError) return null;

        const { severity, message } = currentError;
        const { icon: Icon, color } = severityStyles[severity];

        return (
            <div
                className={`flex items-center space-x-2 px-4 rounded text-white ${color}`}
            >
                <Icon size={15} />
                <p className="flex-1">{message}</p>
                <button
                    className="p-1 bg-white/20 rounded-full hover:bg-white/40 transition"
                    onClick={dismissError}
                    aria-label="Dismiss error"
                >
                    <X size={15} />
                </button>
            </div>
        );
    };

    return (
        <div className="flex w-full border h-[25px] items-center px-2">
            <p className="mr-4">
                <Bell size={15} />
            </p>
            <p className="mr-4">state: {project?.state}</p>
            <RenderError />
        </div>
    );
};
