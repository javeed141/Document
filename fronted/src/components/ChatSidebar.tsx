import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function ChatSidebar({
  chats,
  activeChat,
  onSelect,
  onNewChat,
}: any) {
  return (
    <aside className="w-64 border-r bg-background">
      <Card className="h-full rounded-none border-0 border-r">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chats</CardTitle>
            <Button size="sm" variant="outline" onClick={onNewChat}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {chats.map((chat: any) => (
              <button
                key={chat._id}
                onClick={() => onSelect(chat)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                  ${
                    activeChat?._id === chat._id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
              >
                {chat.title}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
