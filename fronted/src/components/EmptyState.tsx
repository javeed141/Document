import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, Zap, Lightbulb } from "lucide-react";

interface EmptyStateProps {
  onCreateNewChat?: () => void;
}

export default function EmptyState({ onCreateNewChat }: EmptyStateProps) {
  const suggestions = [
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Creative Writing",
      description: "Help me write a story",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Problem Solving",
      description: "Debug my code",
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "Learn Something",
      description: "Explain quantum physics",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-6 overflow-y-auto">
      <div className="max-w-2xl w-full space-y-6 md:space-y-8">
        {/* Icon & Title */}
        <div className="text-center space-y-3 md:space-y-4">
          <div className="w-14 h-14 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-3xl flex items-center justify-center shadow-lg">
            <MessageSquare className="h-7 w-7 md:h-10 md:w-10 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Start a Conversation
            </h2>
            <p className="text-xs md:text-base text-muted-foreground max-w-md mx-auto">
              Type a message below or choose a suggestion
            </p>
          </div>
        </div>

        {/* Suggestion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={onCreateNewChat}
              className="group p-3 md:p-4 bg-card hover:bg-accent border rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5 text-left"
            >
              <div className="flex flex-col gap-2 md:gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {suggestion.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-xs md:text-sm mb-0.5 md:mb-1">{suggestion.title}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground">{suggestion.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="text-center pb-4">
          <p className="text-[10px] md:text-xs text-muted-foreground">
            💡 Tip: I can help with coding, writing, research, and much more!
          </p>
        </div>
      </div>
    </div>
  );
}