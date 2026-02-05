

// import { useEffect, useState } from "react";
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
//   // ========== AUTHENTICATION ==========
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();

//   // ========== CHAT STATE ==========
//   const [activeChat, setActiveChat] = useState<Chat | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newChat, setNewChat] = useState<Chat | null>(null);

//   // ========== UI STATE ==========
//   const [loading, setLoading] = useState(false); // Loading messages
//   const [isResponding, setIsResponding] = useState(false); // AI is typing
//   const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar
//   const [isRestoring, setIsRestoring] = useState(true); // Initial load
//   const [isCreatingChat, setIsCreatingChat] = useState(false);

//   /* ===================== CHECK AUTHENTICATION ===================== */
//   // Redirect to login if no token found
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   /* ===================== RESTORE LAST ACTIVE CHAT ===================== */
//   // When page loads, try to restore the last chat user was viewing
//   useEffect(() => {
//     const restoreActiveChat = async () => {
//       const token = localStorage.getItem("token");

//       // No token = not logged in
//       if (!token) {
//         setIsRestoring(false);
//         return;
//       }

//       // Check if there was a saved active chat
//       const savedChatId = localStorage.getItem("activeChatId");

//       if (savedChatId) {
//         try {
//           // Try to load that chat
//           const res = await axios.get(`${api}/api/chats/${savedChatId}`, {
//             headers: { authorization: token },
//           });

//           const chat = res.data.chat || res.data;
//           setActiveChat(chat);
//           setMessages(res.data.messages || []);
//         } catch (error: any) {
//           // If chat doesn't exist anymore, clear it
//           console.log("Could not restore chat:", error.message);
//           localStorage.removeItem("activeChatId");
//         }
//       }

//       setIsRestoring(false);
//     };

//     restoreActiveChat();
//   }, []);

//   /* ===================== LOAD A CHAT ===================== */
//   // When user clicks on a chat in sidebar
//   const loadChat = async (chat: Chat) => {
//     // Set as active chat immediately for better UX
//     setActiveChat(chat);

//     // Save to localStorage so we can restore it later
//     localStorage.setItem("activeChatId", chat._id);

//     // Close mobile sidebar
//     setSidebarOpen(false);

//     // Clear old messages immediately to show loading state
//     setMessages([]);

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       // Fetch messages for this chat
//       const res = await axios.get(`${api}/api/chats/${chat._id}`, {
//         headers: { authorization: token },
//       });

