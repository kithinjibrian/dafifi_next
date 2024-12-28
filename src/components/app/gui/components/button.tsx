import { Button } from "@/components/ui/button";
import React from "react";

export const ButtonComponent = ({ size, variant, color, children }) => {
    return (
        <Button size={size} variant={variant} color={color}>
            {children}
        </Button>
    )
}