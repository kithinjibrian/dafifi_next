import MonacoEditor from '@monaco-editor/react';
import { Button } from "@/components/ui/button";

export const Body = ({ store }) => {
    const {
        bodyContent,
        setBodyContent,
        bodyType,
        setBodyType
    } = store();

    return (
        <div className="space-y-4">
            <div className="flex space-x-2">
                <Button
                    variant={bodyType === 'JSON' ? 'default' : 'outline'}
                    onClick={() => setBodyType('JSON')}
                >
                    JSON
                </Button>
                <Button
                    variant={bodyType === 'Text' ? 'default' : 'outline'}
                    onClick={() => setBodyType('Text')}
                >
                    Text
                </Button>
            </div>
            <MonacoEditor
                height="300px"
                language={bodyType === 'JSON' ? 'json' : 'text'}
                theme="vs-dark"
                value={bodyContent}
                onChange={(value) => setBodyContent(value || '')}
                options={{
                    minimap: { enabled: false },
                    automaticLayout: true
                }}
            />
        </div>
    )
}