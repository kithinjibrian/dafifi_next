import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export type ComboboxProps = {
    name: string;
    value?: string; // Expose value as a prop for controlled usage
    className?: string;
    onChange: (name: string, value: string) => void; // Updated to include name
    options: {
        default?: string;
        options: string[] | (() => string[]);
    };
};

export const Combobox: React.FC<ComboboxProps> = ({
    name,
    value: propValue,
    options,
    onChange,
    className,
}) => {
    const [open, setOpen] = React.useState(false)

    const [opts, setOpts] = React.useState(
        typeof options.options === "function" ? options.options() : options.options
    );

    const defaultOption = options.default ?? opts[0];

    const [localValue, setLocalValue] = React.useState(defaultOption || "");

    const value = propValue ?? localValue;

    React.useEffect(() => {
        if (typeof options.options === "function") {
            setOpts(options.options());
        }
    }, [options.options]);

    const handleSelect = (currentValue: string) => {
        if (currentValue !== value) {
            onChange(name, currentValue);
            if (propValue === undefined) {
                setLocalValue(currentValue); // Update local state only in uncontrolled mode
            }
        }
        setOpen(false);
    };

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}>
            <PopoverTrigger
                asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full truncate", className
                    )}
                >
                    {value
                        ? opts.find((option) => option === value)
                        : "Select..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                            {opts.map((option) => (
                                <CommandItem
                                    key={option}
                                    value={option}
                                    onSelect={handleSelect}
                                >
                                    {option}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === option ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}