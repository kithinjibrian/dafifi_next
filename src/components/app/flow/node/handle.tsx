import { Types } from '@kithinji/nac';
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
        nac: Circle,
        integer: Circle,
        string: Circle,
        float: Circle,
        boolean: Circle,
        Array: Brackets,
        Map: Table,
        object: Table,
        set: Braces,
        flow: Play,
        any: Square,
        struct: LayoutPanelTop
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
    function s(type: Types) {
        switch (type.tag) {
            case "TVar":
                return "any";
            case "TCon":
                return type.tcon.name;
            case "TRec":
                return type.trec.name;
            default:
                return ""
        }
    }

    let t = s(type);

    if (type.tag == "TRec" && type.trec.name !== "map") {
        t = "struct";
    }

    let SelectedIcon = Icon[t];

    return (
        <Handle
            id={id}
            type={handle_type}
            position={position}
            style={{ ...style, border: 'none', background: 'transparent' }}
        >
            <SelectedIcon
                size={14}
                className={className}
                style={{
                    ...iconStyles,
                    ...offsets[position]
                }}
                color={style.background}
            />
        </Handle>
    );
};
