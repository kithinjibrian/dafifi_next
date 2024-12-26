import { useCallback, useState } from "react";
import { Circle, Settings2, Trash, Plus } from "lucide-react";

import { Types } from "@/components/utils/type";
import { Button } from "@/components/ui/button";
import { PolyInput } from "@/components/utils/poly-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STRUCT_PREFIX = "struct ";

const createToStruct = (type: string) => ({
    label: `To ${type}`,
    own_spec: true,
    category: "Action",
    inputs: [
        {
            name: "value",
            type: {
                tag: "TCon",
                tcon: {
                    name: `struct ${type}`,
                    types: []
                }
            }
        },
    ],
    outputs: [{
        name: "struct",
        type: {
            tag: "TCon",
            tcon: {
                name: `struct ${type}`,
                types: []
            }
        }
    }],
});

export const Struct = ({ store, struct, onSelectNode }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [menu, setMenu] = useState(false);

    const { getTypes, updateStruct } = store();

    // Handlers
    const handleNameChange = useCallback((e) => {
        const name = e.target.innerText;
        updateStruct(struct.id, { name: `${STRUCT_PREFIX}${name}` });
    }, [updateStruct, struct.id]);

    const handleToggleMenu = useCallback(() => setMenu(prevMenu => !prevMenu), []);

    const handleFieldNameChange = useCallback((struct, index, val) => {
        const updatedSchema = struct.schema.map((s, i) =>
            i === index ? { ...s, name: val } : s
        );

        updateStruct(struct.id, { schema: updatedSchema });
    }, [updateStruct, struct.id, struct.schema]);

    const handleAddField = useCallback(() => {
        const schema = [...struct.schema];
        schema.unshift({
            name: `field${schema.length}`,
            type: { tag: "TCon", tcon: { name: "integer", types: [] } },
        });
        updateStruct(struct.id, { schema });
    }, [updateStruct, struct.id, struct.schema]);

    const handleFieldTypeChange = useCallback((name, type) => {
        const updatedSchema = struct.schema.map(s =>
            s.name === name ? { ...s, type } : s
        );
        updateStruct(struct.id, { schema: updatedSchema });
    }, [updateStruct, struct.id, struct.schema]);

    const handleSelectNode = useCallback(() => {
        onSelectNode({
            type: "struct/tostruct",
            ...createToStruct(struct.name.split(" ").slice(1).join(" ") || ""),
        });
    }, [onSelectNode, struct.name]);

    return (
        <div className="border-b">
            <div
                className="flex items-center justify-between group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    role="textbox"
                    aria-label="Edit struct name"
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    className="outline-none focus:border-b focus:border-gray-300 flex items-center truncate"
                    onBlur={handleNameChange}
                >
                    <Circle strokeWidth={0} className="mr-1.5" style={{ fill: struct.color }} />
                    {struct.name.split(" ").slice(1).join(" ") || ""}
                </div>
                <div className={`flex items-center transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-accent"
                        onClick={handleSelectNode}
                    >
                        <Plus />
                    </Button>
                    {!struct.isSchema && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent"
                            onClick={handleToggleMenu}
                        >
                            <Settings2 />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="hover:bg-accent">
                        <Trash />
                    </Button>
                </div>
            </div>
            {menu && <RenderSettings
                struct={struct}
                getTypes={getTypes}
                updateStruct={updateStruct}
                onAddField={handleAddField}
                onFieldNameChange={handleFieldNameChange}
                onFieldTypeChange={handleFieldTypeChange}
            />}
        </div>
    );
};

const RenderSettings = ({ struct, getTypes, onAddField, onFieldNameChange, onFieldTypeChange }) => {
    return (
        <Card className="border-0 bg-background">
            <CardHeader>
                <CardTitle>Additional Settings</CardTitle>
                <CardDescription>Struct ({struct.name.split(" ")[1]}) Settings</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
                <Button
                    className="bg-sky-500 text-foreground mb-2 w-full"
                    onClick={onAddField}
                >
                    Add Field
                </Button>

                {struct.schema.map(({ name, type }, index) => (
                    <div key={index} className="mb-3">
                        <PolyInput
                            type="string"
                            value={name ?? ""}
                            onChange={(_, val) => onFieldNameChange(struct, index, val)}
                        />
                        <Types
                            type={type}
                            getTypes={getTypes}
                            onChange={(type) => onFieldTypeChange(name, type)}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
