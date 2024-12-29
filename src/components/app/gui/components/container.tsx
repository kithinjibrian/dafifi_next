import React from 'react';
import { Resizer } from "./resizer";

type RGBAColor = {
    r: number;
    g: number;
    b: number;
    a: number;
};

type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
type FillSpace = 'yes' | 'no';

export interface ContainerProps {
    background: RGBAColor;
    color: RGBAColor;
    flexDirection: FlexDirection;
    alignItems: AlignItems;
    justifyContent: JustifyContent;
    fillSpace: FillSpace;
    width: string;
    height: string;
    padding: [string, string, string, string];
    margin: [string, string, string, string];
    marginTop: number;
    marginLeft: number;
    marginBottom: number;
    marginRight: number;
    shadow: number;
    children: React.ReactNode;
    radius: number;
}

const defaultProps: ContainerProps = {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fillSpace: 'no',
    padding: ['0', '0', '0', '0'],
    margin: ['0', '0', '0', '0'],
    marginTop: 0,
    marginLeft: 0,
    marginBottom: 0,
    marginRight: 0,
    background: { r: 255, g: 255, b: 255, a: 1 },
    color: { r: 0, g: 0, b: 0, a: 1 },
    shadow: 0,
    radius: 0,
    width: '100%',
    height: 'auto',
    children: null,
};

const rgbaToString = (color: RGBAColor): string =>
    `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

const getShadowStyle = (shadow: number): string =>
    shadow === 0 ? 'none' : `0px 3px 100px ${shadow}px rgba(0, 0, 0, 0.13)`;

const getSpacingStyle = (values: string[]): string =>
    `${values[0]}px ${values[1]}px ${values[2]}px ${values[3]}px`;

export const Container = (props: Partial<ContainerProps>) => {
    const {
        flexDirection,
        alignItems,
        justifyContent,
        fillSpace,
        background,
        color,
        padding,
        margin,
        shadow,
        radius,
        children,
    } = { ...defaultProps, ...props };

    const containerStyle: React.CSSProperties = {
        justifyContent,
        flexDirection,
        alignItems,
        background: rgbaToString(background),
        color: rgbaToString(color),
        padding: getSpacingStyle(padding),
        margin: getSpacingStyle(margin),
        boxShadow: getShadowStyle(shadow),
        borderRadius: `${radius}px`,
        flex: fillSpace === 'yes' ? 1 : 'unset',
    };

    return (
        <Resizer
            propKey={{ width: 'width', height: 'height' }}
            style={containerStyle}
        >
            {children}
        </Resizer>
    );
};

Container.craft = {
    displayName: 'Container',
    props: defaultProps,
    rules: {
        canDrag: () => true,
    },
};