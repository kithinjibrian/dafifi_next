import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEditor } from "@craftjs/core";
import { Eye, Redo2, Save, Undo2 } from "lucide-react";

export const Topbar = () => {
    const { actions, query, enabled } = useEditor((state) => ({
        enabled: state.options.enabled
    }));

    return (
        <div className="w-full border-b p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => actions.history.undo()}
                >
                    <Undo2 className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => actions.history.redo()}
                >
                    <Redo2 className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                    variant={enabled ? "outline" : "default"}
                    size="sm"
                    onClick={() => actions.setOptions(options => options.enabled = !enabled)}
                    className="gap-2"
                >
                    <Eye className="h-4 w-4" />
                    {enabled ? "Preview" : "Edit"}
                </Button>
            </div>

            <Button
                variant="default"
                size="sm"
                className="gap-2"
                onClick={() => {
                    const json = query.serialize();
                    console.log(json);
                }}
            >
                <Save className="h-4 w-4" />
                Save
            </Button>
        </div>
    );
};