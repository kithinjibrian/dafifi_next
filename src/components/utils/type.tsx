import { Combobox } from "./combobox";
import { useState } from "react";
import { Types as TYPES } from "@kithinji/nac";
import { numericTypeClass, showTypeClass, stringTypeClass } from "@kithinji/nac/dist/typechecker/type";
import { anyTypeClass } from "@/utils/compiler";

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

        const tcon: TYPES = {
            tag: "TCon",
            tcon: {
                name: "",
                types: [],
                constraints: []
            },
        };

        if (container === "single") {
            tcon.tcon.name = type;
            switch (type) {
                case "integer":
                case "float":
                    tcon.tcon.constraints = [showTypeClass, anyTypeClass, numericTypeClass]
                    break;
                case "string":
                    tcon.tcon.constraints = [showTypeClass, anyTypeClass, stringTypeClass]
                    break;
                case "boolean":
                    tcon.tcon.constraints = [showTypeClass, anyTypeClass]
                    break;
            }

        } else {
            tcon.tcon.name = container;
            tcon.tcon.types = [{
                tag: "TCon",
                tcon: {
                    name: type,
                    types: [],
                    constraints: [showTypeClass, anyTypeClass]
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