import { Workflow, Variable, Settings2, LayoutPanelTop } from 'lucide-react';

import { NodeTree } from './node-tree'
import { VariableTab } from './variables-tab';
import { NodeSettings } from './node-settings';
import { StructTab } from './struct-tab';
import { SideBar } from '@/components/utils/sidebar';


const navItems = [
    { value: 'Add Nodes', icon: Workflow, content: NodeTree },
    { value: 'Create variables', icon: Variable, content: VariableTab },
    { value: 'Create structs', icon: LayoutPanelTop, content: StructTab },
    { value: 'Node settings', icon: Settings2, content: NodeSettings },
]

export const NodeBar: React.FC<any> = (props) => {
    const { tab, setActiveTab } = props.store();
    return (
        <SideBar
            tab={tab}
            items={navItems}
            setActiveTab={setActiveTab}
            {...props}
        />
    );
}