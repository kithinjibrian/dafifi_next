import { Type } from "@/store/flow";
import { createDefault, getDefaultValue } from "@/utils/default";

export const setDefaultValue = (type: Type, structs) => {

    if (type.tag == "TVar") return "";

    const isPrimitive = ["string", "boolean", "integer", "float"].includes(type.tcon.name);
    if (isPrimitive) {
        return getDefaultValue(type.tcon.name);
    } else {
        const elemType = type.tcon.types[0];
        if (type.tcon.name == "array" || type.tcon.name == "map") {
            return setDefaultValue(elemType, structs);
        } else {
            const struct = structs.find((struct) => struct.name === type.tcon.name);
            if (struct) {
                return JSON.stringify(createDefault(struct.schema, structs), null, 2);
            }
        }
    }

    return "";
};