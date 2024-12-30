import React from 'react'

import { useNode } from '@craftjs/core'

interface SvgProps {
    r: any
    propId: string
}
interface SvgInterface extends React.FC<SvgProps> {
    craft: object
}

export const Svg: SvgInterface = ({ r, propId }) => {
    const { connectors, node } = useNode((node) => ({ node }))
    const path = node.data.props[propId]?.path

    const nodes = r.childNodes.filter((c: any) => c.tagName === 'PATH')
    return (
        <svg
            ref={(ref) => connectors.connect(ref as unknown as HTMLElement)}
            className={r.classNames}
            key={propId}
            height={r.attrs['height']}
            width={r.attrs['width']}
            fill={r.attrs['fill']}
            viewBox={r.attrs['viewbox']}
            stroke={r.attrs['stroke']}
            xmlns={r.attrs['xmlns']}
        >
            {nodes
                .filter((_: any, i: number) => i === 0 || !path)
                .map((c: any, i: number) => (
                    <path
                        key={propId + i.toString()}
                        d={path ?? c.attrs['d']}
                        fillRule={c.attrs['fill-rule']}
                        clipRule={c.attrs['clip-rule']}
                        strokeLinecap={c.attrs['stroke-linecap']}
                        strokeLinejoin={c.attrs['stroke-linejoin']}
                        strokeWidth={c.attrs['stroke-width']}
                        stroke={c.attrs['stroke']}
                        fill={c.attrs['fill']}
                    />
                ))}
        </svg>
    )
}

Svg.craft = {
    displayName: 'Svg',
    props: {},
    rules: {
        canDrag: () => true,
    },
    related: {},
}