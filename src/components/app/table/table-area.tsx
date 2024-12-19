import { FileDTO } from "@/store/file"
import { DataTable } from "./table"
import { getColumns } from "./column";
import { useProjectStore } from "@/store/project";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const TableArea = ({ file }: { file: FileDTO }) => {
    if (!file.store) return <p>Could not load file data!</p>;

    const { schemas, fetchSchema } = useProjectStore();
    const { records, insertRecord, updateRecord, addColumn } = file.store();

    const schema = schemas.find(x => x.id === file.id);

    const columns = getColumns(schema ? schema.tableSchema : []);

    return (
        <ScrollArea className="w-full h-[93%]">
            <DataTable
                columns={columns}
                data={records}
                onAddRow={() => {
                    insertRecord({})
                }}
                onCellUpdate={(e) => {
                    updateRecord({
                        id: e.id
                    }, {
                        [e.field]: e.value
                    })
                }}
                onAddColumn={async (e) => {
                    try {
                        await addColumn(e)
                        await fetchSchema(file.id)
                    } catch (e) {
                    }
                }}
            />
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}