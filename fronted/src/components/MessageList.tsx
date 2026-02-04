import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, MessageSquare } from "lucide-react";

// Define what a message looks like
interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

// Define what props this component accepts
interface MessageListProps {
  messages: Message[];
  loading: boolean;
  isResponding: boolean;
}

export default function MessageList({ 
  messages, 
  loading, 
  isResponding 
}: MessageListProps) {
  // References to scroll to bottom automatically
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    });
  }, [messages, isResponding]);

  // Main render
  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-b from-background to-muted/20 scroll-smooth"
    >
      {/* CASE 1: No messages AND not loading AND not responding = Show empty state */}
      {messages.length === 0 && !loading && !isResponding && (
        <EmptyState />
      )}

      {/* CASE 2: Loading initial messages (when there are no messages yet) */}
      {messages.length === 0 && loading && (
        <div className="max-w-4xl mx-auto space-y-6">
          <LoadingSkeleton />
        </div>
      )}

      {/* CASE 3: Has messages = Show messages with optional typing indicator */}
      {messages.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Show all messages */}
          {messages.map((msg) => (
            <MessageBubble key={msg._id} message={msg} />
          ))}

          {/* Show typing indicator when AI is responding */}
          {isResponding && <TypingIndicator />}
        </div>
      )}

      {/* Invisible div to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
}

// Empty state - shows when no messages
function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4 max-w-md px-4">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        
        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Start a conversation</h3>
          <p className="text-sm text-muted-foreground">
            Send a message to begin chatting with AI
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton - shows when fetching messages
function LoadingSkeleton() {
  return (
    <>
      {[1, 2, 3,4,5,6,7].map((i) => (
        <div key={i} className="flex items-start gap-3">
          {/* Fake avatar */}
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          
          {/* Fake message content */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}

// Typing indicator - shows when AI is responding
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* AI Avatar */}
      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
        <Bot className="h-5 w-5 text-primary-foreground" />
      </div>
      
      {/* Typing animation */}
      <div className="max-w-[200px] bg-muted/50 backdrop-blur-sm rounded-2xl px-4 py-4 border border-border/50">
        <div className="flex flex-col items-center gap-3">
          {/* Three bouncing dots */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          
          {/* Text */}
          <span className="text-xs text-muted-foreground font-medium">
            AI is thinking...
          </span>
        </div>
      </div>
    </div>
  );
}