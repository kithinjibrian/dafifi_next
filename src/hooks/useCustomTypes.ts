import { getCustomTypes } from "@/components/app/flow/node/get-custom-types";
import { useEffect, useState } from "react";

export const useCustomNodeTypes = ({
    specs,
    store
}) => {
    const [customNodeTypes, setCustomNodeTypes] = useState();
    useEffect(() => {
        if (!specs) return;
        const customNodeTypes = getCustomTypes(specs, store);

        setCustomNodeTypes(customNodeTypes);
    }, [specs]);

    return customNodeTypes;
};