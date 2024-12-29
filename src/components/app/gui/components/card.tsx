import React from "react";
import { Container } from "./container";
import { Button } from "./button";
import { Text } from "./text";

export const Card = ({ background, padding = 20 }) => {
    return (
        <Container background={background} padding={padding}>
            <div className="text-only">
                <Text text="Title" fontSize={20} />
                <Text text="Subtitle" fontSize={15} />
            </div>
            <div className="buttons-only">
                <Button size="small" text="Learn more" variant="contained" color="primary" />
            </div>
        </Container>
    )
}