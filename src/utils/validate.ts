export function validateStruct(value, schema, errors) {
    let parsedValue;
    try {
        parsedValue = JSON.parse(value);
    } catch (error) {
        errors.push('Invalid struct');
        return false;
    }

    if (typeof parsedValue !== 'object' || parsedValue === null) {
        errors.push('The parsed value must be a valid object');
        return false;
    }

    for (const { name: key, type: typeDef } of schema) {
        if (!(key in parsedValue)) {
            errors.push(`Missing field: "${key}"`);
            return false;
        }

        const value = parsedValue[key];
        const { name: expectedType, types: childTypes } = typeDef.tcon;

        if (expectedType === 'array') {
            if (!Array.isArray(value)) {
                errors.push(`"${key}" should be an array`);
                return false;
            }

            if (!childTypes || childTypes.length === 0) {
                errors.push(`Type definition for "${key}" array is missing`);
                return false;
            }

            const arrayItemType = childTypes[0]?.tcon?.name;
            for (let i = 0; i < value.length; i++) {
                const item = value[i];
                const itemType = item === null ? 'null' : Array.isArray(item) ? 'array' : typeof item;
                if (!isTypeMatch(itemType, arrayItemType)) {
                    errors.push(`Item at index ${i} in "${key}" should be a ${arrayItemType}, but got ${itemType}`);
                    return false;
                }
            }

        } else if (expectedType === 'map') {
            if (typeof value !== 'object' || Array.isArray(value) || value === null) {
                errors.push(`"${key}" should be an object (map)`);
                return false;
            }

            const mapValueType = childTypes[0]?.tcon?.name;
            for (const [mapKey, mapValue] of Object.entries(value)) {
                const itemType = typeof mapValue;
                if (!isTypeMatch(itemType, mapValueType)) {
                    errors.push(`Value for key "${mapKey}" in "${key}" should be a ${mapValueType}, but got ${itemType}`);
                    return false;
                }
            }
        } else {
            const valueType = typeof value;
            if (!isTypeMatch(valueType, expectedType)) {
                errors.push(`"${key}" should be a ${expectedType}, but got ${valueType}`);
                return false;
            }
        }
    }

    return true;
}

function isTypeMatch(jsType, schemaType) {
    const typeMap = {
        string: 'string',
        integer: 'number',
        float: 'number',
        boolean: 'boolean'
    };

    return typeMap[schemaType] === jsType;
}
