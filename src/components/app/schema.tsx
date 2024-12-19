import { useProjectStore } from "@/store/project";
import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const schemasUUID: Record<number, string> = {};

const getUUID = (id: number) => {
    if (!schemasUUID[id]) {
        schemasUUID[id] = nanoid();
    }

    return schemasUUID[id];
}

export const Schemas = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [editableIndex, setEditableIndex] = useState(null);
    const editableRefs = useRef([]);

    const { project, schemas, fetchSchemas, createSchema, renameSchema, addTab } = useProjectStore();

    useEffect(() => {
        if (project) {
            fetchSchemas(+project.id);
        }
    }, [project]);

    useEffect(() => {
        if (editableIndex !== null && editableRefs.current[editableIndex]) {
            editableRefs.current[editableIndex].focus();
        }
    }, [editableIndex]);

    return (
        <div className="h-full w-full">
            <div className="p-2 border-b flex items-center justify-center">
                <Button
                    className="bg-sky-500 text-foreground"
                    onClick={async () => {
                        if (!project) return;

                        await createSchema({
                            projectId: +project.id,
                            tableName: `New Table${schemas.length}`,
                            tableSchema: [
                                {
                                    columnName: "id",
                                    dataType: "string",
                                    constraints: {
                                        primaryKey: true,
                                        primaryKeyStrategy: "uuid"
                                    }
                                }
                            ]
                        });

                        addTab({
                            id: -3,
                            uuid: nanoid(),
                            name: "New Table",
                            ext: "tab",
                            type: "table"
                        })
                    }}>
                    New Table
                </Button>
            </div>
            <ScrollArea
                style={{ height: "80%" }}
                className="p-2 space-y-2">
                {schemas.map((schema, index) => (
                    <div
                        key={schema.id}
                        className="flex items-center justify-between group border-b px-2"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div>(id: {schema.id})</div>
                        <div
                            ref={(el) => (editableRefs.current[index] = el)}
                            className="rounded-md cursor-pointer"
                            role="textbox"
                            aria-label="Rename Table"
                            spellCheck={false}
                            contentEditable={editableIndex === index}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => {
                                setEditableIndex(null);
                                if (e.target.textContent && e.target.textContent !== schema.tableName) {
                                    renameSchema({
                                        tableId: schema.id,
                                        tableName: e.target.textContent
                                    });
                                }
                            }}
                            onClick={() => {
                                addTab({
                                    id: schema.id,
                                    uuid: getUUID(schema.id),
                                    name: schema.tableName,
                                    ext: "tab",
                                    type: "table"
                                });
                            }}
                        >
                            {schema.tableName}
                        </div>
                        <div
                            className={`flex items-center transition-opacity duration-200 ${hoveredIndex === index ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditableIndex(index)}
                            >
                                <Pencil />
                            </Button>
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
};
