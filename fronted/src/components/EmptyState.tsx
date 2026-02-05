import { MessageSquare, Sparkles, Zap, Lightbulb, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateNewChat?: () => void;
  creatingChat:boolean;
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
              No Chat Selected
            </h2>
            <p className="text-xs md:text-base text-muted-foreground max-w-md mx-auto">
              Create a new chat or select one from the sidebar to get started
            </p>
          </div>
        </div>

        {/* Create Chat Button */}
        <div className="flex justify-center">
          <Button
            onClick={onCreateNewChat}
            size="lg"
            className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="h-5 w-5" />
            <span>New Chat By Entering the text from Input Box</span>
          </Button>
        </div>

        {/* Suggestion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="group p-3 md:p-4 bg-card border rounded-xl"
            >
              <div className="flex flex-col gap-2 md:gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {suggestion.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-xs md:text-sm mb-0.5 md:mb-1">{suggestion.title}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground">{suggestion.description}</p>
                </div>
              </div>
            </div>
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