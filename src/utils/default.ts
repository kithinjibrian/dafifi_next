export function createDefault(schema, structs, visited = new Set()) {
    const defaultValue = {};

    schema.forEach(({ name: key, type: typeDef }) => {
        const { name: typeName, types: childTypes } = typeDef.tcon;

        if (visited.has(typeName)) {
            defaultValue[key] = null; // Prevent infinite recursion
            return;
        }

        visited.add(typeName);

        if (typeName === 'string') {
            defaultValue[key] = "";
        } else if (typeName === 'integer' || typeName === 'float') {
            defaultValue[key] = 0;
        } else if (typeName === 'boolean') {
            defaultValue[key] = false;
        } else if (typeName === 'array') {
            const arrayItemType = childTypes[0]?.tcon.name;
            defaultValue[key] = [getDefaultValue(arrayItemType)];
        } else if (typeName === 'map') {
            defaultValue[key] = {};
        } else {
            const struct = structs.find(struct => struct.name === typeName);
            if (struct) {
                defaultValue[key] = createDefault(struct.schema, structs, visited);
            } else {
                console.warn(`No struct found for type: ${typeName}`);
            }
        }

        visited.delete(typeName); // Remove from visited after processing
    });

    return defaultValue;
}

export function getDefaultValue(typeName) {
    switch (typeName) {
        case 'string': return "";
        case 'integer': return 0; // Fixed
        case 'float': return 0;   // Fixed
        case 'boolean': return false;
        default: return null;
    }
}
