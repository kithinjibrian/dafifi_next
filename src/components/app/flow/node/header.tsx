import { ChevronDown, ChevronUp, Copy, EllipsisVertical, Settings2, Trash } from "lucide-react";
import { NodeInfo } from "./node-info";
import { categoryColorMap, colors } from "@/utils/color";

export const HeaderNode = ({
    isCollapsed,
    onToggleCollapse,
    data,
    setActiveTab
}) => {
    let colorName = categoryColorMap[data.spec.category];
    let [BackgroundColor] = colors[colorName];

    return (
        <div
            style={{ background: BackgroundColor }
            }
            className="px-2 py-1 rounded flex items-center justify-between group"
        >
            <button
                onClick={onToggleCollapse}
                className="p-1 rounded-md transition-colors duration-200 ease-in-out"
            >
                {isCollapsed
                    ? <ChevronDown size={16} className="hover:text-gray-800" />
                    : <ChevronUp size={16} className="hover:text-gray-800" />}
            </button>

            <span className="flex-grow mx-2 truncate">{data.spec.label}</span>

            {!data.spec.hide_bar && (
                <div
                    className="flex items-center space-x-1 mr-2">
                    <button
                        className="p-1 rounded-md transition-colors duration-200 ease-in-out"
                        onClick={() => {
                            setActiveTab("SettingsTab");
                        }}
                    >
                        <Settings2 size={16} className="hover:text-gray-800" />
                    </button>
                    <NodeInfo spec={data.spec} />
                    <button
                        className="p-1 rounded-md transition-colors duration-200 ease-in-out"
                    >
                        <EllipsisVertical size={16} className="hover:text-gray-800" />
                    </button>
                </div>
            )}
        </div >
    )
}