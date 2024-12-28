import { useNode } from "@craftjs/core";

export const Container = ({ children }) => {
    const { connectors: { connect, drag } } = useNode();

    return (
        <div
            ref={ref => connect(drag(ref))}
            style={{
                padding: "20px",
                margin: "20px",
                borderRadius: "4px",
                minHeight: "100px"
            }}>
            {children}
        </div>
    );
};