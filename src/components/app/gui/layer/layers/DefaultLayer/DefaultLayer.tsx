import { useEditor } from '@craftjs/core';
import React from 'react';
import { DefaultLayerHeader } from './DefaultLayerHeader';
import { useLayer } from '../useLayer';

export type DefaultLayerProps = {
    children?: React.ReactNode;
};

export const DefaultLayer = ({ children }: DefaultLayerProps) => {
    const {
        id,
        expanded,
        hovered,
        connectors: { layer },
    } = useLayer((layer) => ({
        hovered: layer.event.hovered,
        expanded: layer.expanded,
    }));

    const { hasChildCanvases } = useEditor((state, query) => ({
        hasChildCanvases: query.node(id).isParentOfTopLevelNodes(),
    }));

    return (
        <div
            ref={layer}
            className={`block ${hovered ? 'bg-zinc-800' : 'bg-transparent'}
        ${hasChildCanvases && expanded ? 'pb-1.5' : ''}`}
        >
            <DefaultLayerHeader />
            {children && (
                <div
                    className={`craft-layer-children relative 
            ${hasChildCanvases ? 'ml-9 mr-1.5 my-1.5 bg-white/[0.02] rounded-lg shadow-lg' : ''}
            ${hasChildCanvases ? 'before:absolute before:left-[-19px] before:w-0.5 before:h-full before:bg-black/[0.07]' : ''}
            ${hasChildCanvases ? '[&>*]:overflow-hidden' : ''}`}
                >
                    {children}
                </div>
            )}
        </div>
    );
};