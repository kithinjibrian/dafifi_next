import { TabView } from '@/components/utils/tab-view';
import { useNode } from '@craftjs/core';
import { useState } from 'react';

const tabs = [{
    name: "Content",
    content: ({ settings }) => {
        return (
            <div></div>
        );
    }
}, {
    name: "Style",
    content: () => {
        return (
            <div></div>
        );
    }
}, {
    name: "Advanced",
    content: () => {
        return (
            <div></div>
        );
    }
}]

export const SettingsTabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0]);
    const { actions: { setProp } } = useNode();

    return (
        <div>
            {/* Tabs */}
            <div style={{ display: 'flex', marginBottom: '10px' }}>
                {Object.keys(tabs).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: activeTab === tab ? '#ddd' : '#fff',
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {tabs[activeTab]?.map(({ label, key, type, options }) => (
                    <div key={key} style={{ marginBottom: '10px' }}>
                        <label>{label}:</label>
                        {type === 'text' && (
                            <input
                                type="text"
                                onChange={(e) =>
                                    setProp((props) => (props[key] = e.target.value))
                                }
                            />
                        )}
                        {type === 'color' && (
                            <input
                                type="color"
                                onChange={(e) =>
                                    setProp((props) => (props[key] = e.target.value))
                                }
                            />
                        )}
                        {type === 'select' && (
                            <select
                                onChange={(e) =>
                                    setProp((props) => (props[key] = e.target.value))
                                }
                            >
                                {options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


export const Settings = ({ store }) => {
    const { tabData } = store();

    if (!tabData)
        return <div>Select a node!</div>

    else if (!('magic' in tabData && tabData.magic == "node")) {
        return <div>Select a node!</div>
    }

    const { node, actions } = tabData;

    return (
        <>
            {node.related.settings &&
                <node.related.settings />
            }
        </>
    )
}