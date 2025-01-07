import { useState } from "react";
import { PolyInputProps } from "./poly-input";
import { Lexer, Parser, showTypeClass, structTypeClass, TypeChecker, Types } from "@kithinji/nac";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import MonacoEditor from '@monaco-editor/react';
import { ScrollArea } from "../ui/scroll-area";


export const NacCode: React.FC<PolyInputProps> = ({
    type,
    name,
    value,
    onChange
}) => {
    const [errors, setErrors] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const [editorValue, setEditorValue] = useState(value || `fun main() {
    return "Hello, World!";
}
`)

    const handleEditorChange = (newValue: string) => {
        setEditorValue(newValue)
        onChange?.(name, null)
    }

    const handleOpenChange = (open: boolean) => {
        let data = undefined;
        if (!open) {
            const lex = new Lexer(editorValue);
            const tks = lex.tokenize();

            const p = new Parser(tks);
            const ast = p.parse();

            const t = new TypeChecker();
            const ty = t.run(ast, {});

            const main = t.global.symbol_table.get("main");

            if (!main) {
                setErrors(["Can't find main function."]);
                return;
            };

            const o: Types | null = t.hm.apply(t.subst, main);

            if (!o) return;

            if (o.tag == "TCon" && o.tcon.name == "->") {

                o.tcon.types.map(type => {
                    switch (type.tag) {
                        case "TRec": {
                            type.trec.constraints = [showTypeClass, structTypeClass]
                        }
                    }
                })

                const ret = o.tcon.types.pop();
                data = {
                    inputs: o.tcon.types.map((type, index) => ({ name: `in${index}`, type, removable: true })),
                    outputs: [{ name: "return", type: ret, removable: true }]
                };
            }
        }

        onChange?.(name, data ? { magic: "nac", type: data, value: editorValue } : editorValue)
        setIsOpen(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger className="w-full bg-sky-500 p-1.5 text-white hover:bg-sky-600 transition-colors">
                Write Code
            </DialogTrigger>
            <DialogContent
                className="h-[90vh] max-w-full p-1"
                onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Nac code</DialogTitle>
                </DialogHeader>
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={70}>
                        <MonacoEditor
                            height="100%"
                            width="100%"
                            language="rust"
                            value={editorValue}
                            onChange={(value) => handleEditorChange(value)}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true
                            }}
                        />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel>
                        {
                            errors.length > 0 &&
                            <ScrollArea className="h-32">
                                {errors.map((i, n) => (
                                    <p key={n}>{`${n}. `}{i}</p>
                                ))}
                            </ScrollArea>
                        }
                    </ResizablePanel>
                </ResizablePanelGroup>
            </DialogContent>
        </Dialog>
    )
}