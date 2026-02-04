import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../api/api";
import { toast } from "sonner";

import ChatSidebar from "@/components/ChatSidebar";
import EmptyState from "@/components/EmptyState";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// Types for better type safety
interface Chat {
  _id: string;
  title: string;
}

interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  // Chat state
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  const { theme, toggleTheme } = useTheme();

  /* ===================== RESTORE ACTIVE CHAT ON PAGE LOAD ===================== */
  useEffect(() => {
    const restoreActiveChat = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsRestoring(false);
        return;
      }

      const savedChatId = localStorage.getItem("activeChatId");

      if (savedChatId) {
        try {
          const res = await axios.get(`${api}/api/chats/${savedChatId}`, {
            headers: { authorization: token },
          });

          const chat = res.data.chat || res.data;
          setActiveChat(chat);
          setMessages(res.data.messages || []);
        } catch (error: any) {
          handleApiError(error, "restore");
        }
      }

      setIsRestoring(false);
    };

    restoreActiveChat();
  }, []);

  /* ===================== ERROR HANDLER ===================== */
  const handleApiError = (error: any, context: string) => {
    const status = error.response?.status;

    if (status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.clear();
      window.location.href = "/login";
    } else if (status === 404) {
      if (context === "restore" || context === "load") {
        localStorage.removeItem("activeChatId");
        setActiveChat(null);
        setMessages([]);
        toast.error("Chat not found.");
      }
    } else {
      const errorMessages: Record<string, string> = {
        restore: "Could not restore previous chat",
        load: "Failed to load chat",
        create: "Failed to create new chat",
        send: "Failed to send message",
      };
      toast.error(errorMessages[context] || "Something went wrong");
    }
  };

  /* ===================== LOAD CHAT ===================== */
  const loadChat = async (chat: Chat) => {
    setActiveChat(chat);
    localStorage.setItem("activeChatId", chat._id);
    setSidebarOpen(false); // Auto-close sidebar on mobile
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${api}/api/chats/${chat._id}`, {
        headers: { authorization: token },
      });

      setMessages(res.data.messages || []);
    } catch (error: any) {
      handleApiError(error, "load");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== CREATE NEW CHAT ===================== */
  const handleCreateNewChat = async () => {
    try {
      const token = localStorage.getItem("token");
      const title = `Chat - ${new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      const res = await axios.post(
        `${api}/api/chats`,
        { title },
        { headers: { authorization: token } }
      );

      loadChat(res.data);
      toast.success("New chat created");
    } catch (error: any) {
      handleApiError(error, "create");
    }
  };

  /* ===================== SEND MESSAGE ===================== */
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isResponding) return;

    const userMessage: Message = {
      _id: `temp-${Date.now()}`,
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsResponding(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${api}/api/chats/${activeChat!._id}/messages`,
        { content: content.trim() },
        { headers: { authorization: token } }
      );

      // Replace temp message with real one
      setMessages((prev) => 
        prev.map((m) => (m._id === userMessage._id ? userMessage : m))
          .concat(res.data)
      );
    } catch (error: any) {
      handleApiError(error, "send");
      // Remove failed message
      setMessages((prev) => prev.filter((m) => m._id !== userMessage._id));
    } finally {
      setIsResponding(false);
    }
  };

  /* ===================== LOADING STATE ===================== */
  if (isRestoring) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  /* ===================== MAIN RENDER ===================== */
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 md:hidden z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 sm:w-80 
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-64 lg:w-72
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <ChatSidebar
          activeChat={activeChat}
          onSelect={loadChat}
          onCreateNewChat={handleCreateNewChat}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {!activeChat ? (
          <EmptyState onNewChat={handleCreateNewChat} />
        ) : (
          <>
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 shadow-sm">
              <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 gap-2">
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden shrink-0"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5" />
                </Button>

                {/* Chat Title */}
                <h1 className="flex-1 font-semibold text-sm sm:text-base truncate min-w-0">
                  {activeChat.title}
                </h1>

                {/* Theme Toggle */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleTheme}
                  className="shrink-0"
                  aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                >
                  {theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </header>

            {/* Messages */}
            <MessageList
              messages={messages}
              loading={loading}
              isResponding={isResponding}
            />

            {/* Input */}
            <MessageInput
              chatId={activeChat._id}
              onSendMessage={handleSendMessage}
              disabled={isResponding}
            />
          </>
        )}
      </div>
    </div>
  );
}