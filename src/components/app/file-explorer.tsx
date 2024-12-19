import { ArrowDown, ArrowUp, FilePlus, FolderPlus, RotateCw, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Tree } from "@/components/react-arborist/index"
import { useProjectStore } from "@/store/project"
import { Button } from "@/components/ui/button"
import { nanoid } from "nanoid"
import { Input } from "@/components/ui/input"

const uuids: Record<number, string> = {};

const getUUID = (id: number) => {
    if (!uuids[id]) {
        uuids[id] = nanoid();
    }

    return uuids[id];
}

export const FileExplorer = () => {
    const [search, setSearch] = useState("")
    const { project, files, fetchFiles, addTab } = useProjectStore();

    useEffect(() => {
        if (project) {
            fetchFiles(+project.id)
        }
    }, [project]);

    const open = (node) => {
        if (node.isLeaf) {
            addTab({
                ...node.data,
                uuid: getUUID(node.data.id),
            });
        }
    }

    return (
        <div>
            <div className="flex justify-end gap-2 px-4">
                <Button variant="ghost" size="icon">
                    <FilePlus />
                </Button>
                <Button variant="ghost" size="icon">
                    <FolderPlus />
                </Button>
                <Button variant="ghost" size="icon">
                    <RotateCw />
                </Button>
                <Button variant="ghost" size="icon">
                    <ArrowUp />
                </Button>
                <Button variant="ghost" size="icon">
                    <ArrowDown />
                </Button>
            </div>
            <div className="p-4">
                <div className="relative">
                    <Input
                        className="pl-10 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search files..."
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search />
                    </div>
                </div>
            </div>
            <div className="px-2">
                <Tree
                    width={"100%"}
                    data={files}
                    rowHeight={36}
                    onActivate={open}
                    searchTerm={search}
                    openByDefault={false}
                    childrenAccessor={(d) => d.children && d.children.length > 0 ? d.children : null}>
                </Tree>
            </div>
        </div>
    )
}