import { GripVertical } from "lucide-react";
import { useState } from "react";

export const DragWrapper = ({ children }) => {
    const [isDragging, setIsDragging] = useState(false);

    return (
        <div
            className={`relative border rounded-md transition-all ${isDragging ? 'opacity-50 scale-95' : ''
                }`}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
        >
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            {children}
        </div>
    );
};