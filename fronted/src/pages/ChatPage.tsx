

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { api } from "../api/api";
// import { toast } from "sonner";

// import ChatSidebar from "@/components/ChatSidebar";
// import EmptyState from "@/components/EmptyState";
// import MessageList from "@/components/MessageList";
// import MessageInput from "@/components/MessageInput";
// import { Button } from "@/components/ui/button";
// import { Moon, Sun, Menu } from "lucide-react";
// import { useTheme } from "@/context/ThemeContext";
// import { useNavigate } from "react-router-dom";

// // Types for better type safety
// interface Chat {
//   _id: string;
//   title: string;
// }

// interface Message {
//   _id: string;
//   role: "user" | "assistant";
//   content: string;
// }

// export default function ChatPage() {
//   // Chat state
//   const [activeChat, setActiveChat] = useState<Chat | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newChat, setNewChat] = useState<Chat | null>(null);

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [isResponding, setIsResponding] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isRestoring, setIsRestoring] = useState(true);

//   const { theme, toggleTheme } = useTheme();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//     }
//   }, []);

//   /* ===================== RESTORE ACTIVE CHAT ON PAGE LOAD ===================== */
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
//           // Silent fail - just clear the saved chat
//           localStorage.removeItem("activeChatId");
//         }
//       }

//       setIsRestoring(false);
//     };

//     restoreActiveChat();
//   }, []);

