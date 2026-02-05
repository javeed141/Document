
// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { api } from "../api/api";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// import ChatSidebar from "@/components/ChatSidebar";
// import EmptyState from "@/components/EmptyState";
// import MessageList from "@/components/MessageList";
// import MessageInput from "@/components/MessageInput";
// import { Button } from "@/components/ui/button";
// import { Moon, Sun, Menu } from "lucide-react";
// import { useTheme } from "@/context/ThemeContext";

// /* ===================== TYPE DEFINITIONS ===================== */
// interface Chat {
//   _id: string;
//   title: string;
//   createdAt?: string;
// }

// interface Message {
//   _id: string;
//   role: "user" | "assistant";
//   content: string;
//   createdAt?: string;
// }

// /* ===================== MAIN COMPONENT ===================== */
// export default function ChatPage() {
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();

//   const [activeChat, setActiveChat] = useState<Chat | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newChat, setNewChat] = useState<Chat | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isResponding, setIsResponding] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isRestoring, setIsRestoring] = useState(true);
//   const [isCreatingChat, setIsCreatingChat] = useState(false);

//   // ========== ABORT CONTROLLER FOR CANCELLING REQUESTS ==========
//   const abortControllerRef = useRef<AbortController | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) navigate("/login");
//   }, [navigate]);

//   useEffect(() => {
//     return () => {
//       if (abortControllerRef.current) abortControllerRef.current.abort();
//     };
//   }, []);

//   useEffect(() => {
//     const restoreActiveChat = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setIsRestoring(false);
//         return;
//       }

//       const savedChatId = localStorage.getItem("activeChatId");
//       if (savedChatId) {
//         try {
//           const res = await axios.get(`${api}/api/chats/${savedChatId}`, {
//             headers: { authorization: token },
//           });
//           const chat = res.data.chat || res.data;
//           setActiveChat(chat);
//           setMessages(res.data.messages || []);
//         } catch (error: any) {
//           localStorage.removeItem("activeChatId");
//         }
//       }
//       setIsRestoring(false);
//     };
//     restoreActiveChat();
//   }, []);

