import { useEditor } from '@craftjs/core';
import React from 'react';
import { Eye, ChevronDown } from 'lucide-react';
import { EditableLayerName } from './EditableLayerName';
import { useLayer } from '../useLayer';

export const DefaultLayerHeader = () => {
    const {
        id,
        depth,
        expanded,
        children,
        connectors: { drag, layerHeader },
        actions: { toggleLayer },
    } = useLayer((layer) => ({
        expanded: layer.expanded,
    }));

    const { hidden, actions, selected, topLevel } = useEditor((state, query) => ({
        hidden: state.nodes[id] && state.nodes[id].data.hidden,
        selected: query.getEvent('selected').first() === id,
        topLevel: query.node(id).isTopLevelCanvas(),
    }));

    return (
        <div
            ref={drag}
            className={`flex flex-row items-center px-3 py-1 ${selected ? 'bg-blue-600 text-white' : 'bg-transparent'
                }`}
        >
            <button
                onClick={() => actions.setHidden(id, !hidden)}
                className={`w-5 h-5 mr-3 relative cursor-pointer ${selected ? 'text-white' : 'text-gray-500'
                    }`}
            >
                <Eye className={`w-full h-full object-contain ${hidden ? 'opacity-20' : 'opacity-100'}`} />
                <div
                    className={`absolute left-0.5 top-0.5 w-0.5 h-full bg-current transform -rotate-45 origin-top transition-all duration-400
            ${hidden ? 'opacity-40 scale-y-100' : 'opacity-100 scale-y-0'}`}
                />
            </button>

            <div className="flex-1">
                <div ref={layerHeader} className="flex items-center" style={{ marginLeft: `${depth * 10}px` }}>
                    {topLevel && (
                        <div className="-ml-6 mr-3">
                            {/* TopLevel indicator icon would go here */}
                        </div>
                    )}

                    <div className="flex-1">
                        <EditableLayerName />
                    </div>

                    {children?.length > 0 && (
                        <button
                            onClick={toggleLayer}
                            className={`w-5 h-5 flex items-center justify-center opacity-70 cursor-pointer transition-transform duration-400
                ${expanded ? 'rotate-180' : 'rotate-0'}`}
                        >
                            <ChevronDown />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};