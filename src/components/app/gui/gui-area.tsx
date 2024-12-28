import React, { useEffect, useRef } from 'react';
import { Editor, Frame, Element } from "@craftjs/core";

import { FileDTO } from '@/store/file';
import { Topbar } from './topbar';
import { Toolbox } from './toolbox';

import { Text } from './components/text';
import { Container } from './components/container';
import { ButtonComponent } from './components/button';

export const GuiEditor = ({ file }: { file: FileDTO }) => {
    if (!file.store) {
        return <p>Could not load file data!</p>;
    }

    return (
        <div className="h-screen flex flex-col">
            <Editor resolver={{
                Text,
                Container,
                ButtonComponent
            }}>
                <Topbar />
                <div className="flex-1 flex">
                    <div className="flex-1 p-4">
                        <Frame>
                            <Element is={Container} canvas>
                                <Element is={ButtonComponent} />
                            </Element>
                        </Frame>
                    </div>
                    <Toolbox />
                </div>
            </Editor>
        </div>
    );
};
