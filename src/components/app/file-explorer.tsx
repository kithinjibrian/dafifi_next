import { ArrowDown, ArrowUp, FilePlus, FolderPlus, RotateCw, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Tree, TreeApi } from "@/components/react-arborist/index"
import { useProjectStore } from "@/store/project"
import { Button } from "@/components/ui/button"
import { nanoid } from "nanoid"
import { Input } from "@/components/ui/input"
import { useErrorStore } from "@/store/errors"

const uuids: Record<number, string> = {};

const getUUID = (id: number) => {
    if (!uuids[id]) {
        uuids[id] = nanoid();
    }

    return uuids[id];
}

export const FileExplorer = () => {
    const [search, setSearch] = useState("");
    const { log_error } = useErrorStore();
    const { project, files, fetchFiles, createFile, updateFile, addTab } = useProjectStore();

    const treeRef = useRef<TreeApi<any>>();

    useEffect(() => {
        if (project) {
            fetchFiles(+project.id)
        }
    }, [project]);

    const open = (node) => {
        if (node.isLeaf) {

            if (node.data.ext == "") {
                log_error(`Can't open file ${node.data.name}`)
                return;
            }

            addTab({
                ...node.data,
                uuid: getUUID(node.data.id),
            });
        }
    }

    const onCreate = async ({ parentId, index, type }) => {
        if (!project) return;

        const file = await createFile({
            parentId: parentId ? parentId : 1,
            type: type == "leaf" ? "file" : "directory",
            projectId: +project.id
        });

        return file.id
    };

    const onRename = ({ id, name }) => {
        if (!project) return;

        updateFile({
            projectId: +project.id,
            id,
            data: { name }
        });
    };


    const onMove = ({ dragIds, parentId, index }) => { };
    const onDelete = ({ ids }) => { };

    return (
        <div>
            <div className="flex justify-end gap-2 px-4">
                <Button variant="ghost" size="icon"
                    onClick={() => {
                        treeRef.current.createLeaf()
                    }}>
                    <FilePlus />
                </Button>
                <Button variant="ghost" size="icon"
                    onClick={() => {
                        treeRef.current.createInternal()
                    }}>
                    <FolderPlus
                    />
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
                    ref={treeRef}
                    width={"100%"}
                    data={files}
                    rowHeight={36}
                    onActivate={open}
                    searchTerm={search}
                    openByDefault={false}
                    childrenAccessor={(d) => d.type == "directory" ? d.children : null}
                    onCreate={onCreate}
                    onRename={onRename}
                    onMove={onMove}
                    onDelete={onDelete}
                >
                </Tree>
            </div>
        </div>
    )
}