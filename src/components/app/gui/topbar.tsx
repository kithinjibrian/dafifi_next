import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEditor } from "@craftjs/core";
import { Eye, Redo2, Save, Undo2 } from "lucide-react";
import { components } from "./components/components";
import { renderToHTML } from "./utils/toHtml";

export const Topbar = ({ file }) => {
    const { setData } = file.store();

    const { actions, query, enabled } = useEditor((state, query) => ({
        enabled: state.options.enabled,
        canUndo: query.history.canUndo(),
        canRedo: query.history.canRedo(),
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
                    onClick={() => {
                        window.open(
                            `https://public.dafifi.net/f/${file.path}`, 'otherTab');
                    }}
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
                    setData({
                        type: "DAFIFIUI",
                        json,
                        html: renderToHTML(json, components)
                    });
                }}
            >
                <Save className="h-4 w-4" />
                Save
            </Button>
        </div >
    );
};