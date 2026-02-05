
// import { useState, useRef, useEffect } from "react";
// import type { KeyboardEvent } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Send, Loader2 } from "lucide-react";
// import { toast } from "sonner";

// // Define what props this component accepts
// interface MessageInputProps {
//   chatId?: string;
//   onSendMessage: (content: string) => Promise<void>;
//   disabled?: boolean;
// }

// export default function MessageInput({ 
//   chatId, 
//   onSendMessage,
//   disabled = false 
// }: MessageInputProps) {
//   // State to track what user is typing
//   const [text, setText] = useState("");
  
//   // State to track if we're sending a message
//   const [loading, setLoading] = useState(false);
  
//   // Reference to the textarea element
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   // Auto-resize textarea as user types
//   useEffect(() => {
//     const textarea = textareaRef.current;
//     if (!textarea) return;

//     // Reset height first
//     textarea.style.height = "auto";
    
//     // Calculate new height (max 200px)
//     const newHeight = Math.min(textarea.scrollHeight, 200);
//     textarea.style.height = `${newHeight}px`;
//   }, [text]);

//   // Focus textarea when chat changes
//   useEffect(() => {
//     textareaRef.current?.focus();
//   }, [chatId]);

//   // Send the message
//   const handleSend = async () => {
//     const trimmedText = text.trim();
    
//     // Don't send if empty or already sending
//     if (!trimmedText || loading || disabled) {
//       return;
//     }

//     // Clear input right away (better UX)
//     setText("");
//     setLoading(true);

//     try {
//       // Send the message
//       await onSendMessage(trimmedText);
//     } catch (error) {
//       console.error("Failed to send:", error);
//       toast.error(`Failed to send message:${error instanceof Error ? error.message : "Unknown error"}`);
//       // Restore text if failed
//       setText(text);
//     } finally {
//       setLoading(false);
//       // setText(text)
//       // Focus back on input
//       textareaRef.current?.focus();
//     }
//   };

//   // Handle keyboard shortcuts
//   const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
//     // Enter = send (Shift+Enter = new line)
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // Check if send button should be disabled
//   const isSendDisabled = loading || disabled || !text.trim();

//   return (
//     <div className="border-t bg-background/95 backdrop-blur sticky bottom-0">
//       <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
//         {/* Input container */}
//         <div className="flex items-end gap-2 sm:gap-3 bg-muted/30 rounded-2xl border border-border/50 p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          
//           {/* Text input */}
//           <Textarea
//             ref={textareaRef}
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type your message... (Shift+Enter for new line)"
//             disabled={loading || disabled}
//             className="flex-1 min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 text-sm sm:text-base px-3 py-2.5"
//             rows={1}
//           />

//           {/* Send button */}
//           <Button
//             onClick={handleSend}
//             disabled={isSendDisabled}
//             size="icon"
//             className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl shrink-0 hover:scale-105 active:scale-95 disabled:hover:scale-100"
//           >
//             {loading ? (
//               <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
//             ) : (
//               <Send className="h-4 w-4 sm:h-5 sm:w-5" />
//             )}
//           </Button>
//         </div>

//         {/* Helper text (hidden on mobile) */}
//         <p className="text-xs text-muted-foreground/60 mt-2 text-center hidden sm:block">
//           Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> to send • 
//           <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] ml-1">Shift + Enter</kbd> for new line
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Square } from "lucide-react";
import { toast } from "sonner";

interface MessageInputProps {
  chatId?: string;
  onSendMessage: (content: string) => Promise<void>;
  onStopGenerating?: () => void;
  disabled?: boolean;
  isResponding?: boolean;
}

export default function MessageInput({
  chatId,
  onSendMessage,
  onStopGenerating,
  disabled = false,
  isResponding = false,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [text]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [chatId]);

  const handleSend = async () => {
    const trimmedText = text.trim();
    if (!trimmedText || loading || disabled) return;

    setText("");
    setLoading(true);

    try {
      await onSendMessage(trimmedText);
    } catch (error) {
      console.error("Failed to send:", error);
      toast.error(
        `Failed to send message:${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setText(trimmedText);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleStop = () => {
    if (onStopGenerating) {
      onStopGenerating();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isResponding) {
        handleSend();
      }
    }
  };

  const isSendDisabled = loading || disabled || !text.trim() || isResponding;

  return (
    <div className="border-t bg-background/95 backdrop-blur sticky bottom-0">
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="flex items-end gap-2 sm:gap-3 bg-muted/30 rounded-2xl border border-border/50 p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isResponding
                ? "AI is responding..."
                : "Type your message... (Shift+Enter for new line)"
            }
            disabled={loading || disabled || isResponding}
            className="flex-1 min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 text-sm sm:text-base px-3 py-2.5"
            rows={1}
          />

          {isResponding ? (
            <Button
              onClick={handleStop}
              size="icon"
              variant="destructive"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl shrink-0 hover:scale-105 active:scale-95"
              title="Stop generating"
            >
              <Square className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              disabled={isSendDisabled}
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl shrink-0 hover:scale-105 active:scale-95 disabled:hover:scale-100"
              title="Send message"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground/60 mt-2 text-center hidden sm:block">
          {isResponding ? (
            <>
              <kbd className="px-1.5 py-0.5 bg-destructive/20 text-destructive rounded text-[10px]">
                Stop
              </kbd>{" "}
              to cancel response
            </>
          ) : (
            <>
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">
                Enter
              </kbd>{" "}
              to send •{" "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] ml-1">
                Shift + Enter
              </kbd>{" "}
              for new line
            </>
          )}
        </p>
      </div>
    </div>
  );
}
