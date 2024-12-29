import { FileDTO } from "@/store/file";
import axios from "axios";
import { useState } from "react";
import MonacoEditor from '@monaco-editor/react';

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "../../utils/combobox";
import { TabView } from "../../utils/tab-view";
import { Queries } from "./queries";
import { Headers } from "./headers";
import { Body } from "./body";
import { request } from "@/utils/request";

const requestTabs = [
    {
        name: "Query",
        content: (props) => <Queries {...props} />
    },
    {
        name: "Headers",
        content: (props) => <Headers {...props} />
    },
    {
        name: "Body",
        content: (props) => <Body {...props} />
    }
];

const responseTabs = [
    {
        name: "Response",
        content: (response) => {
            if (response) {
                const type = response.headers ? response.headers["content-type"] : null;

                if (
                    type == "image/x-icon" ||
                    type == "image/jpeg" ||
                    type == "image/png"
                ) {
                    const blob = URL.createObjectURL(new Blob([response.data], { type }))
                    return (
                        <img src={blob} alt="Image" />
                    )
                }
                return (
                    <MonacoEditor
                        height="500px"
                        language="json"
                        theme="vs-dark"
                        value={
                            response
                                ? JSON.stringify(response.data, null, 2)
                                : 'No response yet'
                        }
                        options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            automaticLayout: true
                        }}
                    />
                )
            } else {
                return (
                    <div>No response yet</div>
                )
            }
        }
    },
    {
        name: "Headers",
        content: (response) => (
            <MonacoEditor
                height="500px"
                language="json"
                theme="vs-dark"
                value={
                    response
                        ? JSON.stringify(response.headers, null, 2)
                        : 'No response yet'
                }
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    automaticLayout: true
                }}
            />
        )
    }
]

export const RequestArea = ({ file }: { file: FileDTO }) => {
    if (!file.store) return <p>Could not load file data!</p>;

    const {
        method,
        setMethod,
        url,
        setUrl,
        query,
        headers,
        bodyType,
        bodyContent,
    } = file.store();

    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [requestTime, setRequestTime] = useState(0);

    // Prepare request configuration
    const prepareRequestConfig = () => {
        const config: any = {
            method,
            url,
            headers: {},
            params: {}
        };

        // Add query parameters
        query.forEach(param => {
            if (param.key) config.params[param.key] = param.value;
        });

        // Add headers
        headers.forEach(header => {
            if (header.key) config.headers[header.key] = header.value;
        });

        // Add body for methods that support it
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            try {
                config.data = bodyType === 'JSON'
                    ? JSON.parse(bodyContent)
                    : bodyContent;
            } catch (error) {
                throw new Error('Invalid JSON in request body');
            }
        }

        return config;
    };

    // Send request handler
    const sendRequest = async () => {
        if (!url) {
            setResponse({ error: 'URL cannot be empty' });
            return;
        }

        setIsLoading(true);
        const startTime = performance.now();

        try {
            const config = prepareRequestConfig();

            const res = await request.post("/client", {
                method,
                ...config
            })

            setResponse({
                status: res.data.status,
                data: res.data.data,
                headers: res.data.headers
            });
        } catch (error) {
            setResponse({
                error: error.response
                    ? `Error ${error.response.status}: ${error.response.statusText}`
                    : error.message
            });
        } finally {
            const endTime = performance.now();
            setRequestTime(Math.round(endTime - startTime));
            setIsLoading(false);
        }
    };

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="h-full border rounded-lg overflow-hidden"
        >
            <ResizablePanel
                defaultSize={50}
                minSize={30}
                className="p-4 overflow-auto"
            >
                <div className="flex mb-4 space-x-2">
                    <Combobox
                        name="method"
                        className="w-32 bg-card"
                        options={{
                            default: method,
                            options: ["GET", "POST", "PATCH", "PUT", "DELETE"]
                        }}
                        onChange={(name, value) => setMethod(value)}
                    />
                    <Input
                        placeholder="Enter URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-grow"
                    />
                    <Button
                        onClick={sendRequest}
                        disabled={isLoading}
                        className={`${isLoading ? 'opacity-50' : ''} bg-sky-500 text-foreground`}
                    >
                        {isLoading ? 'Sending...' : 'Send Request'}
                    </Button>
                </div>

                <TabView
                    defaultValue={"Query"}
                    tabs={requestTabs}
                    extraProps={{ store: file.store }}
                />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel
                defaultSize={50}
                minSize={30}
                className="p-4 overflow-auto"
            >
                <div className="mb-4">
                    <div className="flex space-x-4 mb-2">
                        <p>Status: <span className={`font-bold ${response?.status >= 200 && response?.status < 300 ? 'text-green-600' : 'text-red-600'}`}>
                            {response?.status || 'N/A'}
                        </span></p>
                        <p>Time: <span className="text-blue-600">{requestTime}ms</span></p>
                    </div>

                    <TabView
                        defaultValue={"Response"}
                        tabs={responseTabs}
                        extraProps={response} />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};