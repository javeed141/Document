import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MessageBubble({ message }: any) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start space-x-3 ${
        isUser ? "justify-end space-x-reverse" : "justify-start"
      }`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-xs md:max-w-xl px-3 py-2 md:px-4 md:py-3 rounded-lg text-sm leading-relaxed
          ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
      >
        {message.content}
        <div className="text-xs opacity-70 mt-1">
          {new Date(message.createdAt || Date.now()).toLocaleTimeString()}
        </div>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}