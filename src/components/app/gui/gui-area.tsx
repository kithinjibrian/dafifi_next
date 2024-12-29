import React, { useEffect, useRef, useState } from 'react';
import { Editor, Frame, Element } from "@craftjs/core";

import { FileDTO } from '@/store/file';

import { Container } from './components/container';
import { RenderNode } from './render-node';
import { Viewport } from './viewport';
import { components } from './components/components';
import { renderToHTML } from './utils/toHtml';

export const GuiEditor = ({ file }: { file: FileDTO }) => {
    if (!file.store) {
        return <p>Could not load file data!</p>;
    }

    const [code, setCode] = useState<Record<string, any> | null>(null);

    const { data, setData, fetchData } = file.store();

    useEffect(() => {
        if (file) {
            fetchData();
            if (data)
                setCode(JSON.parse(data))
            else {
                setData({
                    type: "DAFIFIUI",
                    json: "",
                    html: ""
                })
                setCode({
                    type: "DAFIFIUI",
                    json: "",
                    html: ""
                })
            }
        }
    }, [file]);

    return (
        <div className="h-screen flex flex-col" data-craft-zone>
            {code && (
                <Editor
                    enabled={false}
                    resolver={components}
                    onRender={RenderNode}
                    onNodesChange={(query) => {
                        const json = query.serialize();
                        setData({
                            type: "DAFIFIUI",
                            json,
                            html: renderToHTML(json, components)
                        });
                    }}
                >
                    <Viewport file={file}>
                        <Frame data={code.json}>
                            <Element
                                canvas
                                is={Container}
                                width="100%"
                                height="auto"
                                background={{ r: 255, g: 255, b: 255, a: 1 }}
                                padding={['40', '40', '40', '40']}
                                custom={{ displayName: 'App' }}
                            >
                            </Element>
                        </Frame>
                    </Viewport>
                </Editor>
            )}
        </div>
    );
};
