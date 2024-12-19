import { DynamicInputs } from "./dynamic-input";

export const Headers = ({ store }) => {
    const {
        headers,
        setHeaders
    } = store();

    return (
        <DynamicInputs
            items={headers}
            onAdd={() => setHeaders([...headers, { key: '', value: '' }])}
            onRemove={(index) => {
                const newHeaders = headers.filter((_, i) => i !== index);
                setHeaders(newHeaders.length ? newHeaders : [{ key: '', value: '' }]);
            }}
            onUpdate={(index, field, value) => {
                const newHeaders = [...headers];
                newHeaders[index][field] = value;
                setHeaders(newHeaders);
            }}
            keyPlaceholder="Header Name"
            valuePlaceholder="Header Value"
        />
    )
}