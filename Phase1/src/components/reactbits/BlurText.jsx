import { motion } from "framer-motion";

export default function BlurText({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
}) {
  const elements =
    animateBy === "words" ? text.split(" ") : text.split("");

  const hiddenY = direction === "top" ? -20 : 20;

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: delay / 1000 },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: hiddenY,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {elements.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          variants={child}
          className="inline-block"
          style={{ marginRight: animateBy === "words" ? "0.25em" : 0 }}
        >
          {segment}
        </motion.span>
      ))}
    </motion.span>
  );
}
