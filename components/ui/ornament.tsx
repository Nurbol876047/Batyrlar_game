import { cn } from "@/lib/utils";

interface OrnamentProps {
  className?: string;
}

export function Ornament({ className }: OrnamentProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-primary/10" />
      <div className="relative h-4 w-4 rotate-45 rounded-[2px] border border-primary/40 bg-primary/10" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-accent/30 to-primary/10" />
    </div>
  );
}
