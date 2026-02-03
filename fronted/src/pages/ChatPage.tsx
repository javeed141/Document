import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../api/api";

import ChatSidebar from "@/components/ChatSidebar";
import EmptyState from "@/components/EmptyState";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ChatPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  // 🔹 Load chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setChatsLoading(true);
        const res = await axios.get(`${api}/api/chats`, {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });
        setChats(res.data);
      } catch (error) {
        console.error("Failed to load chats", error);
      } finally {
        setChatsLoading(false);
      }
    };

    fetchChats();
  }, []);

  // 🔹 Load messages for a chat
  const loadChat = async (chat: any) => {
    try {
      setActiveChat(chat);
      setLoading(true);

      const res = await axios.get(
        `${api}/api/chats/${chat._id}`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      setMessages(res.data.messages);
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create new chat
  const createNewChat = async () => {
    try {
      const timestamp = new Date().toLocaleString();
      const title = `New Chat ${timestamp}`;
      const res = await axios.post(
        `${api}/api/chats`,
        { title },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const newChat = res.data;
      setChats((prev) => [newChat, ...prev]);
      loadChat(newChat);
    } catch (error) {
      console.error("Failed to create new chat", error);
    }
  };

  // 🔹 Update chat
  const updateChat = (updatedChat: any) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat._id === updatedChat._id ? updatedChat : chat
      )
    );
    if (activeChat?._id === updatedChat._id) {
      setActiveChat(updatedChat);
    }
  };

  // 🔹 Delete chat
  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat._id !== chatId));
    if (activeChat?._id === chatId) {
      setActiveChat(null);
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`absolute inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onSelect={(chat: any) => {
            loadChat(chat);
            setSidebarOpen(false);
          }}
          onNewChat={createNewChat}
          onUpdateChat={updateChat}
          onDeleteChat={deleteChat}
          loading={chatsLoading}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 md:ml-64 md:border-l">
        {!activeChat ? (
          <EmptyState 
           onNewChat={createNewChat}
          />
        ) : (
          <>
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
              <div className="flex h-14 items-center px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden mr-2"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <h1 className="text-lg font-semibold truncate">
                    {activeChat.title}
                  </h1>
                </div>
                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                  {theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </header>
          <MessageList
  messages={messages}
  loading={loading}
  isResponding={isResponding}
/>

<MessageInput
  chatId={activeChat._id}
  onSendMessage={async (content: string) => {
    const userMessage = {
      _id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsResponding(true);

    try {
      const res = await axios.post(
        `${api}/api/chats/${activeChat._id}/messages`,
        { content },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== userMessage._id)
      );
    } finally {
      setIsResponding(false);
    }
  }}
/>

          </>
        )}
      </div>
    </div>
  );
}
