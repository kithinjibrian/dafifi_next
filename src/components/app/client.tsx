import { useProjectStore } from "@/store/project";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { nanoid } from "nanoid";

const requestUUID = nanoid();

export const Client = () => {
    const { addTab } = useProjectStore();

    return (
        <div className="h-full w-full">
            <div className="p-2 border-b flex items-center justify-center">
                <Button
                    className="bg-sky-500 text-foreground"
                    onClick={async () => {
                        await addTab({
                            id: -2,
                            uuid: requestUUID,
                            name: "New Request",
                            ext: "req",
                            type: "request"
                        })
                    }}>
                    New Request
                </Button>
            </div>
            <ScrollArea
                style={{ height: "80%" }}
                className="p-2 space-y-2">
            </ScrollArea>
        </div >
    )
}