import React, { useCallback, useEffect, useRef } from 'react';
import { useEditor, useNode } from '@craftjs/core';
import { ArrowUp, Move, Settings2, Trash } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from "@/lib/utils";

interface RenderNodeProps {
    render: React.ReactNode,
    store: any
}

export const RenderNode: React.FC<RenderNodeProps> = ({ render, store }) => {
    const { id } = useNode();
    const currentRef = useRef(null);
    const outlineRef = useRef(null);

    const { setActiveTab } = store();

    const { actions, query, isActive } = useEditor((_, query) => ({
        isActive: query.getEvent('selected').contains(id)
    }));

    const {
        isHover,
        dom,
        name,
        node,
        parent,
        moveable,
        deletable,
        connectors: { drag },
    } = useNode((node) => ({
        node,
        isHover: node.events.hovered,
        dom: node.dom,
        name: node.data.custom.displayName || node.data.displayName,
        moveable: query.node(node.id).isDraggable(),
        deletable: query.node(node.id).isDeletable(),
        parent: node.data.parent,
        props: node.data.props
    }));

    const isRootChild = parent === 'ROOT'
    const showFocus = id !== 'ROOT' && name !== 'App'

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

    useEffect(() => {
        if (dom) {
            if (isActive || isHover) dom.classList.add('component-selected')
            else dom.classList.remove('component-selected')
        }
    }, [dom, isActive, isHover])

    const scroll = useCallback(() => {
        if (!currentRef.current) return
        const { top, left } = getPos(dom)
        currentRef.current.style.top = top
        currentRef.current.style.left = left
    }, [dom, getPos])

    useEffect(() => {
        const el = document.querySelector('.craftjs-renderer')

        el?.addEventListener('scroll', scroll)

        return () => {
            el?.removeEventListener('scroll', scroll)
        }
    }, [scroll])

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

            {showFocus && (
                <ActionButton >
                    <Settings2 className="h-4 w-4" onClick={() => {
                        setActiveTab("Node Settings", {
                            magic: "node",
                            node,
                            actions
                        })
                    }} />
                </ActionButton>
            )}

            {moveable && (
                <ActionButton ref={drag}>
                    <Move className="h-4 w-4" />
                </ActionButton>
            )}

            {showFocus && (
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
                    <Indicator />
                </>,
                document.querySelector('.page-container') as HTMLElement,
            )}
            {render}
        </>
    );
};