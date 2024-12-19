import { Button } from "@/components/ui/button";

import { Variable } from './variable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StoreApi, UseBoundStore } from 'zustand';
import { FlowState } from '@/store/flow';

export const VariableTab = ({
    store,
    onSelectNode,
}: {
    store: UseBoundStore<StoreApi<FlowState>>
}) => {

    const { variables, addVariable } = store();

    return (
        <div className="h-full w-full">
            <div className="p-2 border-b flex items-center justify-center">
                <Button
                    className="bg-sky-500 text-foreground"
                    onClick={() => addVariable()}>
                    Create Variable
                </Button>
            </div>
            <ScrollArea
                style={{ height: "80%" }}
                className="p-2 space-y-2">
                {variables.map((variable, index) => (
                    <Variable
                        key={index}
                        store={store}
                        variable={variable}
                        onSelectNode={onSelectNode}
                    />
                ))}
            </ScrollArea>
        </div >
    );
};