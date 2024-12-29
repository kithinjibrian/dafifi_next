import React, { useCallback, useEffect, useRef } from 'react';
import { useEditor, useNode } from '@craftjs/core';
import { ArrowUp, Move, Trash } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from "@/lib/utils";

export const RenderNode = ({ render }) => {
    const { id } = useNode();
    const currentRef = useRef(null);
    const outlineRef = useRef(null);

    const { actions, query, isActive } = useEditor((_, query) => ({
        isActive: query.getEvent('selected').contains(id)
    }));

    const {
        isHover,
        dom,
        name,
        moveable,
        deletable,
        connectors: { drag },
        parent
    } = useNode((node) => ({
        isHover: node.events.hovered,
        dom: node.dom,
        name: node.data.custom.displayName || node.data.displayName,
        moveable: query.node(node.id).isDraggable(),
        deletable: query.node(node.id).isDeletable(),
        parent: node.data.parent,
        props: node.data.props
    }));

    const getPos = useCallback((dom) => {
        const { top, left, bottom, width, height } = dom
            ? dom.getBoundingClientRect()
            : { top: 0, left: 0, bottom: 0, width: 0, height: 0 };
        return {
            top: `${top > 0 ? top : bottom}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`
        };
    }, []);

    const scroll = useCallback(() => {
        const { current: currentDOM } = currentRef;
        const { current: outlineDOM } = outlineRef;
        if (!currentDOM || !dom) return;

        const { top, left } = getPos(dom);
        currentDOM.style.top = top;
        currentDOM.style.left = left;

        if (outlineDOM) {
            const { top, left, width, height } = getPos(dom);
            outlineDOM.style.top = top;
            outlineDOM.style.left = left;
            outlineDOM.style.width = width;
            outlineDOM.style.height = height;
        }
    }, [dom, getPos]);

    useEffect(() => {
        const craftContainer = document.querySelector('.craftjs-renderer');
        if (!craftContainer) return;

        craftContainer.addEventListener('scroll', scroll);
        window.addEventListener('resize', scroll);

        return () => {
            craftContainer.removeEventListener('scroll', scroll);
            window.removeEventListener('resize', scroll);
        };
    }, [scroll]);

    const ActionButton = ({ onClick, ref, children }) => (
        <button
            ref={ref}
            onClick={onClick}
            className={cn(
                "h-6 w-6 p-0.5 flex items-center justify-center",
                "hover:bg-sky-600 rounded transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-sky-400"
            )}
        >
            {children}
        </button>
    );

    const Outline = () => (
        <div
            ref={outlineRef}
            className={cn(
                "fixed pointer-events-none",
                "border-dashed border-2 transition-colors",
                isActive ? "border-sky-500" : "border-sky-400",
            )}
            style={{
                ...getPos(dom),
                zIndex: 9998,
            }}
        />
    );

    const Indicator = () => (
        <div
            ref={currentRef}
            className={cn(
                "fixed px-2 py-1.5 bg-sky-500 text-white rounded shadow-lg",
                "flex items-center gap-1 text-xs font-medium",
                "transform -translate-y-full"
            )}
            style={{
                left: getPos(dom).left,
                top: getPos(dom).top,
                zIndex: 9999
            }}
        >
            <span className="flex-1 mr-1">{name}</span>

            {moveable && (
                <ActionButton ref={drag}>
                    <Move className="h-4 w-4" />
                </ActionButton>
            )}

            {id !== "ROOT" && (
                <ActionButton
                    onClick={() => actions.selectNode(parent)}
                >
                    <ArrowUp className="h-4 w-4" />
                </ActionButton>
            )}

            {deletable && (
                <ActionButton
                    onClick={(e) => {
                        e.stopPropagation();
                        actions.delete(id);
                    }}
                >
                    <Trash className="h-4 w-4" />
                </ActionButton>
            )}
        </div>
    );

    return (
        <>
            {(isHover || isActive) && createPortal(
                <>
                    <Outline />
                    <Indicator />
                </>,
                document.body
            )}
            {render}
        </>
    );
};