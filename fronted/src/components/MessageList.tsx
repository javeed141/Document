import LoadingState from "./LoadingState";
import MessageBubble from "./MEssageBubble";
import { Skeleton } from "@/components/ui/skeleton";


export default function MessageList({ messages, loading, isResponding }: any) {
  if (loading) return <LoadingState />;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:pl-0 md:pr-6 md:pt-6 md:pb-6 space-y-4">
      {messages.map((msg: any) => (
        <MessageBubble key={msg._id} message={msg} />
      ))}
      {isResponding && (
        <div className="flex items-start space-x-3 justify-start animate-pulse">
          <Skeleton className="h-8 w-8 rounded-full bg-muted" />
          <div className="bg-muted rounded-lg px-4 py-3 space-y-2 max-w-xl">
            <Skeleton className="h-4 w-64 bg-background/50" />
            <Skeleton className="h-4 w-48 bg-background/50" />
            <div className="flex items-center space-x-1 mt-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs text-muted-foreground">AI is typing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
