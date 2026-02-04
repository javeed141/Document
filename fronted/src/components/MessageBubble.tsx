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
//   const isUser = message.role === "user";

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
//           <p className="whitespace-pre-wrap">{message.content}</p>
//         </div>

//         {/* Footer with timestamp and actions */}
//         <div className={`flex items-center gap-2 px-1 ${
//           isUser ? "flex-row-reverse" : "flex-row"
//         }`}>
//           {/* Timestamp */}
//           {message.createdAt && (
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
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, User, Copy, Check } from "lucide-react";
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
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  // Track if message was copied
  const [copied, setCopied] = useState(false);
  
  // Safety check - if no message, don't show anything
  if (!message) {
    return null;
  }

  // Check if this is a user message or AI message
  const isUser = message.role === "user";

  // Copy message to clipboard
  const handleCopy = async () => {
    if (!message.content) return;
    
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Copied to clipboard");
      
      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  // Format timestamp to readable time
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
    <div className={`flex items-start gap-3 group ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar Icon */}
      <MessageAvatar isUser={isUser} />

      {/* Message Content */}
      <div className={`flex-1 max-w-[85%] md:max-w-2xl space-y-1 ${isUser ? "flex flex-col items-end" : ""}`}>
        {/* Who sent the message */}
        <MessageLabel isUser={isUser} />

        {/* The actual message text */}
        <MessageContent isUser={isUser} content={message.content || ""} />

        {/* Footer with time and copy button */}
        <MessageFooter 
          isUser={isUser}
          timestamp={message.createdAt}
          copied={copied}
          onCopy={handleCopy}
          formatTime={formatTime}
        />
      </div>
    </div>
  );
}

// Avatar component - shows user or AI icon
function MessageAvatar({ isUser }: { isUser: boolean }) {
  return (
    <Avatar className={`h-9 w-9 shrink-0 ${
      isUser 
        ? "bg-gradient-to-br from-blue-500 to-blue-600"  // Blue for user
        : "bg-gradient-to-br from-primary to-primary/60"  // Primary color for AI
    }`}>
      <AvatarFallback className="bg-transparent text-white">
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </AvatarFallback>
    </Avatar>
  );
}

// Label showing "You" or "AI Assistant"
function MessageLabel({ isUser }: { isUser: boolean }) {
  return (
    <span className="text-xs font-medium text-muted-foreground px-1">
      {isUser ? "You" : "AI Assistant"}
    </span>
  );
}

// The message bubble with text
function MessageContent({ isUser, content }: { isUser: boolean; content: string }) {
  return (
    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed break-words ${
      isUser
        ? "bg-primary text-primary-foreground rounded-tr-sm"  // User messages: primary color
        : "bg-muted/50 backdrop-blur-sm text-foreground border border-border/50 rounded-tl-sm"  // AI messages: muted
    }`}>
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
}

// Footer with timestamp and copy button
function MessageFooter({ 
  isUser, 
  timestamp, 
  copied, 
  onCopy,
  formatTime 
}: { 
  isUser: boolean;
  timestamp?: string;
  copied: boolean;
  onCopy: () => void;
  formatTime: (timestamp?: string) => string;
}) {
  return (
    <div className={`flex items-center gap-2 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Show timestamp if available */}
      {timestamp && (
        <span className="text-xs text-muted-foreground">
          {formatTime(timestamp)}
        </span>
      )}

      {/* Copy button - only for AI messages */}
      {!isUser && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Copy message"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      )}
    </div>
  );
}