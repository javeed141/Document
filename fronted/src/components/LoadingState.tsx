import { Spinner } from "@/components/ui/spinner";

export default function LoadingState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Spinner />
        <span>Assistant is typing...</span>
      </div>
    </div>
  );
}
