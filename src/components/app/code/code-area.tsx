import { FileDTO } from '@/store/file';
import MonacoEditor from '@monaco-editor/react';
import { useEffect } from 'react';

const m: Record<string, string> = {
    "log": "text",
    "lg": "text",
    "js": "javascript"
}

export const CodeEditor = ({ file }: { file: FileDTO }) => {
    if (!file.store) return <p>Could not load file data!</p>;

    const { data, setData, fetchData } = file.store();

    const handleEditorChange = (value: string | undefined) => {
        setData(value);
    };

    useEffect(() => {
        if (file)
            fetchData();
    }, [file]);

    return (
        <div className='h-full pt-2'>
            <MonacoEditor
                height="98%"
                language={file.ext ? m[file.ext] : "text"}
                value={`${data}`}
                onChange={handleEditorChange}
                theme="vs-dark"
            />
        </div>
    );
};
