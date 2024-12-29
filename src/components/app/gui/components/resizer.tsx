import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import debounce from 'debounce';
import { Resizable } from 're-resizable';
import {
    isPercentage,
    pxToPercent,
    percentToPx,
    getElementDimensions,
} from '../utils/numToMeasurement';
import { cn } from '@/lib/utils';

const ResizeIndicators = ({ bound, active }) => {
    if (!active) return null;

    const indicatorClasses = cn(
        "absolute w-2.5 h-2.5 bg-white rounded-full",
        "shadow-[0_0_12px_-1px_rgba(0,0,0,0.25)]",
        "pointer-events-none z-[99999]",
        "border-2 border-sky-500"
    );

    const getIndicatorStyle = (position) => {
        if (bound) {
            switch (position) {
                case 'top':
                    return bound === 'row' ? "left-1/2 -top-1.5 -translate-x-1/2" : "top-1/2 -left-1.5 -translate-y-1/2";
                case 'bottom':
                    return bound === 'row' ? "left-1/2 -bottom-1.5 -translate-x-1/2" : "bottom-1/2 -left-1.5 -translate-y-1/2";
                default:
                    return "hidden";
            }
        }

        switch (position) {
            case 'topLeft':
                return "-left-1.5 -top-1.5";
            case 'topRight':
                return "-right-1.5 -top-1.5";
            case 'bottomLeft':
                return "-left-1.5 -bottom-1.5";
            case 'bottomRight':
                return "-right-1.5 -bottom-1.5";
        }
    };

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className={cn(indicatorClasses, getIndicatorStyle('topLeft'))} />
            {!bound && <div className={cn(indicatorClasses, getIndicatorStyle('topRight'))} />}
            <div className={cn(indicatorClasses, getIndicatorStyle('bottomLeft'))} />
            {!bound && <div className={cn(indicatorClasses, getIndicatorStyle('bottomRight'))} />}
        </div>
    );
};

export const Resizer = ({ propKey, children, ...props }) => {
    const {
        id,
        actions: { setProp },
        connectors: { connect },
        fillSpace,
        nodeWidth,
        nodeHeight,
        parent,
        active,
        inNodeContext,
    } = useNode((node) => ({
        parent: node.data.parent,
        active: node.events.selected,
        nodeWidth: node.data.props[propKey.width],
        nodeHeight: node.data.props[propKey.height],
        fillSpace: node.data.props.fillSpace,
    }));

    const { isRootNode, parentDirection } = useEditor((state, query) => ({
        parentDirection: parent &&
            state.nodes[parent] &&
            state.nodes[parent].data.props.flexDirection,
        isRootNode: query.node(id).isRoot(),
    }));

    const resizable = useRef(null);
    const isResizing = useRef(false);
    const editingDimensions = useRef(null);
    const nodeDimensions = useRef(null);
    nodeDimensions.current = { width: nodeWidth, height: nodeHeight };

    const [internalDimensions, setInternalDimensions] = useState({
        width: nodeWidth,
        height: nodeHeight,
    });

    const updateInternalDimensionsInPx = useCallback(() => {
        const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current;
        const parentWidth = resizable.current &&
            getElementDimensions(resizable.current.resizable.parentElement).width;
        const parentHeight = resizable.current &&
            getElementDimensions(resizable.current.resizable.parentElement).height;

        setInternalDimensions({
            width: percentToPx(nodeWidth, parentWidth),
            height: percentToPx(nodeHeight, parentHeight),
        });
    }, []);

    const updateInternalDimensionsWithOriginal = useCallback(() => {
        const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current;
        setInternalDimensions({
            width: nodeWidth,
            height: nodeHeight,
        });
    }, []);

    const getUpdatedDimensions = (width, height) => {
        const dom = resizable.current?.resizable;
        if (!dom) return;

        const currentWidth = parseInt(editingDimensions.current.width);
        const currentHeight = parseInt(editingDimensions.current.height);

        return {
            width: currentWidth + parseInt(width),
            height: currentHeight + parseInt(height),
        };
    };

    useEffect(() => {
        if (!isResizing.current) updateInternalDimensionsWithOriginal();
    }, [nodeWidth, nodeHeight, updateInternalDimensionsWithOriginal]);

    useEffect(() => {
        const listener = debounce(updateInternalDimensionsWithOriginal, 1);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [updateInternalDimensionsWithOriginal]);

    return (
        <Resizable
            enable={[
                'top',
                'left',
                'bottom',
                'right',
                'topLeft',
                'topRight',
                'bottomLeft',
                'bottomRight',
            ].reduce((acc, key) => {
                acc[key] = active && inNodeContext;
                return acc;
            }, {})}
            className={cn(
                "flex",
                isRootNode && "m-auto"
            )}
            ref={(ref) => {
                if (ref) {
                    resizable.current = ref;
                    connect(resizable.current.resizable);
                }
            }}
            size={internalDimensions}
            onResizeStart={(e) => {
                updateInternalDimensionsInPx();
                e.preventDefault();
                e.stopPropagation();
                const dom = resizable.current?.resizable;
                if (!dom) return;
                editingDimensions.current = {
                    width: dom.getBoundingClientRect().width,
                    height: dom.getBoundingClientRect().height,
                };
                isResizing.current = true;
            }}
            onResize={(_, __, ___, d) => {
                const dom = resizable.current?.resizable;
                let { width, height } = getUpdatedDimensions(d.width, d.height);

                if (isPercentage(nodeWidth)) {
                    width = pxToPercent(width, getElementDimensions(dom.parentElement).width) + '%';
                } else {
                    width = `${width}px`;
                }

                if (isPercentage(nodeHeight)) {
                    height = pxToPercent(height, getElementDimensions(dom.parentElement).height) + '%';
                } else {
                    height = `${height}px`;
                }

                if (isPercentage(width) && dom.parentElement.style.width === 'auto') {
                    width = editingDimensions.current.width + d.width + 'px';
                }

                if (isPercentage(height) && dom.parentElement.style.height === 'auto') {
                    height = editingDimensions.current.height + d.height + 'px';
                }

                setProp((prop) => {
                    prop[propKey.width] = width;
                    prop[propKey.height] = height;
                }, 500);
            }}
            onResizeStop={() => {
                isResizing.current = false;
                updateInternalDimensionsWithOriginal();
            }}
            {...props}
        >
            {children}
            <ResizeIndicators
                active={active}
                bound={fillSpace === 'yes' ? parentDirection : false}
            />
        </Resizable>
    );
};