//   const loadChat = async (chat: Chat) => {
//     setActiveChat(chat);
//     localStorage.setItem("activeChatId", chat._id);
//     setSidebarOpen(false);
//     setMessages([]);

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${api}/api/chats/${chat._id}`, {
//         headers: { authorization: token },
//       });
//       setMessages(res.data.messages || []);
//     } catch (error: any) {
//       toast.error("Failed to load chat");
//       setMessages([]);
//     } finally {
//       setLoading(false);
//     }
//   };
// useEffect(() => {
//   if (activeChat?.title) {
//     document.title = activeChat.title;
//   } else {
//     document.title = "New Chat";
//   }
// }, [activeChat]);

//   const handleCreateNewChat = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       setIsCreatingChat(true);
//       const title = `Chat - ${new Date().toLocaleString("en-US", {
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       })}`;

//       const res = await axios.post(
//         `${api}/api/chats`,
//         { title },
//         { headers: { authorization: token } }
//       );

//       const createdChat = res.data;
//       setNewChat(createdChat);
//       setActiveChat(createdChat);
//       loadChat(createdChat);
//       toast.success("New chat created");
//     } catch (error: any) {
//       toast.error(`Failed to create chat: ${error.message}`);
//     } finally {
//       setIsCreatingChat(false);
//     }
//   };

//   const handleChatDeleted = (deletedChatId: string) => {
//     if (activeChat?._id === deletedChatId) {
//       setActiveChat(null);
//       setMessages([]);
//       localStorage.removeItem("activeChatId");
//     }
//   };

//   /* ===================== STOP GENERATING ===================== */
//   const handleStopGenerating = () => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//       abortControllerRef.current = null;
//       setIsResponding(false);
//       toast.info("Response generation stopped");
//     }
//   };

//   /* ===================== SEND MESSAGE ===================== */
//   const handleSendMessage = async (content: string) => {
//     if (!content.trim() || isResponding) return;

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login again");
//       return;
//     }

//     abortControllerRef.current = new AbortController();

//     if (!activeChat) {
//       setIsCreatingChat(true);

//       try {
//         let smartTitle = "New Chat";

//         try {
//           const titleRes = await axios.post(
//             `${api}/api/chats/generate-title`,
//             { text: content },
//             {
//               headers: { authorization: token },
//               signal: abortControllerRef.current.signal,
//             }
//           );
//           smartTitle = titleRes?.data?.title || "New Chat";
//     document.title = smartTitle;



//         } catch (err: any) {
//           if (err.name === "CanceledError") return;
//           toast.error("Title generation failed — using default");
//         }

//         const chatRes = await axios.post(
//           `${api}/api/chats`,
//           { title: smartTitle },
//           {
//             headers: { authorization: token },
//             signal: abortControllerRef.current.signal,
//           }
//         );
//         setIsCreatingChat(false);
//         const createdChat = chatRes.data;
//         setNewChat(createdChat);
//         setActiveChat(createdChat);
//         localStorage.setItem("activeChatId", createdChat._id);

//         const userMessage: Message = {
//           _id: `temp-${Date.now()}`,
//           role: "user",
//           content: content.trim(),
//         };

//         setMessages((prev) => [...prev, userMessage]);
//         setIsResponding(true);

//         const msgRes = await axios.post(
//           `${api}/api/chats/${createdChat._id}/messages`,
//           { content: content.trim() },
//           {
//             headers: { authorization: token },
//             signal: abortControllerRef.current.signal,
//           }
//         );

//         setMessages((prev) =>
//           prev
//             .map((m) => (m._id === userMessage._id ? userMessage : m))
//             .concat(msgRes.data)
//         );
//       } catch (error: any) {
//         if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
//           return;
//         }
//         toast.error(error?.response?.data?.message || "Failed to create chat");
//       } finally {
//         setIsResponding(false);
//         setIsCreatingChat(false);
//         abortControllerRef.current = null;
//       }

//       return;
//     }

//     const userMessage: Message = {
//       _id: `temp-${Date.now()}`,
//       role: "user",
//       content: content.trim(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setIsResponding(true);

//     try {
//       const res = await axios.post(
//         `${api}/api/chats/${activeChat._id}/messages`,
//         { content: content.trim() },
//         {
//           headers: { authorization: token },
//           signal: abortControllerRef.current.signal,
//         }
//       );

//       setMessages((prev) =>
//         prev
//           .map((m) => (m._id === userMessage._id ? userMessage : m))
//           .concat(res.data)
//       );
//     } catch (error: any) {
//       if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
//         return;
//       }
//       toast.error(error?.response?.data?.message || "Failed to send message");
//       setMessages((prev) => prev.filter((m) => m._id !== userMessage._id));
//     } finally {
//       setIsResponding(false);
//       abortControllerRef.current = null;
//     }
//   };

//   if (isRestoring) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background">
//         <div className="text-center space-y-3">
//           <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto" />
//           <p className="text-sm text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-background text-foreground overflow-hidden">
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 md:hidden z-40 backdrop-blur-sm"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 lg:w-72 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <ChatSidebar
//           activeChat={activeChat}
//           setActiveChat={setActiveChat}
//           onSelect={loadChat}
//           onCreateNewChat={handleCreateNewChat}
//           onChatDeleted={handleChatDeleted}
//           newChat={newChat}
//           closeSidebar={() => setSidebarOpen(false)}
//           creatingChat={isCreatingChat}
//         />
//       </div>

//       <div className="flex flex-col flex-1 min-w-0">
//         <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-30 shadow-sm">
//           <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 gap-2">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="md:hidden shrink-0"
//               onClick={() => setSidebarOpen(true)}
//             >
//               <Menu className="h-5 w-5" />
//             </Button>

//             <h1 className="flex-1 font-semibold text-sm sm:text-base truncate min-w-0">
//               {activeChat?.title || "Create a New Chat"}
//             </h1>

//             <Button variant="ghost" size="sm" onClick={toggleTheme} className="shrink-0">
//               {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
//             </Button>
//           </div>
//         </header>

//         {!activeChat ? (
//           <div className="flex-1 overflow-hidden">
//             <EmptyState onCreateNewChat={handleCreateNewChat} creatingChat={isCreatingChat} />
//           </div>
//         ) : (
//           <MessageList
//             activeChat={activeChat}
//             messages={messages}
//             loading={loading}
//             isResponding={isResponding}
//           />
//         )}

//         <MessageInput
//           chatId={activeChat?._id}
//           onSendMessage={handleSendMessage}
//           onStopGenerating={handleStopGenerating}
//           disabled={isCreatingChat}
//           isResponding={isResponding}
//         />
//       </div>
//     </div>
//   );
// }


import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { api } from "../api/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import ChatSidebar from "@/components/ChatSidebar";
import EmptyState from "@/components/EmptyState";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

/* ===================== TYPE DEFINITIONS ===================== */
interface Chat {
  _id: string;
  title: string;
  createdAt?: string;
}

interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

/* ===================== MAIN COMPONENT ===================== */
export default function ChatPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newChat, setNewChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  // ========== ABORT CONTROLLER FOR CANCELLING REQUESTS ==========
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

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
          localStorage.removeItem("activeChatId");
        }
      }
      setIsRestoring(false);
    };
    restoreActiveChat();
  }, []);

  const loadChat = async (chat: Chat) => {
    setActiveChat(chat);
    localStorage.setItem("activeChatId", chat._id);
    setSidebarOpen(false);
    setMessages([]);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/api/chats/${chat._id}`, {
        headers: { authorization: token },
      });
      setMessages(res.data.messages || []);
    } catch (error: any) {
      toast.error("Failed to load chat");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeChat?.title) {
      document.title = activeChat.title;
    } else {
      document.title = "New Chat";
    }
  }, [activeChat]);

  const handleCreateNewChat = async () => {
    try {
      const token = localStorage.getItem("token");
      setIsCreatingChat(true);
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

      const createdChat = res.data;
      setNewChat(createdChat);
      setActiveChat(createdChat);
      loadChat(createdChat);
      toast.success("New chat created");
    } catch (error: any) {
      toast.error(`Failed to create chat: ${error.message}`);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleChatDeleted = (deletedChatId: string) => {
    if (activeChat?._id === deletedChatId) {
      setActiveChat(null);
      setMessages([]);
      localStorage.removeItem("activeChatId");
    }
  };

  /* ===================== STOP GENERATING ===================== */
  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsResponding(false);
      toast.info("Response generation stopped");
    }
  };

  /* ===================== EDIT AND RESEND MESSAGE ===================== */
  const handleEditAndResend = async (messageId: string, newContent: string) => {
    if (!activeChat) {
      toast.error("No active chat");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login again");
      return;
    }

    try {
      // Find the index of the message being edited
      const messageIndex = messages.findIndex((msg) => msg._id === messageId);
      if (messageIndex === -1) {
        toast.error("Message not found");
        return;
      }

      // Get all messages from the edited message onwards (these will be deleted)
      const messagesToDelete = messages.slice(messageIndex);

      // Delete all messages from this point forward
      for (const msg of messagesToDelete) {
        // Skip temp messages
        if (msg._id.startsWith("temp-")) continue;

        try {
          await axios.delete(`${api}/api/messages/${msg._id}`, {
            headers: { authorization: token },
          });
        } catch (error) {
          console.error("Failed to delete message:", error);
        }
      }

      // Update local state - remove all messages from edited message onwards
      setMessages((prev) => prev.slice(0, messageIndex));

      // Send the new edited message
      await handleSendMessage(newContent);

      // Show single success message
      toast.success("Message edited and resent");
    } catch (error: any) {
      console.error("Failed to edit and resend:", error);
      toast.error("Failed to edit message");
      throw error;
    }
  };

  /* ===================== SEND MESSAGE ===================== */
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isResponding) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login again");
      return;
    }

    abortControllerRef.current = new AbortController();

    if (!activeChat) {
      setIsCreatingChat(true);

      try {
        let smartTitle = "New Chat";

        try {
          const titleRes = await axios.post(
            `${api}/api/chats/generate-title`,
            { text: content },
            {
              headers: { authorization: token },
              signal: abortControllerRef.current.signal,
            }
          );
          smartTitle = titleRes?.data?.title || "New Chat";
          document.title = smartTitle;
        } catch (err: any) {
          if (err.name === "CanceledError") return;
          toast.error("Title generation failed — using default");
        }

        const chatRes = await axios.post(
          `${api}/api/chats`,
          { title: smartTitle },
          {
            headers: { authorization: token },
            signal: abortControllerRef.current.signal,
          }
        );
        setIsCreatingChat(false);
        const createdChat = chatRes.data;
        setNewChat(createdChat);
        setActiveChat(createdChat);
        localStorage.setItem("activeChatId", createdChat._id);

        const userMessage: Message = {
          _id: `temp-${Date.now()}`,
          role: "user",
          content: content.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsResponding(true);

        const msgRes = await axios.post(
          `${api}/api/chats/${createdChat._id}/messages`,
          { content: content.trim() },
          {
            headers: { authorization: token },
            signal: abortControllerRef.current.signal,
          }
        );

        setMessages((prev) =>
          prev
            .map((m) => (m._id === userMessage._id ? userMessage : m))
            .concat(msgRes.data)
        );
      } catch (error: any) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          return;
        }
        toast.error(error?.response?.data?.message || "Failed to create chat");
      } finally {
        setIsResponding(false);
        setIsCreatingChat(false);
        abortControllerRef.current = null;
      }

      return;
    }

    const userMessage: Message = {
      _id: `temp-${Date.now()}`,
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsResponding(true);

    try {
      const res = await axios.post(
        `${api}/api/chats/${activeChat._id}/messages`,
        { content: content.trim() },
        {
          headers: { authorization: token },
          signal: abortControllerRef.current.signal,
        }
      );

      setMessages((prev) =>
        prev
          .map((m) => (m._id === userMessage._id ? userMessage : m))
          .concat(res.data)
      );
    } catch (error: any) {
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        return;
      }
      toast.error(error?.response?.data?.message || "Failed to send message");
      setMessages((prev) => prev.filter((m) => m._id !== userMessage._id));
    } finally {
      setIsResponding(false);
      abortControllerRef.current = null;
    }
  };

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

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 md:hidden z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 lg:w-72 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ChatSidebar
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          onSelect={loadChat}
          onCreateNewChat={handleCreateNewChat}
          onChatDeleted={handleChatDeleted}
          newChat={newChat}
          closeSidebar={() => setSidebarOpen(false)}
          creatingChat={isCreatingChat}
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-30 shadow-sm">
          <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <h1 className="flex-1 font-semibold text-sm sm:text-base truncate min-w-0">
              {activeChat?.title || "Create a New Chat"}
            </h1>

            <Button variant="ghost" size="sm" onClick={toggleTheme} className="shrink-0">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {!activeChat ? (
          <div className="flex-1 overflow-hidden">
            <EmptyState onCreateNewChat={handleCreateNewChat} creatingChat={isCreatingChat} />
          </div>
        ) : (
          <MessageList
            activeChat={activeChat}
            messages={messages}
            loading={loading}
            isResponding={isResponding}
            onEditAndResend={handleEditAndResend}
          />
        )}

        <MessageInput
          chatId={activeChat?._id}
          onSendMessage={handleSendMessage}
          onStopGenerating={handleStopGenerating}
          disabled={isCreatingChat}
          isResponding={isResponding}
        />
      </div>
    </div>
  );
}