import { cn } from "@/lib/utils";

export default function Aurora({
  className,
  colorStops = ["#3b0764", "#1e1b4b", "#172554"],
  speed = 1,
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div
        className="absolute -inset-[100%] animate-aurora opacity-50"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 50%, ${colorStops[0]}, transparent 50%), radial-gradient(ellipse at 80% 20%, ${colorStops[1]}, transparent 50%), radial-gradient(ellipse at 20% 80%, ${colorStops[2]}, transparent 50%)`,
          animationDuration: `${20 / speed}s`,
        }}
      />
    </div>
  );
}
