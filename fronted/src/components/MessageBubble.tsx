// import { useState } from "react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Bot, User, Copy, Check } from "lucide-react";
// import { toast } from "sonner";

// // Define what a message looks like
// interface Message {
//   _id: string;
//   role: "user" | "assistant";
//   content: string;
//   createdAt?: string;
// }

// // Define what props this component accepts
// interface MessageBubbleProps {
//   message: Message;
// }

// export default function MessageBubble({ message }: MessageBubbleProps) {
//   // Track if message was copied
//   const [copied, setCopied] = useState(false);
  
//   // Safety check - if no message, don't show anything
//   if (!message) {
//     return null;
//   }

//   // Check if this is a user message or AI message
//   const isUser = message.role === "user";

//   // Copy message to clipboard
//   const handleCopy = async () => {
//     if (!message.content) return;
    
//     try {
//       await navigator.clipboard.writeText(message.content);
//       setCopied(true);
//       toast.success("Copied to clipboard");
      
//       // Reset after 2 seconds
//       setTimeout(() => setCopied(false), 2000);
//     } catch (error) {
//       toast.error("Failed to copy");
//     }
//   };

//   // Format timestamp to readable time
//   const formatTime = (timestamp?: string) => {
//     if (!timestamp) return "";
    
//     try {
//       return new Date(timestamp).toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch (error) {
//       return "";
//     }
//   };

//   return (
//     <div className={`flex items-start gap-3 group ${isUser ? "flex-row-reverse" : "flex-row"}`}>
//       {/* Avatar Icon */}
//       <MessageAvatar isUser={isUser} />

//       {/* Message Content */}
//       <div className={`flex-1 max-w-[85%] md:max-w-2xl space-y-1 ${isUser ? "flex flex-col items-end" : ""}`}>
//         {/* Who sent the message */}
//         <MessageLabel isUser={isUser} />

//         {/* The actual message text */}
//         <MessageContent isUser={isUser} content={message.content || ""} />

//         {/* Footer with time and copy button */}
//         <MessageFooter 
//           isUser={isUser}
//           timestamp={message.createdAt}
//           copied={copied}
//           onCopy={handleCopy}
//           formatTime={formatTime}
//         />
//       </div>
//     </div>
//   );
// }

// // Avatar component - shows user or AI icon
// function MessageAvatar({ isUser }: { isUser: boolean }) {
//   return (
//     <Avatar className={`h-9 w-9 shrink-0 ${
//       isUser 
//         ? "bg-gradient-to-br from-blue-500 to-blue-600"  // Blue for user
//         : "bg-gradient-to-br from-primary to-primary/60"  // Primary color for AI
//     }`}>
//       <AvatarFallback className="bg-transparent text-white">
//         {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
//       </AvatarFallback>
//     </Avatar>
//   );
// }

// // Label showing "You" or "AI Assistant"
// function MessageLabel({ isUser }: { isUser: boolean }) {
//   return (
//     <span className="text-xs font-medium text-muted-foreground px-1">
//       {isUser ? "You" : "AI Assistant"}
//     </span>
//   );
// }

// // The message bubble with text
// function MessageContent({ isUser, content }: { isUser: boolean; content: string }) {
//   return (
//     <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed break-words ${
//       isUser
//         ? "bg-primary text-primary-foreground rounded-tr-sm"  // User messages: primary color
//         : "bg-muted/50 backdrop-blur-sm text-foreground border border-border/50 rounded-tl-sm"  // AI messages: muted
//     }`}>
//       <p className="whitespace-pre-wrap">{content}</p>
//     </div>
//   );
// }

// // Footer with timestamp and copy button
// function MessageFooter({ 
//   isUser, 
//   timestamp, 
//   copied, 
//   onCopy,
//   formatTime 
// }: { 
//   isUser: boolean;
//   timestamp?: string;
//   copied: boolean;
//   onCopy: () => void;
//   formatTime: (timestamp?: string) => string;
// }) {
//   return (
//     <div className={`flex items-center gap-2 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
//       {/* Show timestamp if available */}
//       {timestamp && (
//         <span className="text-xs text-muted-foreground">
//           {formatTime(timestamp)}
//         </span>
//       )}

