import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function ButtonColorful({
  className,
  label = "Get Started",
  ...props
}: ButtonColorfulProps) {
  return (
    <Button
      className={cn(
        "relative h-12 px-8 overflow-hidden cursor-none",
        "bg-[#1a1c1c]",
        "transition-all duration-200",
        "group",
        className
      )}
      {...props}
    >
      {/* Gold glow effect */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-[#D4AF37] via-[#f6be39] to-[#D4AF37]",
          "opacity-0 group-hover:opacity-70",
          "blur-md transition-opacity duration-500"
        )}
      />
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className="text-white text-xs font-semibold uppercase tracking-widest">{label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-white/90" />
      </div>
    </Button>
  );
}
