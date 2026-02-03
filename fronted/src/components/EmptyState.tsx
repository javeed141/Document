import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
type EmptyStateProps = {
  onNewChat: () => void;
};

export default function EmptyState({ onNewChat }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="relative mb-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
            <Sparkles className="h-6 w-6 text-primary absolute -top-1 -right-1" />
          </div>

          <h3 className="text-lg font-semibold mb-2">
            Welcome to DocumentAI
          </h3>

          <p className="text-muted-foreground mb-4">
            Start a conversation with our AI assistant.
          </p>

          <Button className="w-full" onClick={onNewChat}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Start New Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

