// import { useState } from "react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Bot, User, Copy, Check } from "lucide-react";
// import { toast } from "sonner";

// interface Message {
//   _id: string;
//   role: "user" | "assistant";
//   content: string;
//   createdAt?: string;
// }

// interface MessageBubbleProps {
//   message: Message;
// }

// export default function MessageBubble({ message }: MessageBubbleProps) {
//   const [copied, setCopied] = useState(false);
//   const isUser = message?.role === "user";

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(message.content);
//       setCopied(true);
//       toast.success("Copied to clipboard");
      
//       setTimeout(() => setCopied(false), 2000);
//     } catch (error) {
//       toast.error("Failed to copy");
//     }
//   };

//   const formatTime = (timestamp?: string) => {
//     if (!timestamp) return "";
//     return new Date(timestamp).toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div
//       className={`flex items-start gap-3 group ${
//         isUser ? "flex-row-reverse" : "flex-row"
//       }`}
//     >
//       {/* Avatar */}
//       <Avatar className={`h-9 w-9 shrink-0 ${
//         isUser 
//           ? "bg-gradient-to-br from-blue-500 to-blue-600" 
//           : "bg-gradient-to-br from-primary to-primary/60"
//       }`}>
//         <AvatarFallback className="bg-transparent text-white">
//           {isUser ? (
//             <User className="h-5 w-5" />
//           ) : (
//             <Bot className="h-5 w-5" />
//           )}
//         </AvatarFallback>
//       </Avatar>

//       {/* Message content */}
//       <div className={`flex-1 max-w-[85%] md:max-w-2xl space-y-1 ${
//         isUser ? "flex flex-col items-end" : ""
//       }`}>
//         {/* Role label */}
//         <span className="text-xs font-medium text-muted-foreground px-1">
//           {isUser ? "You" : "AI Assistant"}
//         </span>

//         {/* Message bubble */}
//         <div
//           className={`rounded-2xl px-4 py-3 text-sm leading-relaxed break-words ${
//             isUser
//               ? "bg-primary text-primary-foreground rounded-tr-sm"
//               : "bg-muted/50 backdrop-blur-sm text-foreground border border-border/50 rounded-tl-sm"
//           }`}
//         >
//           <p className="whitespace-pre-wrap">{message?.content}</p>
//         </div>

//         {/* Footer with timestamp and actions */}
//         <div className={`flex items-center gap-2 px-1 ${
//           isUser ? "flex-row-reverse" : "flex-row"
//         }`}>
//           {/* Timestamp */}
//           {message?.createdAt && (
//             <span className="text-xs text-muted-foreground">
//               {formatTime(message.createdAt)}
//             </span>
//           )}

//           {/* Copy button - only show for AI messages */}
//           {!isUser && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleCopy}
//               className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
//               aria-label="Copy message"
//             >
//               {copied ? (
//                 <Check className="h-3.5 w-3.5 text-green-500" />
//               ) : (
//                 <Copy className="h-3.5 w-3.5" />
//               )}
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Define what props this component accepts
interface MessageInputProps {
  chatId?: string;
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
}

export default function MessageInput({ 
  chatId, 
  onSendMessage,
  disabled = false 
}: MessageInputProps) {
  // State to track what user is typing
  const [text, setText] = useState("");
  
  // State to track if we're sending a message
  const [loading, setLoading] = useState(false);
  
  // Reference to the textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height first
    textarea.style.height = "auto";
    
    // Calculate new height (max 200px)
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [text]);

  // Focus textarea when chat changes
  useEffect(() => {
    textareaRef.current?.focus();
  }, [chatId]);

  // Send the message
  const handleSend = async () => {
    const trimmedText = text.trim();
    
    // Don't send if empty or already sending
    if (!trimmedText || loading || disabled) {
      return;
    }

    // Clear input right away (better UX)
    setText("");
    setLoading(true);

    try {
      // Send the message
      await onSendMessage(trimmedText);
    } catch (error) {
      console.error("Failed to send:", error);
      toast.error(`Failed to send message:${error instanceof Error ? error.message : "Unknown error"}`);
      // Restore text if failed
      setText(text);
    } finally {
      setLoading(false);
      // setText(text)
      // Focus back on input
      textareaRef.current?.focus();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter = send (Shift+Enter = new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Check if send button should be disabled
  const isSendDisabled = loading || disabled || !text.trim();

  return (
    <div className="border-t bg-background/95 backdrop-blur sticky bottom-0">
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        {/* Input container */}
        <div className="flex items-end gap-2 sm:gap-3 bg-muted/30 rounded-2xl border border-border/50 p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          
          {/* Text input */}
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            disabled={loading || disabled}
            className="flex-1 min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 text-sm sm:text-base px-3 py-2.5"
            rows={1}
          />

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={isSendDisabled}
            size="icon"
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl shrink-0 hover:scale-105 active:scale-95 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            ) : (
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
        </div>

        {/* Helper text (hidden on mobile) */}
        <p className="text-xs text-muted-foreground/60 mt-2 text-center hidden sm:block">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> to send • 
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] ml-1">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}