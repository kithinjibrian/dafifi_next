import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Info } from 'lucide-react';

interface NodeInfoPopoverProps {
    spec: {
        label: string;
        category: string;
        description?: string;
        inputs?: Array<{
            name: string;
            type: string;
            description?: string;
        }>;
        outputs?: Array<{
            name: string;
            type: string;
            description?: string;
        }>;
    };
}

export const NodeInfo: React.FC<NodeInfoPopoverProps> = ({ spec }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className="p-1 rounded-md transition-colors duration-200 ease-in-out"
                >
                    <Info size={16} className="hover:text-gray-800" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-80 p-4 bg-background shadow-lg rounded-lg"
            >
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">
                            {spec.label}
                        </h3>
                        <p className="text-sm">
                            {spec.description || 'No description available.'}
                        </p>
                    </div>

                    {spec.inputs && spec.inputs.length > 0 && (
                        <div>
                            <h4 className="text-md font-medium mb-2">
                                Inputs
                            </h4>
                            <ul className="space-y-2">
                                {spec.inputs.map((input, index) => (
                                    <li
                                        key={index}
                                        className="text-sm flex items-center"
                                    >
                                        <span className="font-medium mr-2">{input.name}:</span>
                                        <span>{input.description || input.type}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {spec.outputs && spec.outputs.length > 0 && (
                        <div>
                            <h4 className="text-md font-medium mb-2">
                                Outputs
                            </h4>
                            <ul className="space-y-2">
                                {spec.outputs.map((output, index) => (
                                    <li
                                        key={index}
                                        className="text-sm flex items-center"
                                    >
                                        <span className="font-medium mr-2">{output.name}:</span>
                                        <span>{output.description || output.type}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};