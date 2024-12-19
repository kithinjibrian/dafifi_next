import { FlowState } from "@/store/flow";
import { StoreApi, UseBoundStore } from "zustand";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Struct } from "./struct";
import { useProjectStore } from "@/store/project";
import { useEffect, useMemo } from "react";

export const StructTab = ({
    store,
    onSelectNode
}: {
    store: UseBoundStore<StoreApi<FlowState>>
}) => {
    const { rawSchemas } = useProjectStore();
    const { structs, addStruct, setSchemas, updateStruct } = store();

    const new_struct = useMemo(() => [...rawSchemas, ...structs], [rawSchemas, structs]);

    useEffect(() => {
        setSchemas(rawSchemas);
    }, []);

    return (
        <div className="h-full w-full">
            <div className="p-2 border-b flex items-center justify-center">
                <Button
                    className="bg-sky-500 text-foreground"
                    onClick={() => addStruct()}>
                    Create Struct
                </Button>
            </div>
            <ScrollArea
                style={{ height: "80%" }}
                className="p-2 space-y-2">
                {new_struct.map((struct, index) => (
                    <Struct
                        key={struct.id}
                        store={store}
                        struct={struct}
                        onSelectNode={onSelectNode}
                    />
                ))}
            </ScrollArea>
        </div >
    );
};