//       setMessages(res.data.messages || []);
//     } catch (error: any) {
//       console.error("Failed to load chat:", error);
//       toast.error("Failed to load chat");
//       setMessages([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ===================== CREATE NEW CHAT ===================== */
//   const handleCreateNewChat = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       setIsCreatingChat(true)
//       // Generate a timestamp-based title
//       const title = `Chat - ${new Date().toLocaleString("en-US", {
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       })}`;

//       // Create chat on server
//       const res = await axios.post(
//         `${api}/api/chats`,
//         { title },
//         { headers: { authorization: token } }
//       );

//       const createdChat = res.data;

//       // Pass to sidebar so it can add to list
//       setNewChat(createdChat);
//       setActiveChat(createdChat)
//       // Load the new chat
//       loadChat(createdChat);
//       setIsCreatingChat(false)
//       toast.success("New chat created");
//     } catch (error: any) {
//       console.error("Failed to create chat:", error);
//       toast.error(`Failed to create chat: ${error.message}`);
//       setIsCreatingChat(false)

//     }
//   };

//   /* ===================== HANDLE CHAT DELETED ===================== */
//   // Called when a chat is deleted from sidebar
//   const handleChatDeleted = (deletedChatId: string) => {
//     // If the deleted chat was active, clear everything
//     if (activeChat?._id === deletedChatId) {
//       setActiveChat(null);
//       setMessages([]);
//       localStorage.removeItem("activeChatId");
//     }
//   };

//   /* ===================== SEND MESSAGE ===================== */
//  const handleSendMessage = async (content: string) => {
//   if (!content.trim() || isResponding) return;

//   const token = localStorage.getItem("token");

//   if (!token) {
//     toast.error("Please login again");
//     return;
//   }

//   /* =========================
//      NO ACTIVE CHAT → CREATE FLOW
//   ========================== */
//   if (!activeChat) {
//     setIsCreatingChat(true);

//     try {
//       // ---------- Generate title ----------
//       let smartTitle = "New Chat";

//       try {
//         const titleRes = await axios.post(
//           `${api}/api/chats/generate-title`,
//           { text: content },
//           { headers: { authorization: token } }
//         );

//         smartTitle = titleRes?.data?.title || "New Chat";
//       } catch (err) {
//         console.error("Title generation failed:", err);
//         toast.error("Title generation failed — using default");
//       }

//       // ---------- Create chat ----------
//       const chatRes = await axios.post(
//         `${api}/api/chats`,
//         { title: smartTitle },
//         { headers: { authorization: token } }
//       );

//       const createdChat = chatRes.data;
//       setNewChat(createdChat);
//       setActiveChat(createdChat);

//       // ---------- Temp message ----------
//       const userMessage: Message = {
//         _id: `temp-${Date.now()}`,
//         role: "user",
//         content: content.trim(),
//       };

//       setMessages((prev) => [...prev, userMessage]);
//       setIsResponding(true);

//       // ---------- Send first message ----------
//       const msgRes = await axios.post(
//         `${api}/api/chats/${createdChat._id}/messages`,
//         { content: content.trim() },
//         { headers: { authorization: token } }
//       );

//       setMessages((prev) =>
//         prev
//           .map((m) => (m._id === userMessage._id ? userMessage : m))
//           .concat(msgRes.data)
//       );

//     } catch (error: any) {
//       console.error("Create chat flow failed:", error);

//       toast.error(
//         error?.response?.data?.message ||
//         "Failed to create chat"
//       );

//     } finally {
//       setIsResponding(false);
//       setIsCreatingChat(false);
//     }

//     return;
//   }

//   /* =========================
//      EXISTING CHAT FLOW
//   ========================== */

//   const userMessage: Message = {
//     _id: `temp-${Date.now()}`,
//     role: "user",
//     content: content.trim(),
//   };

//   setMessages((prev) => [...prev, userMessage]);
//   setIsResponding(true);

//   try {
//     const res = await axios.post(
//       `${api}/api/chats/${activeChat._id}/messages`,
//       { content: content.trim() },
//       { headers: { authorization: token } }
//     );

//     setMessages((prev) =>
//       prev
//         .map((m) => (m._id === userMessage._id ? userMessage : m))
//         .concat(res.data)
//     );

//   } catch (error: any) {
//     console.error("Send message failed:", error);

//     toast.error(
//       error?.response?.data?.message ||
//       "Failed to send message"
//     );

//     // remove failed temp message
//     setMessages((prev) =>
//       prev.filter((m) => m._id !== userMessage._id)
//     );

//   } finally {
//     setIsResponding(false);
//   }
// };


//   /* ===================== LOADING SCREEN ===================== */
//   // Show loading while restoring previous chat
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

//   /* ===================== MAIN RENDER ===================== */
//   return (
//     <div className="flex h-screen bg-background text-foreground overflow-hidden">
//       {/* ========== MOBILE SIDEBAR OVERLAY ========== */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 md:hidden z-40 backdrop-blur-sm"
//           onClick={() => setSidebarOpen(false)}
//           aria-label="Close sidebar"
//         />
//       )}

//       {/* ========== SIDEBAR ========== */}
//       {/* On mobile: slides in from left when open */}
//       {/* On desktop: always visible */}
//       <div
//         className={`
//           fixed inset-y-0 left-0 z-50 w-72 sm:w-80 
//           transform transition-transform duration-300 ease-in-out
//           md:relative md:translate-x-0 md:w-64 lg:w-72
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//         `}
//       >
//         <ChatSidebar
//           activeChat={activeChat}
//           setActiveChat={(chat) => setActiveChat(chat)}
//           onSelect={loadChat}
//           onCreateNewChat={handleCreateNewChat}
//           onChatDeleted={handleChatDeleted}
//           newChat={newChat}
//           // ChatPage passes this function to ChatSidebar
//           closeSidebar={() => setSidebarOpen(false)}
//           creatingChat={isCreatingChat}
//         />
//       </div>

//       {/* ========== MAIN CONTENT AREA ========== */}
//       <div className="flex flex-col flex-1 min-w-0">
//         {/* ========== HEADER ========== */}
//         {/* Only show header when there's an active chat */}
//         {(
//           <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 shadow-sm">
//             <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 gap-2">
//               {/* Mobile menu button */}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="md:hidden shrink-0"
//                 onClick={() => setSidebarOpen(true)}
//                 aria-label="Open sidebar"
//               >
//                 <Menu className="h-5 w-5" />
//               </Button>

//               {/* Chat title */}
//               <h1 className="flex-1 font-semibold text-sm sm:text-base truncate min-w-0">
//                 {activeChat?.title || "Create a New Chat"}
//               </h1>

//               {/* Theme toggle button */}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={toggleTheme}
//                 className="shrink-0"
//                 aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
//               >
//                 {theme === "light" ? (
//                   <Moon className="h-5 w-5" />
//                 ) : (
//                   <Sun className="h-5 w-5" />
//                 )}
//               </Button>
//             </div>
//           </header>
//         )}

//         {/* ========== MESSAGES AREA ========== */}
//         {/* Show empty state if no active chat */}
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

//         {/* ========== MESSAGE INPUT ========== */}
//         {/* ALWAYS show input - even without active chat */}
//         <MessageInput
//           chatId={activeChat?._id}
//           onSendMessage={handleSendMessage}
//           disabled={isResponding}
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