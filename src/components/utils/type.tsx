import { Type } from "@/store/flow";
import { Combobox } from "./combobox";
import { useState } from "react";

export const Types = ({
    type,
    onChange,
    getTypes
}) => {
    const [selectedType, setSelectedType] = useState(() =>
        type.tag === "TCon"
            ? type.tcon.types[0]?.tag === "TCon"
                ? type.tcon.types[0].tcon.name
                : type.tcon.name
            : ""
    );

    const [selectedContainer, setSelectedContainer] = useState(() =>
        type.tag === "TCon"
            ? type.tcon.types.length > 0
                ? type.tcon.name
                : "single"
            : ""
    );

    const handleTypeChange = (type: string, container: string) => {
        setSelectedType(type);
        setSelectedContainer(container);

        const tcon: Type = {
            tag: "TCon",
            tcon: {
                name: "",
                types: [],
            },
        };

        if (container === "single") {
            tcon.tcon.name = type;
        } else {
            tcon.tcon.name = container;
            tcon.tcon.types = [{
                tag: "TCon",
                tcon: {
                    name: type,
                    types: [],
                },
            }];
        }

        onChange(tcon);
    }

    return (
        <div className="flex">
            <Combobox
                name="valueType"
                value={selectedType}
                options={{
                    options: getTypes()
                }}
                onChange={(name, value) => handleTypeChange(value, selectedContainer)}
            />
            <Combobox
                name="container"
                value={selectedContainer}
                options={{
                    default: "single",
                    options: ["single", "array", "map"],
                }}
                onChange={(name, value) => handleTypeChange(selectedType, value)}
            />
        </div>
    )
}