//   /* ===================== LOAD CHAT ===================== */
//   const loadChat = async (chat: Chat) => {
//     setActiveChat(chat);
//     localStorage.setItem("activeChatId", chat._id);
//     setSidebarOpen(false);

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await axios.get(`${api}/api/chats/${chat._id}`, {
//         headers: { authorization: token },
//       });

//       setMessages(res.data.messages || []);
//     } catch (error: any) {
//       toast.error("Failed to load chat");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ===================== CREATE NEW CHAT ===================== */
//   const handleCreateNewChat = async () => {
//     try {
//       const token = localStorage.getItem("token");
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
//       loadChat(createdChat);

//       toast.success("New chat created");
//     } catch (error: any) {
//       toast.error("Failed to create chat");
//     }
//   };

//   /* ===================== SEND MESSAGE ===================== */
//   const handleSendMessage = async (content: string) => {
//     if (!content.trim() || isResponding) return;

//     // If no active chat, create one first
//     if (!activeChat) {
//       await handleCreateNewChat();
//       // Wait a bit for the chat to be created
//       await new Promise(resolve => setTimeout(resolve, 500));
//     }

//     const userMessage: Message = {
//       _id: `temp-${Date.now()}`,
//       role: "user",
//       content: content.trim(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setIsResponding(true);

//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.post(
//         `${api}/api/chats/${activeChat!._id}/messages`,
//         { content: content.trim() },
//         { headers: { authorization: token } }
//       );

//       setMessages((prev) => 
//         prev.map((m) => (m._id === userMessage._id ? userMessage : m))
//           .concat(res.data)
//       );
//     } catch (error: any) {
//       toast.error("Failed to send message");
//       setMessages((prev) => prev.filter((m) => m._id !== userMessage._id));
//     } finally {
//       setIsResponding(false);
//     }
//   };

//   /* ===================== LOADING STATE ===================== */
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
//       {/* Overlay for mobile sidebar */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 md:hidden z-40 backdrop-blur-sm"
//           onClick={() => setSidebarOpen(false)}
//           aria-label="Close sidebar"
//         />
//       )}

//       {/* Sidebar */}
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
//           onSelect={loadChat}
//           onCreateNewChat={handleCreateNewChat}
//           newChat={newChat}
//         />
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-col flex-1 min-w-0">
//         {/* Header - Always show when there's an active chat */}
//         {activeChat && (
//           <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 shadow-sm">
//             <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 gap-2">
//               {/* Mobile Menu Button */}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="md:hidden shrink-0"
//                 onClick={() => setSidebarOpen(true)}
//                 aria-label="Open sidebar"
//               >
//                 <Menu className="h-5 w-5" />
//               </Button>

//               {/* Chat Title */}
//               <h1 className="flex-1 font-semibold text-sm sm:text-base truncate min-w-0">
//                 {activeChat.title}
//               </h1>

//               {/* Theme Toggle */}
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

//         {/* Messages or Empty State */}
//         {!activeChat || messages.length === 0 ? (
//           <div className="flex-1 overflow-hidden">
//             <EmptyState onCreateNewChat={handleCreateNewChat} />
//           </div>
//         ) : (
//           <MessageList
//             messages={messages}
//             loading={loading}
//             isResponding={isResponding}
//           />
//         )}

//         {/* Input - ALWAYS SHOW (this is the key fix!) */}
//         <MessageInput
//           chatId={activeChat?._id}
//           onSendMessage={handleSendMessage}
//           disabled={isResponding}
//         />
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
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
  // ========== AUTHENTICATION ==========
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // ========== CHAT STATE ==========
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newChat, setNewChat] = useState<Chat | null>(null);

  // ========== UI STATE ==========
  const [loading, setLoading] = useState(false); // Loading messages
  const [isResponding, setIsResponding] = useState(false); // AI is typing
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar
  const [isRestoring, setIsRestoring] = useState(true); // Initial load
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  /* ===================== CHECK AUTHENTICATION ===================== */
  // Redirect to login if no token found
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  /* ===================== RESTORE LAST ACTIVE CHAT ===================== */
  // When page loads, try to restore the last chat user was viewing
  useEffect(() => {
    const restoreActiveChat = async () => {
      const token = localStorage.getItem("token");

      // No token = not logged in
      if (!token) {
        setIsRestoring(false);
        return;
      }

      // Check if there was a saved active chat
      const savedChatId = localStorage.getItem("activeChatId");

      if (savedChatId) {
        try {
          // Try to load that chat
          const res = await axios.get(`${api}/api/chats/${savedChatId}`, {
            headers: { authorization: token },
          });

          const chat = res.data.chat || res.data;
          setActiveChat(chat);
          setMessages(res.data.messages || []);
        } catch (error: any) {
          // If chat doesn't exist anymore, clear it
          console.log("Could not restore chat:", error.message);
          localStorage.removeItem("activeChatId");
        }
      }

      setIsRestoring(false);
    };

    restoreActiveChat();
  }, []);

  /* ===================== LOAD A CHAT ===================== */
  // When user clicks on a chat in sidebar
  const loadChat = async (chat: Chat) => {
    // Set as active chat immediately for better UX
    setActiveChat(chat);

    // Save to localStorage so we can restore it later
    localStorage.setItem("activeChatId", chat._id);

    // Close mobile sidebar
    setSidebarOpen(false);

    // Clear old messages immediately to show loading state
    setMessages([]);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch messages for this chat
      const res = await axios.get(`${api}/api/chats/${chat._id}`, {
        headers: { authorization: token },
      });

      setMessages(res.data.messages || []);
    } catch (error: any) {
      console.error("Failed to load chat:", error);
      toast.error("Failed to load chat");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== CREATE NEW CHAT ===================== */
  const handleCreateNewChat = async () => {
    try {
      const token = localStorage.getItem("token");
      setIsCreatingChat(true)
      // Generate a timestamp-based title
      const title = `Chat - ${new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      // Create chat on server
      const res = await axios.post(
        `${api}/api/chats`,
        { title },
        { headers: { authorization: token } }
      );

      const createdChat = res.data;

      // Pass to sidebar so it can add to list
      setNewChat(createdChat);
      setActiveChat(createdChat)
      // Load the new chat
      loadChat(createdChat);
      setIsCreatingChat(false)
      toast.success("New chat created");
    } catch (error: any) {
      console.error("Failed to create chat:", error);
      toast.error(`Failed to create chat: ${error.message}`);
      setIsCreatingChat(false)

    }
  };

  /* ===================== HANDLE CHAT DELETED ===================== */
  // Called when a chat is deleted from sidebar
  const handleChatDeleted = (deletedChatId: string) => {
    // If the deleted chat was active, clear everything
    if (activeChat?._id === deletedChatId) {
      setActiveChat(null);
      setMessages([]);
      localStorage.removeItem("activeChatId");
    }
  };

  /* ===================== SEND MESSAGE ===================== */
  const handleSendMessage = async (content: string) => {
    // Don't send if empty or already responding
    if (!content.trim() || isResponding) return;

    // MUST have an active chat to send message
    if (!activeChat) {
      setIsCreatingChat(true)

      const token = localStorage.getItem("token");
      // Generate a timestamp-based title

      const titleRes = await axios.post(
        `${api}/api/chats/generate-title`,
        { text: content },
        { headers: { authorization: token } }
      );

      const smartTitle = titleRes?.data?.title;


      // Create chat on server
      const res = await axios.post(
        `${api}/api/chats`,
        { title: smartTitle },
        { headers: { authorization: token } }
      );

      const createdChat = res.data;

      // Pass to sidebar so it can add to list
      setNewChat(createdChat);
      setActiveChat(createdChat)
      console.log("content: ", content)
      type Message = {
        _id: string;
        role: "user" | "assistant";
        content: string;
      };
      const userMessage: Message = {
        _id: `temp-${Date.now()}`,
        role: "user",
        content: content.trim(),
      };


      setMessages((prev) => [...prev, userMessage])
      setIsResponding(true)
      setIsCreatingChat(false)
      const res1 = await axios.post(
        `${api}/api/chats/${createdChat._id}/messages`,
        { content: content.trim() },
        { headers: { authorization: token } }
      );

      // Replace temp message + add AI response
      setMessages((prev) =>
        prev
          .map((m) => (m._id === userMessage._id ? userMessage : m))
          .concat(res1.data)
      );
      setIsResponding(false)
      setIsCreatingChat(false)

      return;
      // return;
    }

    // Create temporary user message
    const userMessage: Message = {
      _id: `temp-${Date.now()}`,
      role: "user",
      content: content.trim(),
    };


    // Show user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setIsResponding(true);

    try {
      const token = localStorage.getItem("token");

      // Send to server
      const res = await axios.post(
        `${api}/api/chats/${activeChat._id}/messages`,
        { content: content.trim() },
        { headers: { authorization: token } }
      );

      // Replace temp message + add AI response
      setMessages((prev) =>
        prev
          .map((m) => (m._id === userMessage._id ? userMessage : m))
          .concat(res.data)
      );
    } catch (error: any) {
      console.error("Failed to send message:", error);
      toast.error(`Failed to send message:${error.message}`);

      // Remove the failed message
      setMessages((prev) => prev.filter((m) => m._id !== userMessage._id));
    } finally {
      setIsResponding(false);
    }
  };

  /* ===================== LOADING SCREEN ===================== */
  // Show loading while restoring previous chat
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
      {/* ========== MOBILE SIDEBAR OVERLAY ========== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 md:hidden z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* ========== SIDEBAR ========== */}
      {/* On mobile: slides in from left when open */}
      {/* On desktop: always visible */}
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
          setActiveChat={(chat) => setActiveChat(chat)}
          onSelect={loadChat}
          onCreateNewChat={handleCreateNewChat}
          onChatDeleted={handleChatDeleted}
          newChat={newChat}
          // ChatPage passes this function to ChatSidebar
          closeSidebar={() => setSidebarOpen(false)}
          creatingChat={isCreatingChat}
        />
      </div>

      {/* ========== MAIN CONTENT AREA ========== */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* ========== HEADER ========== */}
        {/* Only show header when there's an active chat */}
        {(
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 shadow-sm">
            <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 gap-2">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden shrink-0"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Chat title */}
              <h1 className="flex-1 font-semibold text-sm sm:text-base truncate min-w-0">
                {activeChat?.title || "Create a New Chat"}
              </h1>

              {/* Theme toggle button */}
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
        )}

        {/* ========== MESSAGES AREA ========== */}
        {/* Show empty state if no active chat */}
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

        {/* ========== MESSAGE INPUT ========== */}
        {/* ALWAYS show input - even without active chat */}
        <MessageInput
          chatId={activeChat?._id}
          onSendMessage={handleSendMessage}
          disabled={isResponding}
        />
      </div>
    </div>
  );
}