import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/utils/combobox";
import { tableSchema } from "@/store/schema";
import { ColumnDef } from "@tanstack/react-table"

import { ChevronDown, GripVertical, KeyRound, Maximize2 } from "lucide-react"
import { useState } from "react"

const inputs = [
    {
        dataType: "string",
        component: ({ cell, onBlur }) => {
            const [value, setValue] = useState(cell.getValue());
            return (
                <div>
                    <Input
                        type="text"
                        className="border-0"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={(e) => onBlur({
                            value: e.target.value,
                            field: cell.column.id,
                            id: cell.row.original["id"]
                        })} />
                </div>
            )
        }
    }, {
        dataType: "integer",
        component: ({ cell, onBlur }) => {
            const [value, setValue] = useState(cell.getValue());
            return (
                <div>
                    <Input
                        className="border-0"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={(e) => onBlur({
                            value: e.target.value,
                            field: cell.column.id,
                            id: cell.row.original["id"]
                        })} />
                </div>
            )
        }
    }, {
        dataType: "boolean",
        component: ({ cell, onBlur }) => {
            const [value, setValue] = useState(cell.getValue());
            return (
                <div className="flex justify-center">
                    <Checkbox
                        checked={value}
                        onCheckedChange={(value) => {
                            onBlur({
                                value: value,
                                field: cell.column.id,
                                id: cell.row.original["id"]
                            })
                        }}
                        aria-label="Select all"
                        className="mr-3"
                    />
                </div>
            )
        }
    }
]


export const getColumns = (schema: tableSchema[]): ColumnDef<any>[] => {
    const columns = [{ columnName: "toolbar", dataType: "string" }];
    const c = [...columns, ...schema];

    return c.map((column) => {
        if (column.columnName === "toolbar") {
            return {
                accessorKey: column.columnName,
                header: ({ table }) => {
                    return (
                        <div className="flex">
                            <GripVertical
                                size={16}
                                className="mr-3 opacity-0"
                            />
                            <Checkbox
                                checked={
                                    table.getIsAllPageRowsSelected() ||
                                    (table.getIsSomePageRowsSelected() && "indeterminate")
                                }
                                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                                aria-label="Select all"
                                className="mr-3"
                            />
                        </div>
                    )
                },
                cell: ({ row }) => {
                    return (
                        <div className="flex">
                            <GripVertical
                                size={16}
                                className="mr-3"
                            />
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) => row.toggleSelected(!!value)}
                                aria-label="Select row"
                                className="mr-3"
                            />
                            <Maximize2
                                size={16}
                                className="mr-3"
                            />
                            <div className="">{row.index}</div>
                        </div>
                    )
                }
            }
        }
        return {
            accessorKey: column.columnName,
            header: () => {
                return (
                    <div className="flex justify-between items-center px-3">
                        {column?.constraints?.primaryKey && (
                            <KeyRound size={16} />
                        )}
                        <div>{column.columnName}</div>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <ChevronDown size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <div className="p-2">
                                    <div className="mb-2">Column Name:</div>
                                    <Input
                                        value={column.columnName} />
                                </div>
                                <div className="p-2">
                                    <div className="mb-2">Data type:</div>
                                    <Combobox
                                        name="data type"
                                        options={{
                                            default: column.dataType,
                                            options: () => {
                                                return ["string", "integer", "float", "boolean"]
                                            }
                                        }}
                                        onChange={(value) => console.log(value)} />
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
            cell: ({ cell, onBlur }) => {
                const c = inputs.find((x) => x.dataType === column.dataType);
                return (
                    <>
                        {c ? c.component({
                            cell,
                            onBlur
                        }) : (
                            <div className="flex items-center">
                                <div className="text-sm">{cell.getValue()}</div>
                            </div >
                        )}
                    </>
                )
            }
        }
    })
}
