// import { useState,useRef, useEffect } from "react";
// import axios from "axios";
// import { api } from "../api/api";

// import ChatSidebar from "@/components/ChatSidebar";
// import EmptyState from "@/components/EmptyState";
// import MessageList from "@/components/MessageList";
// import MessageInput from "@/components/MessageInput";
// import { Button } from "@/components/ui/button";
// import { Moon, Sun, Menu } from "lucide-react";
// import { useTheme } from "@/context/ThemeContext";

// export default function ChatPage() {
//   const [activeChat, setActiveChat] = useState<any>(null);
//   const [messages, setMessages] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isResponding, setIsResponding] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const[userDetails,setUserDetails]=useState<any>(null);



//   useEffect(()=>{
//       const user = localStorage.getItem("user");
//       if(!user) return ;
//       setUserDetails( JSON.parse(user));
//   },[])

//   const { theme, toggleTheme } = useTheme();
// const sidebarRef = useRef<{ createNewChat: () => void } | null>(null);

//   /* Load messages */
//   const loadChat = async (chat: any) => {
//     setActiveChat(chat);
//     setLoading(true);

//     const res = await axios.get(`${api}/api/chats/${chat._id}`, {
//       headers: { authorization: localStorage.getItem("token") },
//     });

//     setMessages(res.data.messages);
//     setLoading(false);
//   };

//   return (
//     <div className="flex h-screen bg-background text-foreground">
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`absolute inset-y-0 left-0 z-50 w-64 transform transition-transform md:relative md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//        <ChatSidebar
//   ref={sidebarRef}
//   activeChat={activeChat}
//   onSelect={(chat) => {
//     loadChat(chat);
//     setSidebarOpen(false);
//   }}

// />

//       </div>

//       {/* Main */}
//       <div className="flex flex-col flex-1 md:ml-64">
//         {!activeChat ? (
//         <EmptyState
//   onNewChat={() => {
//     sidebarRef.current?.createNewChat();
//   }}
// />

//         ) : (
//           <>
//             <header className="border-b sticky top-0 bg-background z-30">
//               <div className="flex h-14 items-center px-4">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="md:hidden mr-2"
//                   onClick={() => setSidebarOpen(true)}
//                 >
//                   <Menu />
//                 </Button>

//                 <h1 className="flex-1 font-semibold truncate">
//                   {activeChat.title}
//                 </h1>

//                 <Button variant="ghost" size="sm" onClick={toggleTheme}>
//                   {theme === "light" ? <Moon /> : <Sun />}
//                 </Button>
//               </div>
//             </header>

//             <MessageList
//               messages={messages}
//               loading={loading}
//               isResponding={isResponding}
//             />

//             <MessageInput
//               chatId={activeChat._id}
//               onSendMessage={async (content) => {
//                 const userMessage = {
//                   _id: Date.now().toString(),
//                   role: "user",
//                   content,
//                 };

//                 setMessages((p) => [...p, userMessage]);
//                 setIsResponding(true);

//                 const res = await axios.post(
//                   `${api}/api/chats/${activeChat._id}/messages`,
//                   { content },
//                   {
//                     headers: {
//                       authorization: localStorage.getItem("token"),
//                     },
//                   }
//                 );

//                 setMessages((p) => [...p, res.data]);
//                 setIsResponding(false);
//               }}
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
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
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();





  /* Load messages */
  const loadChat = async (chat: any) => {
    setActiveChat(chat);
      localStorage.setItem("activeChatId", chat?._id);
console.log(chat)
    setLoading(true);

    const res = await axios.get(`${api}/api/chats/${chat._id}`, {
      headers: { authorization: localStorage.getItem("token") },
    });

    setMessages(res.data.messages);
    setLoading(false);
  };

useEffect(() => {
  const savedChatId = localStorage.getItem("activeChatId");

  if (savedChatId) {
    setActiveChat(savedChatId);
    // fetchMessages(savedChatId); // IMPORTANT
  }
}, []);

  /* Create new chat */
  const handleCreateNewChat = async () => {
    const title = `New Chat ${new Date().toLocaleString()}`;

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
    loadChat(newChat);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`absolute inset-y-0 left-0 z-50 w-64 transform transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ChatSidebar
          activeChat={activeChat}
          onSelect={(chat) => {
            loadChat(chat);
            setSidebarOpen(false);
          }}
          onCreateNewChat={handleCreateNewChat}
        />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 md:ml-64">
        {!activeChat ? (
          <EmptyState onNewChat={handleCreateNewChat} />
        ) : (
          <>
            <header className="border-b sticky top-0 bg-background z-30">
              <div className="flex h-14 items-center px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden mr-2"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu />
                </Button>

                <h1 className="flex-1 font-semibold truncate">
                  {activeChat.title}
                </h1>

                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                  {theme === "light" ? <Moon /> : <Sun />}
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
              onSendMessage={async (content) => {
                const userMessage = {
                  _id: Date.now().toString(),
                  role: "user",
                  content,
                };

                setMessages((p) => [...p, userMessage]);
                setIsResponding(true);

                const res = await axios.post(
                  `${api}/api/chats/${activeChat._id}/messages`,
                  { content },
                  {
                    headers: {
                      authorization: localStorage.getItem("token"),
                    },
                  }

                  
                );

                setMessages((p) => [...p, res.data]);
                setIsResponding(false);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}