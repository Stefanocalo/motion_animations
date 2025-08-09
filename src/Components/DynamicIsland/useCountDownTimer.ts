import {useState, useEffect, useRef} from "react";

function useCountdownTimer(initialSeconds: number) {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const intervalRef = useRef<number | null>(null);
    const isRunning = useRef(false);

    // Start or resume the countdown
    function start() {
        if (isRunning.current) return; // Prevent multiple intervals
        isRunning.current = true;

        intervalRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    isRunning.current = false;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    function pause() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            isRunning.current = false;
        }
    }

    function clear() {
        pause();
        setSecondsLeft(180);
    }

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return {secondsLeft, start, pause, clear, isRunning: isRunning.current};
};

export default useCountdownTimer;
