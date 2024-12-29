import { useNode } from "@craftjs/core";
import { useEffect, useState } from "react";
import ContentEditable from 'react-contenteditable'

export const Text = ({ text, fontSize, textAlign }) => {
    const { connectors: { connect, drag }, hasSelectedNode, hasDraggedNode, actions: { setProp } } = useNode((state) => ({
        hasSelectedNode: state.events.selected,
        hasDraggedNode: state.events.dragged
    }));

    const [editable, setEditable] = useState(false);

    useEffect(() => { !hasSelectedNode && setEditable(false) }, [hasSelectedNode]);

    return (
        <div
            ref={(ref) => connect(drag(ref))}
            onClick={e => setEditable(true)}
        >
            <ContentEditable
                html={text}
                onChange={e =>
                    setProp(props =>
                        props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")
                    )
                }
                tagName="p"
                style={{ fontSize: `${fontSize}px`, textAlign }}
            />
        </div>
    );
};

const TextSettings = () => {
    const { actions, selected } = useNode((node) => ({
        selected: node.events.selected
    }));

    return (
        <div>
            <input
                type="number"
                value={props.fontSize}
                onChange={e =>
                    actions.setProp(props => props.fontSize = parseInt(e.target.value))
                }
            />
        </div>
    );
};

Text.craft = {
    props: {
        text: 'This is text',
        fontSize: 16
    },
    related: {
        settings: TextSettings
    },
    rules: {
        canDrag: () => true
    }
};