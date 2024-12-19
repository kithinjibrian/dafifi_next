import { DynamicInputs } from "./dynamic-input";

export const Queries = ({ store }) => {
    const {
        query,
        setQuery
    } = store();
    return (
        <DynamicInputs
            items={query}
            onAdd={() => setQuery([...query, { key: '', value: '' }])}
            onRemove={(index) => {
                const newParams = query.filter((_, i) => i !== index);
                setQuery(newParams.length ? newParams : [{ key: '', value: '' }]);
            }}
            onUpdate={(index, field, value) => {
                const newParams = [...query];
                newParams[index][field] = value;
                setQuery(newParams);
            }}
        />
    );
}