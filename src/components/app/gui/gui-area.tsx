import React, { useContext, useEffect, useRef, useState } from 'react';
import { Editor, Frame, Element, Resolver } from "@craftjs/core";

import { FileDTO } from '@/store/file';

import { Container } from './components/container';
import { RenderNode } from './render-node';
import { Viewport } from './viewport';
import { ThemeContext, ThemeProvider } from './store/store';
import { renderToHTML } from './utils/toHtml';
import debounce from 'debounce';

export const GuiEditor = ({ file }: { file: FileDTO }) => {
    if (!file.store) {
        return <p>Could not load file data!</p>;
    }

    const { resolver } = useContext(ThemeContext)

    const { json, setData, fetchData } = file.store();

    useEffect(() => {
        if (file) {
            fetchData();
        }
    }, []);

    const a = debounce((e, resolver) => {
        const json = e.serialize();
        const html = renderToHTML(json, resolver);
        setData(json, html);
    }, 100);

    const onStateChange = (e: any) => {
        a(e, resolver);
    }

    return (
        <div className="h-screen flex flex-col">
            <Editor
                enabled={false}
                resolver={resolver as Resolver}
                onRender={({ render }) => <RenderNode store={file.store} render={render} />}
                onNodesChange={onStateChange}
            >
                <ThemeProvider>
                    <Viewport file={file}>
                        <Frame data={json}>
                            <Element canvas is={Container} children={[]} custom={{ displayName: 'App' }} />
                        </Frame>
                    </Viewport>
                </ThemeProvider>
            </Editor>
        </div>
    );
};
