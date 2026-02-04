import { useEffect, useRef } from "react";
import LoadingState from "./LoadingState";
import MessageBubble from "./MessageBubble";
import { Skeleton } from "@/components/ui/skeleton";

export default function MessageList({ messages, loading, isResponding }: any) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isResponding]);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:pl-0 md:pr-6 md:pt-6 md:pb-6 space-y-4">
        {/* Skeleton for messages while loading */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-3 justify-start">
            <Skeleton className="h-8 w-8 rounded-full bg-muted" />
            <div className="bg-muted rounded-lg px-4 py-3 space-y-2 max-w-xl">
              <Skeleton className="h-4 w-64 bg-background/50" />
              <Skeleton className="h-4 w-48 bg-background/50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 md:pl-0 md:pr-6 md:pt-6 md:pb-6 space-y-4"
    >
        {messages.length === 0 && !loading && !isResponding && (
  <div className="flex items-center justify-center h-full">
    <div className="border border-dashed rounded-xl p-8 text-center max-w-sm">
      <p className="text-sm text-muted-foreground">
        No messages yet
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        Send a message to start the conversation 🚀
      </p>
    </div>
  </div>
)}

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
      {/* Invisible div for auto-scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
}