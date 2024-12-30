import { useEditor, Element } from "@craftjs/core";
import { ArrowUp, LayoutGrid } from "lucide-react";
import { Component, RootProps } from "./components/child";

import { parse } from 'node-html-parser'
import { cleanHTMLElement } from "./utils/html";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./store/store";
import { TooltipComponent } from "@/components/utils/tooltip";

type ToolboxItemProps = {
    title: string
    height?: string
    visible?: boolean
    onChange?: (bool: boolean) => void
    children: React.ReactNode
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ visible, title, children, onChange }) => {
    return (
        <div className="flex flex-col w-full">
            <div
                onClick={() => {
                    if (onChange) onChange(!visible)
                }}
                className={`h-12 cursor-pointer border-b last:border-b-0 flex items-center px-2 ${visible ? 'shadow-sm' : ''
                    }`}
            >
                <div className="flex-1 flex items-center">
                    <LayoutGrid className="h-4 w-4 ml-2 mr-4" />{' '}
                    <h2 className="text-xs uppercase">{title}</h2>
                </div>
                <a style={{ transform: `rotate(${visible ? 180 : 0}deg)` }}>
                    <ArrowUp className="h-4 w-4" />
                </a>
            </div>
            {visible ? <div className="w-full flex-1 overflow-auto">{children}</div> : null}
        </div>
    )
}

const Item = ({ connectors, c }) => {
    return (
        <div
            ref={(ref) =>
                connectors.create(
                    ref as HTMLElement,
                    <Component root={cleanHTMLElement(parse(c.source) as unknown as RootProps)} />
                )
            }
        >
            <TooltipComponent
                description={c.displayName}
                side="left"
            >
                <a className="cursor-move m-2 pb-2 cursor-pointer block">
                    <img
                        src="https://app.dafifi.net/favicon.ico"
                        width="600px"
                        height="300px"
                    />
                </a>
            </TooltipComponent>
        </div>
    )
}

export const Toolbox = () => {
    const { components, categories } = useContext(ThemeContext)
    const { connectors } = useEditor(({ options }) => ({ enabled: options.enabled }));

    const [toolbarVisible, setToolbarVisible] = useState<boolean[]>([])

    useEffect(() => {
        const v = Array.from({ length: categories.length }, (_, i) => i === 0)
        setToolbarVisible(v)
    }, [categories])

    const toggleToolbar = (index: number) => {
        setToolbarVisible((t) => t.map((c, i) => (i === index ? !c : c)))
    }

    return (
        <div
            className={`h-full flex flex-col`}
            style={{ transition: '0.4s cubic-bezier(0.19, 1, 0.22, 1)' }}
        >
            <div
                className="flex flex-1 flex-col items-center pt-3 overflow-scrooll hide-scrollbars">
                {categories.map((b, j) => {
                    return (
                        <ToolboxItem
                            key={j}
                            title={b}
                            visible={toolbarVisible[j]}
                            onChange={() => toggleToolbar(j)}
                        >
                            {components
                                ?.filter((c) => c.category == b)
                                .map((c, i) => (
                                    <Item connectors={connectors} c={c} key={i} />
                                ))}
                        </ToolboxItem>
                    )
                })}
            </div>
        </div>
    );
};