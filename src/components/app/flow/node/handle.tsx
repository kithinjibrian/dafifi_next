import { Handle } from '@xyflow/react';
import { Braces, Brackets, Circle, LayoutPanelTop, Play, Square, Table } from 'lucide-react';

export const NodeHandle = ({
    id,
    handle_type,
    position,
    style,
    className,
    type
}) => {
    // Mapping container types to icons
    const Icon: Record<string, any> = {
        integer: Circle,
        string: Circle,
        float: Circle,
        boolean: Circle,
        array: Brackets,
        map: Table,
        set: Braces,
        flow: Play,
        any: Square
    };

    // Icon positioning styles
    const iconStyles = {
        position: 'absolute',
        transform: position === 'left' ? 'translate(-10%, -50%)' : 'translate(10%, -50%)',
        pointerEvents: 'none', // Make sure handle is still interactive
        visibility: 'visible',
        zIndex: 100
    };

    // Offset styles for different positions
    const offsets = {
        top: { top: 0, left: '10%' },
        bottom: { bottom: 0, left: '50%' },
        left: { left: 0, top: '50%' },
        right: { right: 0, top: '50%' },
    };

    // Select the correct icon dynamically
    let SelectedIcon = Icon[type.tag == "TVar" ? "any" : type.tcon.name];

    if (!SelectedIcon && type.tcon.name.startsWith("struct"))
        SelectedIcon = LayoutPanelTop;

    return (
        <Handle
            id={id}
            type={handle_type}
            position={position}
            style={{ ...style, border: 'none', background: 'transparent' }} // Hide default handle style
        >
            {/* Render the selected icon inside the handle */}
            <SelectedIcon
                size={14}
                className={className}
                style={{
                    ...iconStyles,
                    ...offsets[position]
                }}
                color={style.background} // You can customize the color of the icon
            />
        </Handle>
    );
};