//       {/* Copy button - only for AI messages */}
//       {!isUser && (
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={onCopy}
//           className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
//           aria-label="Copy message"
//         >
//           {copied ? (
//             <Check className="h-3.5 w-3.5 text-green-500" />
//           ) : (
//             <Copy className="h-3.5 w-3.5" />
//           )}
//         </Button>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, User, Copy, Check, Edit2, X, Send } from "lucide-react";
import { toast } from "sonner";

// Define what a message looks like
interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

// Define what props this component accepts
interface MessageBubbleProps {
  message: Message;
  onEditAndResend?: (messageId: string, newContent: string) => Promise<void>;
}

export default function MessageBubble({ message, onEditAndResend }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content || "");
  const [isSending, setIsSending] = useState(false);
  
  if (!message) return null;

  const isUser = message.role === "user";

  const handleCopy = async () => {
    if (!message.content) return;
    
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleStartEdit = () => {
    setEditedContent(message.content || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content || "");
    setIsEditing(false);
  };

  const handleSaveAndResend = async () => {
    const trimmedContent = editedContent.trim();
    
    if (!trimmedContent) {
      toast.error("Message cannot be empty");
      return;
    }

    if (trimmedContent === message.content) {
      toast.info("No changes made");
      setIsEditing(false);
      return;
    }

    if (!onEditAndResend) {
      toast.error("Edit feature not available");
      return;
    }

    setIsSending(true);

    try {
      await onEditAndResend(message._id, trimmedContent);
      setIsEditing(false);
      // Success toast removed - parent handles success feedback
    } catch (error) {
      console.error("Failed to edit and resend:", error);
      toast.error("Failed to edit message");
    } finally {
      setIsSending(false);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveAndResend();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <Avatar className={`h-9 w-9 shrink-0 ${
        isUser 
          ? "bg-gradient-to-br from-blue-500 to-blue-600"
          : "bg-gradient-to-br from-primary to-primary/60"
      }`}>
        <AvatarFallback className="bg-transparent text-white">
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={`flex-1 max-w-[85%] md:max-w-2xl space-y-1 ${isUser ? "flex flex-col items-end" : ""}`}>
        {/* Label */}
        <span className="text-xs font-medium text-muted-foreground px-1">
          {isUser ? "You" : "AI Assistant"}
        </span>

        {/* Message or Edit Box */}
        {isEditing ? (
          <div className="w-full bg-muted/30 rounded-2xl border-2 border-primary/50 p-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyDown={handleEditKeyDown}
              disabled={isSending}
              className="min-h-[80px] max-h-[300px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm leading-relaxed"
              placeholder="Edit your message..."
              autoFocus
            />
          </div>
        ) : (
          <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed break-words ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted/50 backdrop-blur-sm text-foreground border border-border/50 rounded-tl-sm"
          }`}>
            <p className="whitespace-pre-wrap">{message.content || ""}</p>
          </div>
        )}

        {/* Footer */}
        {isEditing ? (
          <div className={`flex items-center gap-2 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSaveAndResend}
                disabled={isSending}
                size="sm"
                className="h-7 px-3 gap-1.5"
              >
                {isSending ? (
                  <>
                    <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span className="text-xs">Resend</span>
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancelEdit}
                disabled={isSending}
                size="sm"
                variant="outline"
                className="h-7 px-3 gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                <span className="text-xs">Cancel</span>
              </Button>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Press Enter • Esc to cancel
            </span>
          </div>
        ) : (
          <div className={`flex items-center gap-2 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            {message.createdAt && (
              <span className="text-xs text-muted-foreground">
                {formatTime(message.createdAt)}
              </span>
            )}
            <div className="flex items-center gap-1">
              {isUser && onEditAndResend && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStartEdit}
                  className="h-7 px-2"
                  title="Edit and resend"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
              )}
              {!isUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 px-2"
                  title={copied ? "Copied!" : "Copy message"}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}