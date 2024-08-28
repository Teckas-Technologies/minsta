import { useRef, useState } from "react";

interface Props {
    onClick: () => any;
}

export default function useLongPress({onClick}: Props) {
    const [action, setAction] = useState("");
    const timerRef = useRef<any>();
    const isLongPress = useRef(false);

    const handleOnClick = () => {
        console.log("handleOnClick")
        if (isLongPress.current) {
            return;
        }
        setAction("click");
        if(typeof onClick === "function"){
            onClick();
        }
    }

    const handleOnMouseDown = () => {
        startPressTimer()
    }
    const handleOnMouseUp = () => {
        clearTimeout(timerRef.current);
        setAction('');
    }
    const handleOnTouchStart = () => {
        startPressTimer()
    }
    const handleOnTouchEnd = () => {
        clearTimeout(timerRef.current);
        setAction('');
    }
    const startPressTimer = () => {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            setAction('longpress');
            isLongPress.current = true;
        }, 500)
    }

    return {
        action,
        handlers: {
            onClick: handleOnClick,
            onMouseDown: handleOnMouseDown,
            onMouseUp: handleOnMouseUp,
            onTouchStart: handleOnTouchStart,
            onTouchEnd: handleOnTouchEnd
        }
    }
}