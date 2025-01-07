import { Types } from "@kithinji/nac";

export function validateStruct(value: string, type: Types, errors: string[]): boolean {
    let parsedValue;

    try {
        parsedValue = JSON.parse(value);
    } catch {
        errors.push("Invalid JSON structure.");
        return false;
    }

    if (typeof parsedValue !== "object" || parsedValue === null) {
        errors.push("The parsed value must be a valid object.");
        return false;
    }

    return validateValue(parsedValue, type, errors);
}

function validateValue(value: any, type: Types, errors: string[], path = ""): boolean {
    switch (type.tag) {
        case "TVar":
            // TVar type validation logic (can be extended if needed)
            return true;

        case "TCon": {
            const expectedType = type.tcon.name;
            const jsType = Array.isArray(value)
                ? "Array"
                : value === null
                    ? "null"
                    : typeof value;

            if (expectedType === "Array") {
                return validateArray(value, type.tcon.types[0], errors, path);
            }

            if (expectedType === "Map") {
                return validateMap(value, type.tcon.types[0], errors, path);
            }

            if (!isTypeMatch(jsType, expectedType)) {
                errors.push(`Expected ${expectedType} at "${path}", but got ${jsType}.`);
                return false;
            }
            return true;
        }

        case "TRec": {
            if (typeof value !== "object" || value === null) {
                errors.push(`Expected an object at "${path}".`);
                return false;
            }

            for (const [key, fieldType] of Object.entries(type.trec.types)) {
                if (!(key in value)) {
                    errors.push(`Missing required field "${key}" at "${path}".`);
                    continue;
                }
                if (!validateValue(value[key], fieldType, errors, `${path}.${key}`)) {
                    continue;
                }
            }
            return errors.length === 0;
        }

        default:
            errors.push(`Unknown type tag "${(type as any).tag}" at "${path}".`);
            return false;
    }
}

function validateArray(array: any, itemType: Types, errors: string[], path: string): boolean {
    if (!Array.isArray(array)) {
        errors.push(`Expected an array at "${path}".`);
        return false;
    }

    array.forEach((item, index) => {
        validateValue(item, itemType, errors, `${path}[${index}]`);
    });

    return errors.length === 0;
}

function validateMap(map: any, valueType: Types, errors: string[], path: string): boolean {
    if (typeof map !== "object" || Array.isArray(map) || map === null) {
        errors.push(`Expected a map (object) at "${path}".`);
        return false;
    }

    Object.entries(map).forEach(([key, value]) => {
        validateValue(value, valueType, errors, `${path}.${key}`);
    });

    return errors.length === 0;
}

function isTypeMatch(jsType: string, schemaType: string): boolean {
    const typeMap: Record<string, string> = {
        string: "string",
        integer: "number",
        float: "number",
        boolean: "boolean",
        array: "Array",
        map: "Map",
        object: "object",
        null: "null",
    };

    return typeMap[schemaType] === jsType;
}

