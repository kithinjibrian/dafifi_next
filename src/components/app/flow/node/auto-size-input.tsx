import {
    CSSProperties,
    FC,
    HTMLProps,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { Input } from "@/components/ui/input";

export type AutoSizeInputProps = HTMLProps<HTMLInputElement> & {
    minWidth?: number;
};

const baseStyles: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    visibility: "hidden",
    height: 0,
    width: "auto",
    minWidth: "50px",
    whiteSpace: "pre",
};

export const AutoSizeInput: FC<AutoSizeInputProps> = ({
    minWidth = 30,
    style,
    ...props
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const measureRef = useRef<HTMLSpanElement | null>(null);
    const [styles, setStyles] = useState<CSSProperties>({ ...style });

    // grab the font size of the input on ref mount
    const setRef = useCallback((input: HTMLInputElement | null) => {
        if (input) {
            const styles = window.getComputedStyle(input);
            setStyles({
                fontSize: styles.getPropertyValue("font-size"),
                paddingLeft: styles.getPropertyValue("padding-left"),
                paddingRight: styles.getPropertyValue("padding-right"),
            });
        }
        inputRef.current = input;
    }, []);

    // measure the text on change and update input
    useEffect(() => {
        if (measureRef.current === null) return;
        if (inputRef.current === null) return;

        const width = measureRef.current.clientWidth;
        inputRef.current.style.width = Math.max(minWidth, width) + "px";
    }, [props.value, minWidth, styles]);

    return (
        <>
            <Input ref={setRef} {...props} />
            <span ref={measureRef} style={{ ...styles, ...baseStyles }}>
                {props.value}
            </span>
        </>
    );
};