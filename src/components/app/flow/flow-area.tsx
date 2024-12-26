import { FileDTO } from '@/store/file';
import { report_error } from '@/utils/request';
import {
    ReactFlowProvider
} from '@xyflow/react';
import { useEffect, useState } from 'react';
import { getCustomTypes } from './node/get-custom-types';
import { Flow } from './flow';

import './node/node.css';
import { useProjectStore } from '@/store/project';

export const FlowEditor: React.FC<{ file: FileDTO }> = ({ file }) => {
    if (!file.store) return <div>Could not load file data!</div>;

    const { project, specs, fetchSpecNodes } = useProjectStore();

    useEffect(() => {
        if (project && (!specs || specs.length == 0)) {
            fetchSpecNodes(+project.id)
        }
    }, [project, specs]);

    const [customNodeTypes, setCustomNodeTypes] = useState<any>(null);

    useEffect(() => {

        const loadCustomTypes = () => {
            const types = getCustomTypes(specs, file.store);
            setCustomNodeTypes(types);
        };

        if (specs && specs.length > 0)
            loadCustomTypes()
    }, [specs]);

    return (
        <ReactFlowProvider>
            {customNodeTypes && (
                <Flow store={file.store} customNodeTypes={customNodeTypes} />
            )}
        </ReactFlowProvider>
    );
};