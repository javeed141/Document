import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../api/api";

import ChatSidebar from "@/components/ChatSidebar";
import EmptyState from "@/components/EmptyState";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";

export default function ChatPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Load chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${api}/api/chats`, {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });
        setChats(res.data);
      } catch (error) {
        console.error("Failed to load chats", error);
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

  return (
    <div className="flex h-screen bg-background text-foreground">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onSelect={loadChat}
        onNewChat={createNewChat}
      />

      <div className="flex flex-col flex-1">
        {!activeChat ? (
          <EmptyState />
        ) : (
          <>
            <div className="border-b p-4 bg-background">
              <h1 className="text-lg font-semibold">{activeChat.title}</h1>
            </div>
            <MessageList messages={messages} loading={loading} />
            <MessageInput
              chatId={activeChat._id}
              onSendMessage={async (content: string) => {
                // Add user message locally
                const userMessage = {
                  _id: Date.now().toString(),
                  role: "user",
                  content,
                  createdAt: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, userMessage]);

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
                  // Add AI response
                  setMessages((prev) => [...prev, res.data]);
                } catch (error) {
                  console.error("Failed to send message", error);
                  // Remove the user message if failed
                  setMessages((prev) => prev.filter(msg => msg._id !== userMessage._id));
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
