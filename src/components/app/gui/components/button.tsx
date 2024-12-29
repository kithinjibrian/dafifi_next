import { Button } from "@/components/ui/button";
import { useNode } from "@craftjs/core";
import React from "react";

export const ButtonComponent = ({ children }) => {
    const { connectors: { connect, drag } } = useNode();

    return (
        <button
            ref={ref => connect(drag(ref))}
        >
            {children}
        </button>
    )
}