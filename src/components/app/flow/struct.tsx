import { useCallback, useState } from "react";
import { Circle, Settings2, Trash, Plus } from "lucide-react";

import { Types } from "@/components/utils/type";
import { Button } from "@/components/ui/button";
import { PolyInput } from "@/components/utils/poly-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { anyTypeClass, parse, structTypeClass } from "@/utils/compiler";
import { showTypeClass } from "@kithinji/nac/dist/typechecker/type";

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
                    types: [],
                    constraints: [showTypeClass, structTypeClass, anyTypeClass]
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
                types: [],
                constraints: [showTypeClass, structTypeClass, anyTypeClass]
            }
        }
    }],
});

export const Struct = ({ store, struct, onSelectNode }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [menu, setMenu] = useState(false);

    const { getTypes, updateStruct, deleteStruct } = store();

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
            type: parse("integer")
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

    const handleDelete = useCallback(() => {
        deleteStruct(struct.id)
    }, [struct.id])

    return (
        <div className="border-b">
            <div
                className="flex items-center justify-between group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className="outline-none focus:border-b focus:border-gray-300 flex items-center"
                >
                    <Circle strokeWidth={0} className="mr-1.5" style={{ fill: struct.color }} />
                    <p
                        className="w-[50px]"
                        role="textbox"
                        aria-label="Edit struct name"
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck={false}
                        onBlur={handleNameChange}
                    >{struct.name.split(" ").slice(1).join(" ") || ""}</p>
                </div>
                <div className={`flex items-center transition-opacity duration-200 ${isHovered ? "opacity-100 bg-background" : "opacity-0"}`}>
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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-accent"
                        onClick={handleDelete}>
                        <Trash />
                    </Button>
                </div>
            </div>
            {menu && RenderSettings({
                struct,
                getTypes,
                handleAddField,
                handleFieldNameChange,
                handleFieldTypeChange
            })
            }
        </div>
    );
};

const RenderSettings = ({ struct, getTypes, handleAddField, handleFieldNameChange, handleFieldTypeChange }) => {
    return (
        <Card className="border-0 bg-background">
            <CardHeader>
                <CardTitle>Additional Settings</CardTitle>
                <CardDescription>Struct ({struct.name.split(" ")[1]}) Settings</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
                <Button
                    className="bg-sky-500 text-foreground mb-2 w-full"
                    onClick={handleAddField}
                >
                    Add Field
                </Button>

                {struct.schema.map(({ name, type }, index) => (
                    <div key={index} className="mb-3">
                        <PolyInput
                            name=""
                            type={parse("string")}
                            value={name ?? ""}
                            onChange={(_, val) => handleFieldNameChange(struct, index, val)}
                        />
                        <Types
                            type={type}
                            getTypes={() => getTypes().filter(i => i !== "flow")}
                            onChange={(type) => handleFieldTypeChange(name, type)}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
