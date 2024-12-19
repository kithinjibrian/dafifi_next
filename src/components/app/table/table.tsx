import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus } from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

const AddColumn = ({
    onAddColumn
}) => {
    const dataTypes = [{ dataType: "string" }, { dataType: "integer" }, { dataType: "boolean" }, { dataType: "float" }]
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedDataType, setSelectedDataType] = useState(null);
    const [name, setName] = useState("")

    const handleNameChange = (name: string) => {
        setName(name);
    }

    const handleOpenChange = () => {
        setOpen(!open);
    }

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger>
                <Plus />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="p-2">
                    <div className="mb-2">Column Name:</div>
                    <Input
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        autoFocus={true} />
                </div>
                <div className="p-2">
                    <div className="mb-2">Data type:</div>
                    <Command>
                        <CommandInput
                            value={inputValue}
                            onInput={(e) => setInputValue(e.currentTarget.value)}
                            placeholder="Search data type..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {dataTypes.map((dataType) => {
                                    const isSelected = selectedDataType?.dataType === dataType.dataType; // Check if selected
                                    return (
                                        <CommandItem
                                            key={dataType.dataType}
                                            value={dataType.dataType}
                                            onSelect={() => {
                                                setSelectedDataType(dataType); // Set selected dataType
                                                setInputValue(dataType.dataType); // Optionally update input field
                                            }}
                                            style={{
                                                backgroundColor: isSelected ? '#3b82f6' : 'transparent', // Optional: Highlight selected item
                                            }}
                                        >
                                            {dataType.dataType}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    <Button
                        className="w-full bg-sky-500"
                        onClick={() => {
                            if (name === "" && selectedDataType === null) return;

                            onAddColumn({
                                columnName: name,
                                ...selectedDataType
                            })

                            handleOpenChange();
                        }}
                    >Add Column</Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onAddRow: () => void
    onCellUpdate: (e: any) => void
    onAddColumn: (e: any) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onAddRow,
    onCellUpdate,
    onAddColumn
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        state: {
            rowSelection,
        }
    })

    return (
        <div className="rounded-md">
            <Table className="border-collapse">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        className="border p-0">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                            <TableHead
                                className="text-center w-32">
                                <AddColumn
                                    onAddColumn={onAddColumn} />
                            </TableHead>
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="border-0"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="border p-0">
                                        {flexRender(cell.column.columnDef.cell, {
                                            ...cell.getContext(),
                                            onBlur: (e) => onCellUpdate(e)
                                        })}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow
                            className="border-0">
                            <TableCell colSpan={columns.length} className="text-center border">
                                No data.
                            </TableCell>
                        </TableRow>
                    )}
                    <TableRow>
                        <TableCell
                            colSpan={columns.length} className="text-left border p-1 min-w-36"
                            onClick={onAddRow}>
                            <Plus />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div >
    )
}
