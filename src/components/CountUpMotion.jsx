import { useEffect, useState } from "react";
import { useMotionValue, motion, animate } from "motion/react"

const CountUpMotion = ({ to, duration = 1, prefix = "", suffix = "" }) => {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, []);

  return (
    <motion.span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
};

export default CountUpMotion;
