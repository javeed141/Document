import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="flex flex-col items-center space-y-4 text-muted-foreground">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="absolute inset-0 h-10 w-10 rounded-full bg-primary/20 blur-xl animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-medium">AI is thinking...</p>
          <p className="text-xs text-muted-foreground/60">
            This may take a moment
          </p>
        </div>
      </div>
    </div>
  );
}