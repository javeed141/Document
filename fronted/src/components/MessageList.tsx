import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, MessageSquare } from "lucide-react";

/* ===================== TYPE DEFINITIONS ===================== */
interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

interface Chat {
  _id: string;
  title: string;
}

interface MessageListProps {
  activeChat: Chat;
  messages: Message[];
  loading: boolean;
  isResponding: boolean;
}

/* ===================== MAIN COMPONENT ===================== */
export default function MessageList({
  activeChat,
  messages,
  loading,
  isResponding,
}: MessageListProps) {
  // References to scroll to bottom automatically
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isResponding]);

  /* ===================== RENDER ===================== */
  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-b from-background to-muted/20 scroll-smooth"
    >
      {/* ========== CASE 1: LOADING MESSAGES ========== */}
      {/* Show skeletons when fetching messages */}
      {messages.length === 0 && loading && (
        <div className="max-w-4xl mx-auto space-y-6">
          <LoadingSkeleton />
        </div>
      )}

      {/* ========== CASE 2: NO MESSAGES IN THIS CHAT ========== */}
      {/* Show empty state for this specific chat */}
      {messages.length === 0 && !loading && !isResponding && (
        <EmptyMessagesState chatTitle={activeChat.title} />
      )}

      {/* ========== CASE 3: HAS MESSAGES ========== */}
      {/* Show all messages with optional typing indicator */}
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

/* ===================== EMPTY STATE - NO MESSAGES IN CHAT ===================== */
// Shows when chat is selected but has no messages yet
function EmptyMessagesState({ chatTitle }: { chatTitle: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4 max-w-md px-4">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No messages in this chat</h3>
          <p className="text-sm text-muted-foreground">
            Start the conversation by sending a message below
          </p>
          <p className="text-xs text-muted-foreground/70 mt-3">
            Chat: <span className="font-medium">{chatTitle}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===================== LOADING SKELETON ===================== */
// Shows when fetching messages from server
function LoadingSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
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

/* ===================== TYPING INDICATOR ===================== */
// Shows when AI is responding
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
            <span
              className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
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