import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
}) {
  const defaultVariants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  };

  const combinedVariants = variant || defaultVariants;

  return (
    <motion.div
      initial="hidden"
      animate={inView ? undefined : "visible"}
      whileInView={inView ? "visible" : undefined}
      viewport={inView ? { once: true, margin: inViewMargin } : undefined}
      transition={{ delay, duration, ease: "easeOut" }}
      variants={combinedVariants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
