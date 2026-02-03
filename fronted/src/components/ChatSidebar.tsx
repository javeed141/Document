import { useState, useCallback } from "react";
import axios from "axios";
import { api } from "@/api/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
} from "lucide-react";

type Props = {
  chats: any[];
  activeChat: any;
  onSelect: (chat: any) => void;
  onNewChat: () => void;
  onUpdateChat: (chat: any) => void;
  onDeleteChat: (id: string) => void;
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
};

export default function ChatSidebar({
  chats,
  activeChat,
  onSelect,
  onNewChat,
  onUpdateChat,
  onDeleteChat,
  onLoadMore,
  hasMore,
  loading,
}: Props) {
  const [editingChat, setEditingChat] = useState<any>(null);
  const [deletingChat, setDeletingChat] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Filter chats
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔹 Detect recent chats (last 48h)
  const isRecentChat = (chat: any) => {
    const chatDate = new Date(chat.updatedAt || chat.createdAt);
    const diff =
      (Date.now() - chatDate.getTime()) /
      (1000 * 60 * 60 * 24);
    return diff < 2;
  };

  // 🔹 Infinite scroll handler
  const handleScroll = useCallback(
    async (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } =
        e.currentTarget;

      if (
        scrollHeight - scrollTop < clientHeight + 80 &&
        hasMore &&
        !loading
      ) {
        await onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  // 🔹 Edit
  const openEdit = (chat: any) => {
    setEditingChat(chat);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;

    try {
      setIsUpdating(true);
      const res = await axios.put(
        `${api}/api/chats/${editingChat._id}`,
        { title: editTitle.trim() },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      onUpdateChat(res.data);
      setEditingChat(null);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // 🔹 Delete
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(
        `${api}/api/chats/${deletingChat._id}`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      onDeleteChat(deletingChat._id);
      setDeletingChat(null);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <aside className="w-full md:w-72 h-screen border-r bg-muted/30">
      <Card className="h-full rounded-none border-0 flex flex-col">
        {/* Header */}
        <CardHeader className="border-b bg-gradient-to-r from-primary/10 via-background to-background">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Chats
            </CardTitle>
            <Button
              size="icon"
              variant="secondary"
              onClick={onNewChat}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1 flex flex-col p-3 pr-0">
          {/* Search */}
          <div className="mb-3 pr-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-9"
              />
            </div>
          </div>

          {/* Chat list */}
          <div
            className="flex-1 overflow-y-auto space-y-2 pr-3"
            onScroll={handleScroll}
          >
            {filteredChats.map((chat) => (
              <div
                key={chat._id}
                className="flex items-center gap-2 group"
              >
                <button
                  onClick={() => onSelect(chat)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium truncate transition-all text-left
                    ${
                      activeChat?._id === chat._id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : isRecentChat(chat)
                        ? "bg-background hover:bg-muted"
                        : "bg-muted/60 hover:bg-muted text-muted-foreground"
                    }`}
                >
                  {chat.title}
                </button>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEdit(chat)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => setDeletingChat(chat)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Load more skeleton */}
            {hasMore && (
              <div className="py-3">
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ✏️ Edit Modal */}
      <Dialog open={!!editingChat} onOpenChange={() => setEditingChat(null)}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit chat title</DialogTitle>
          </DialogHeader>

          <Label>Title</Label>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isUpdating}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingChat(null)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isUpdating}
            >
              {isUpdating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🗑️ Delete Modal */}
      <Dialog
        open={!!deletingChat}
        onOpenChange={() => setDeletingChat(null)}
      >
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Delete chat</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Delete{" "}
            <span className="font-medium text-foreground">
              “{deletingChat?.title}”
            </span>
            ? This cannot be undone.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingChat(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
