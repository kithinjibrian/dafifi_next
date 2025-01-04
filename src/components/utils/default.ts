import { Types } from "@kithinji/nac";

function getDefaultValue(primitiveType: string): any {
    switch (primitiveType) {
        case "string":
            return "";
        case "boolean":
            return false;
        case "integer":
            return 0;
        case "float":
            return 0.0;
        default:
            throw new Error(`Unknown primitive type: ${primitiveType}`);
    }
}

export const setDefaultValue = (type: Types): string => {
    switch (type.tag) {
        case "TVar":
            return "";
        case "TCon": {
            const isPrimitive = ["string", "boolean", "integer", "float"].includes(type.tcon.name);
            if (isPrimitive) {
                return getDefaultValue(type.tcon.name);
            }
            // return type.tcon.types.map(setDefaultValue);
        }
        case "TRec": {
            const defaults: Record<string, any> = {};
            for (const [key, subType] of Object.entries(type.trec.types)) {
                defaults[key] = setDefaultValue(subType);
            }
            return JSON.stringify(defaults, null, 4);
        }
        default:
            return ""
    }
};