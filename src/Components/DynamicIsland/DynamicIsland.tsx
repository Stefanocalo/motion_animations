import {motion, AnimatePresence} from "motion/react";
import useMeasure from "react-use-measure";
import styles from './DynamicIsland.module.scss';
import {type ReactNode, useEffect, useRef, useState} from "react";
import {FaBell, FaBellSlash} from "react-icons/fa6";
import useCountdownTimer from "./useCountDownTimer.ts";

const initialTimer = 180;


function DynamicIsland() {

    const [ref, bounds] = useMeasure();
    const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'info' | 'expanded'>('collapsed');
    const [silentMode, setSilentMode] = useState(false);
    const [dynamicIslandContent, setDynamicIslandContent] = useState<ReactNode | undefined>(undefined);
    const {start, clear, secondsLeft} = useCountdownTimer(initialTimer);
    const silentTimeoutRef = useRef<number | null>(null);


    function handleSilent() {
        setDynamicIslandState('info');
        setSilentMode(prev => !prev);
        setDynamicIslandContent(
            <div className={styles.dContainer}>
                <motion.div
                    key={`${silentMode}-icon`}
                    className={styles.dSection}
                    style={{
                        transformOrigin: 'top center'
                    }}
                    initial={{rotate: [0]}}
                    animate={{rotate: silentMode ? [10, 0,] : [15, 0]}}
                    transition={{
                        type: "spring",
                        bounce: 0.6,
                        duration: 0.8,
                        delay: dynamicIslandState === 'info' ? 0 : 0.2
                    }}
                >
                    {silentMode ? <FaBellSlash color={'#fc4c3b'} fontSize={22}/> : <FaBell fontSize={20}/>}
                </motion.div>
                <AnimatePresence mode={"wait"}>
                    <motion.div
                        key={`${silentMode}-text`}
                        initial={{filter: 'blur(5px)', scale: 0.6}}
                        animate={{filter: 'blur(0px)', scale: 1}}
                        exit={{filter: 'blur(5px)', scale: 0.6}}
                        transition={{duration: 0.2, delay: dynamicIslandState === 'info' ? 0 : 0.2}}
                        style={{color: silentMode ? '#fc4c3b' : '#fff', fontWeight: 600}}
                        className={styles.dSection}>
                        {silentMode ? 'Silent' : 'Ring'}
                    </motion.div>
                </AnimatePresence>
            </div>
        );

        if (silentTimeoutRef.current) clearTimeout(silentTimeoutRef.current);

        silentTimeoutRef.current = setTimeout(() => {
            setDynamicIslandState(prev => (prev === 'info' ? 'collapsed' : prev));
            silentTimeoutRef.current = null;
        }, 2300);
    }

    function handleTimer() {
        if (secondsLeft !== initialTimer) {
            clear();
            setDynamicIslandState('collapsed');

        } else {
            start();
            setDynamicIslandState('expanded');
        }
        setDynamicIslandContent(() => {
            return (
                <span>Timer on</span>
            )
        })
    };

    useEffect(() => {
        if (secondsLeft === 0) {
            setDynamicIslandState('collapsed');
            clear();
        }
    }, [secondsLeft]);

    return (
        <div className={styles.diWrapper}>
            <div className={styles.diContainer}>
                <motion.div
                    className={styles.dynamicIslandContainer}
                    onClick={() => {
                        setDynamicIslandState((prev) => prev !== 'collapsed' ? 'collapsed' : 'expanded')
                    }}
                    animate={{
                        height: bounds.height,
                        width: bounds.width,
                        borderRadius: dynamicIslandState !== 'expanded' ? 99 : 99,
                    }}
                    transition={{duration: 0.73, bounce: 0.3, type: 'spring'}}
                >
                    {dynamicIslandState !== 'collapsed' ? (
                        <div ref={ref}
                             className={dynamicIslandState === 'expanded' ? styles.expandedContainer : styles.infoContainer}>
                            {
                                dynamicIslandContent
                            }
                        </div>
                    ) : (
                        <div ref={ref} className={styles.closedDynamicIsland}/>
                    )}
                </motion.div>
            </div>
            <div className={styles.buttonsContainer}>
                <button className={styles.button}
                        onClick={() => handleSilent()}>{silentMode ? 'Silent' : 'Ring'}</button>
                <button className={styles.button}
                        onClick={() => handleTimer()}>{secondsLeft !== initialTimer ? 'Clear' : 'Start'} Timer
                </button>
            </div>
        </div>
    )
};

export default DynamicIsland;