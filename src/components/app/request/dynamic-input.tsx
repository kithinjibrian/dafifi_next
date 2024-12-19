import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

export const DynamicInputs = ({
    items = [],
    onAdd,
    onRemove,
    onUpdate,
    keyPlaceholder = "Key",
    valuePlaceholder = "Value"
}) => {
    return (
        <div className="space-y-2">
            {items.map((item, index) => (
                <div key={index} className="flex space-x-2">
                    <Input
                        placeholder={keyPlaceholder}
                        value={item.key}
                        onChange={(e) => onUpdate(index, 'key', e.target.value)}
                        className="flex-1"
                    />
                    <Input
                        placeholder={valuePlaceholder}
                        value={item.value}
                        onChange={(e) => onUpdate(index, 'value', e.target.value)}
                        className="flex-1"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => onRemove(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button
                variant="outline"
                onClick={onAdd}
                className="w-full bg-card text-foreground"
            >
                <Plus className="mr-2 h-4 w-4" /> Add {keyPlaceholder}
            </Button>
        </div>
    );
};