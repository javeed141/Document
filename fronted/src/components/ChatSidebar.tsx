// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { api } from "@/api/api";
// import { toast } from "sonner";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { Plus, Edit, Trash2, User, LogOut, MoreVertical, Search, X } from "lucide-react";
// import { Spinner } from "./ui/spinner";

// const LIMIT = 20;

// type ChatSidebarProps = {
//   activeChat: any;
//   onSelect: (chat: any) => void;
//   onCreateNewChat: () => void;
//   newChat?: any; // Add this prop to receive newly created chat from parent
// };

// export default function ChatSidebar({
//   activeChat,
//   onSelect,
//   onCreateNewChat,
//   newChat,
// }: ChatSidebarProps) {
//   const [chats, setChats] = useState<any[]>([]);
//   const [filteredChats, setFilteredChats] = useState<any[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const [editingChat, setEditingChat] = useState<any>(null);
//   const [deletingChat, setDeletingChat] = useState<any>(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [showAccount, setShowAccount] = useState(false);
//   const [isEditLoading, setIsEditLoading] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [userDetails, setUserDetails] = useState<any>(null);

//   const scrollRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (user) {
//       setUserDetails(JSON.parse(user));
//     }
//   }, []);

//   /* ===================== ADD NEW CHAT TO TOP ===================== */
//   useEffect(() => {
//     if (newChat) {
//       setChats((prev) => {
//         // Check if chat already exists
//         const exists = prev.some((c) => c._id === newChat._id);
//         if (exists) {
//           // Move to top if already exists
//           return [newChat, ...prev.filter((c) => c._id !== newChat._id)];
//         }
//         // Add to top if new
//         return [newChat, ...prev];
//       });
//     }
//   }, [newChat]);

//   /* ===================== SEARCH FILTER ===================== */
//   useEffect(() => {
//     if (searchQuery.trim()) {
//       const filtered = chats.filter((chat) =>
//         chat.title.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredChats(filtered);
//     } else {
//       setFilteredChats(chats);
//     }
//   }, [searchQuery, chats]);

//   /* ===================== FETCH CHATS ===================== */
//   const fetchChats = async (pageNum: number) => {
//     if (loading || !hasMore) return;

//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         console.error("No token available");
//         setLoading(false);
//         return;
//       }

//       const res = await axios.get(
//         `${api}/api/chats?page=${pageNum}&limit=${LIMIT}`,
//         {
//           headers: {
//             authorization: token,
//           },
//         }
//       );

//       const incoming = res.data.chats;

//       setChats((prev) => {
//         if (pageNum === 1) {
//           // First page - replace all chats (but keep any newly created ones)
//           const newlyCreated = prev.filter((p) => 
//             !incoming.some((i: any) => i._id === p._id) && 
//             Date.now() - new Date(p.createdAt || 0).getTime() < 60000 // Created in last minute
//           );
//           return [...newlyCreated, ...incoming];
//         } else {
//           // Subsequent pages - append without duplicates
//           const map = new Map(prev.map((c) => [c._id, c]));
//           incoming.forEach((c: any) => map.set(c._id, c));
//           return Array.from(map.values());
//         }
//       });

//       setHasMore(res.data.hasMore);
//       setPage(pageNum);
//     } catch (error: any) {
//       console.error("Error fetching chats:", error);

//       if (error.response?.status === 401) {
//         toast.error("Your session has expired. Please log in again.");
//         localStorage.clear();
//         window.location.href = "/login";
//       } else {
//         toast.error("Failed to load chats.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchChats(1);
//   }, []);

//   const handleScroll = () => {
//     const el = scrollRef.current;
//     if (!el || loading || !hasMore) return;

//     if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
//       fetchChats(page + 1);
//     }
//   };

//   /* ===================== EDIT CHAT ===================== */
//   const handleSaveEdit = async () => {
//     if (!editTitle.trim()) {
//       toast.error("Title cannot be empty");
//       return;
//     }

//     setIsEditLoading(true);

//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.put(
//         `${api}/api/chats/${editingChat._id}`,
//         { title: editTitle },
//         {
//           headers: {
//             authorization: token,
//           },
//         }
//       );

//       setChats((prev) =>
//         prev.map((c) => (c._id === res.data._id ? res.data : c))
//       );

//       toast.success("Chat title updated!");
//       setEditingChat(null);
//     } catch (error: any) {
//       console.error("Error updating chat:", error);

//       if (error.response?.status === 401) {
//         toast.error("Authentication failed. Please log in again.");
//         localStorage.clear();
//         window.location.href = "/login";
//       } else if (error.response?.status === 404) {
//         toast.error("This chat no longer exists.");
//         setChats((prev) => prev.filter((c) => c._id !== editingChat._id));
//         setEditingChat(null);
//       } else {
//         toast.error("Failed to update chat title.");
//       }
//     } finally {
//       setIsEditLoading(false);
//     }
//   };

//   /* ===================== DELETE CHAT ===================== */
//   const handleDelete = async () => {
//     setIsDeleting(true);

//     try {
//       const token = localStorage.getItem("token");

//       await axios.delete(`${api}/api/chats/${deletingChat._id}`, {
//         headers: {
//           authorization: token,
//         },
//       });

//       setChats((prev) => prev.filter((c) => c._id !== deletingChat._id));

//       if (activeChat?._id === deletingChat._id) {
//         localStorage.removeItem("activeChatId");
//       }

//       toast.success("Chat deleted!");
//       setDeletingChat(null);
//     } catch (error: any) {
//       console.error("Error deleting chat:", error);

//       if (error.response?.status === 401) {
//         toast.error("Authentication failed. Please log in again.");
//         localStorage.clear();
//         window.location.href = "/login";
//       } else if (error.response?.status === 404) {
//         setChats((prev) => prev.filter((c) => c._id !== deletingChat._id));
//         toast.success("Chat was already deleted.");
//         setDeletingChat(null);
//       } else {
//         toast.error("Failed to delete chat.");
//       }
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const ChatSkeleton = () => (
//     <div className="h-10 rounded-lg bg-muted/50 mb-2 animate-pulse" />
//   );

//   return (
//     <aside className="w-full md:w-[280px] h-screen flex flex-col border-r bg-background">
//       {/* HEADER */}
//       <div className="p-3 md:p-4 border-b">
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="text-lg font-semibold">Chats</h2>
//           <Button
//             onClick={onCreateNewChat}
//             size="sm"
//             className="h-8 w-8 p-0"
//             title="New chat"
//           >
//             <Plus size={16} />
//           </Button>
//         </div>

//         {/* SEARCH BAR */}
//         <div className="relative">
//           <Search
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//             size={16}
//           />
//           <Input
//             type="text"
//             placeholder="Search chats..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-9 pr-9 h-9 text-sm"
//           />
//           {searchQuery && (
//             <button
//               onClick={() => setSearchQuery("")}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//             >
//               <X size={16} />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* CHAT LIST */}
//       <div
//         ref={scrollRef}
//         onScroll={handleScroll}
//         className="flex-1 overflow-y-auto p-2 md:p-3"
//       >
//         {filteredChats.length === 0 && !loading && (
//           <div className="text-center py-8">
//             <p className="text-sm text-muted-foreground">
//               {searchQuery ? "No chats found" : "No chats yet"}
//             </p>
//             <p className="text-xs text-muted-foreground mt-1">
//               {searchQuery ? "Try a different search" : "Create your first chat to get started"}
//             </p>
//           </div>
//         )}

//         {filteredChats.map((chat) => (
//           <div
//             key={chat._id}
//             className={`group relative mb-2 rounded-lg transition-all ${
//               activeChat?._id === chat._id ? "ring-2 ring-primary" : ""
//             }`}
//           >
//             <button
//               onClick={() => onSelect(chat)}
//               className={`w-full px-3 py-2.5 md:py-2 rounded-lg text-sm text-left transition-all
//                 ${
//                   activeChat?._id === chat._id
//                     ? "bg-primary text-primary-foreground shadow-sm"
//                     : "bg-muted/50 hover:bg-muted active:scale-[0.98]"
//                 }`}
//             >
//               <div className="flex items-center justify-between gap-2">
//                 <span className="truncate flex-1 font-medium">{chat.title}</span>
                
//                 {/* Mobile: Dropdown Menu */}
//                 <div className="md:hidden">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <button
//                         className={`p-1 rounded hover:bg-background/10 ${
//                           activeChat?._id === chat._id
//                             ? "text-primary-foreground"
//                             : "text-muted-foreground"
//                         }`}
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <MoreVertical size={16} />
//                       </button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setEditingChat(chat);
//                           setEditTitle(chat.title);
//                         }}
//                       >
//                         <Edit size={14} className="mr-2" />
//                         Edit
//                       </DropdownMenuItem>
//                       <DropdownMenuItem
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setDeletingChat(chat);
//                         }}
//                         className="text-destructive"
//                       >
//                         <Trash2 size={14} className="mr-2" />
//                         Delete
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             </button>

//             {/* Desktop: Hover Actions */}
//             <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setEditingChat(chat);
//                   setEditTitle(chat.title);
//                 }}
//                 className={`p-1.5 rounded-md transition-colors ${
//                   activeChat?._id === chat._id
//                     ? "hover:bg-primary-foreground/20 text-primary-foreground"
//                     : "hover:bg-background text-muted-foreground hover:text-foreground"
//                 }`}
//                 title="Edit chat"
//               >
//                 <Edit size={14} />
//               </button>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setDeletingChat(chat);
//                 }}
//                 className={`p-1.5 rounded-md transition-colors ${
//                   activeChat?._id === chat._id
//                     ? "hover:bg-destructive/20 text-primary-foreground"
//                     : "hover:bg-destructive/10 text-destructive"
//                 }`}
//                 title="Delete chat"
//               >
//                 <Trash2 size={14} />
//               </button>
//             </div>
//           </div>
//         ))}

//         {loading &&
//           Array.from({ length: 3 }).map((_, i) => <ChatSkeleton key={i} />)}

//         {!hasMore && filteredChats.length > 0 && !searchQuery && (
//           <div className="text-center text-xs text-muted-foreground py-4 border-t mt-2">
//             All chats loaded
//           </div>
//         )}
//       </div>

//       {/* FOOTER */}
//       <div className="p-2 md:p-3 border-t bg-muted/30">
//         <Button
//           onClick={() => setShowAccount(true)}
//           variant="ghost"
//           className="w-full justify-start gap-3 h-auto py-2.5"
//         >
//           <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//             <User size={16} className="text-primary" />
//           </div>
//           <div className="flex-1 text-left hidden md:block">
//             <p className="text-sm font-medium truncate">{userDetails?.name || "User"}</p>
//             <p className="text-xs text-muted-foreground truncate">
//               {userDetails?.email || "email@example.com"}
//             </p>
//           </div>
//         </Button>
//       </div>

//       {/* ACCOUNT MODAL */}
//       <Dialog open={showAccount} onOpenChange={setShowAccount}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Account Details</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="flex items-center gap-4">
//               <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
//                 <User size={24} className="text-primary" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold truncate">{userDetails?.name}</p>
//                 <p className="text-sm text-muted-foreground truncate">
//                   {userDetails?.email}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               variant="destructive"
//               onClick={() => {
//                 localStorage.clear();
//                 window.location.href = "/login";
//               }}
//               className="w-full"
//             >
//               <LogOut className="mr-2 h-4 w-4" />
//               Logout
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* EDIT MODAL */}
//       <Dialog open={!!editingChat} onOpenChange={() => setEditingChat(null)}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit Chat Title</DialogTitle>
//             <DialogDescription>
//               Give your chat a more descriptive name
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="chat-title">Title</Label>
//               <Input
//                 id="chat-title"
//                 value={editTitle}
//                 onChange={(e) => setEditTitle(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !isEditLoading) {
//                     handleSaveEdit();
//                   }
//                 }}
//                 placeholder="Enter chat title..."
//                 autoFocus
//               />
//             </div>
//           </div>
//           <DialogFooter className="gap-2 sm:gap-0">
//             <Button
//               variant="outline"
//               onClick={() => setEditingChat(null)}
//               disabled={isEditLoading}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleSaveEdit} disabled={isEditLoading}>
//               {isEditLoading ? <Spinner /> : "Save Changes"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* DELETE MODAL */}
//       <Dialog open={!!deletingChat} onOpenChange={() => setDeletingChat(null)}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Delete Chat</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete "{deletingChat?.title}"?
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
//               <p className="text-sm text-destructive">
//                 This action cannot be undone. All messages in this chat will be permanently deleted.
//               </p>
//             </div>
//           </div>
//           <DialogFooter className="gap-2 sm:gap-0">
//             <Button
//               variant="outline"
//               onClick={() => setDeletingChat(null)}
//               disabled={isDeleting}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleDelete}
//               disabled={isDeleting}
//             >
//               {isDeleting ? <Spinner /> : "Delete Chat"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </aside>
//   );
// }


import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { api } from "@/api/api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Plus, Edit, Trash2, User, LogOut, MoreVertical, Search, X } from "lucide-react";
import { Spinner } from "./ui/spinner";

const LIMIT = 20;

type ChatSidebarProps = {
  activeChat: any;
  onSelect: (chat: any) => void;
  onCreateNewChat: () => void;
  newChat?: any;
};

export default function ChatSidebar({
  activeChat,
  onSelect,
  onCreateNewChat,
  newChat,
}: ChatSidebarProps) {
  const [chats, setChats] = useState<any[]>([]);
  const [filteredChats, setFilteredChats] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingChat, setEditingChat] = useState<any>(null);
  const [deletingChat, setDeletingChat] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showAccount, setShowAccount] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserDetails(JSON.parse(user));
    }
  }, []);

  /* ===================== ADD NEW CHAT TO TOP ===================== */
  useEffect(() => {
    if (newChat) {
      setChats((prev) => {
        const exists = prev.some((c) => c._id === newChat._id);
        if (exists) {
          return [newChat, ...prev.filter((c) => c._id !== newChat._id)];
        }
        return [newChat, ...prev];
      });
    }
  }, [newChat]);

  /* ===================== SEARCH FILTER ===================== */
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = chats.filter((chat) =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  }, [searchQuery, chats]);

  /* ===================== FETCH CHATS ===================== */
  const fetchChats = async (pageNum: number) => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token available");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${api}/api/chats?page=${pageNum}&limit=${LIMIT}`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      const incoming = res.data.chats;

      setChats((prev) => {
        const map = new Map(prev.map((c) => [c._id, c]));
        incoming.forEach((c: any) => map.set(c._id, c));
        return Array.from(map.values());
      });

      setHasMore(res.data.hasMore);
      setPage(pageNum);
    } catch (error: any) {
      console.error("Error fetching chats:", error);

      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/login";
      } else {
        toast.error("Failed to load chats.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats(1);
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      fetchChats(page + 1);
    }
  };

  /* ===================== EDIT CHAT ===================== */
  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    setIsEditLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${api}/api/chats/${editingChat._id}`,
        { title: editTitle },
        {
          headers: {
            authorization: token,
          },
        }
      );

      setChats((prev) =>
        prev.map((c) => (c._id === res.data._id ? res.data : c))
      );

      toast.success("Chat title updated!");
      setEditingChat(null);
    } catch (error: any) {
      console.error("Error updating chat:", error);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
        localStorage.clear();
        window.location.href = "/login";
      } else if (error.response?.status === 404) {
        toast.error("This chat no longer exists.");
        setChats((prev) => prev.filter((c) => c._id !== editingChat._id));
        setEditingChat(null);
      } else {
        toast.error("Failed to update chat title.");
      }
    } finally {
      setIsEditLoading(false);
    }
  };

  /* ===================== DELETE CHAT ===================== */
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${api}/api/chats/${deletingChat._id}`, {
        headers: {
          authorization: token,
        },
      });

      setChats((prev) => prev.filter((c) => c._id !== deletingChat._id));

      if (activeChat?._id === deletingChat._id) {
        localStorage.removeItem("activeChatId");
      }

      toast.success("Chat deleted!");
      setDeletingChat(null);
    } catch (error: any) {
      console.error("Error deleting chat:", error);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
        localStorage.clear();
        window.location.href = "/login";
      } else if (error.response?.status === 404) {
        setChats((prev) => prev.filter((c) => c._id !== deletingChat._id));
        toast.success("Chat was already deleted.");
        setDeletingChat(null);
      } else {
        toast.error("Failed to delete chat.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const ChatSkeleton = () => (
    <div className="h-9 rounded-lg bg-muted/50 mb-1.5 animate-pulse" />
  );

  return (
    <aside className="w-full md:w-[280px] h-screen flex flex-col border-r bg-background">
      {/* HEADER */}
      <div className="p-3 md:p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Chats</h2>
          <Button
            onClick={onCreateNewChat}
            size="sm"
            className="h-8 w-8 p-0"
            title="New chat"
          >
            <Plus size={16} />
          </Button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 h-9 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* CHAT LIST */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2 md:p-3"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'hsl(var(--muted-foreground) / 0.3) transparent'
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            width: 6px;
          }
          
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          
          div::-webkit-scrollbar-thumb {
            background: hsl(var(--muted-foreground) / 0.3);
            border-radius: 10px;
            transition: background 0.2s ease;
          }
          
          div::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--muted-foreground) / 0.5);
          }
        `}</style>
        
        {filteredChats.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No chats found" : "No chats yet"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery ? "Try a different search" : "Create your first chat to get started"}
            </p>
          </div>
        )}

        {filteredChats.map((chat) => (
          <div
            key={chat._id}
            className={`group relative mb-1.5 rounded-lg transition-all ${
              activeChat?._id === chat._id ? "ring-2 ring-primary" : ""
            }`}
          >
            <button
              onClick={() => onSelect(chat)}
              className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-all
                ${
                  activeChat?._id === chat._id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 hover:bg-muted active:scale-[0.98]"
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate flex-1 font-medium">{chat.title}</span>
                
                {/* Three-dot menu (visible on all devices) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`p-1 rounded hover:bg-background/10 shrink-0 ${
                        activeChat?._id === chat._id
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingChat(chat);
                        setEditTitle(chat.title);
                      }}
                    >
                      <Edit size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingChat(chat);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </button>
          </div>
        ))}

        {loading &&
          Array.from({ length: 3 }).map((_, i) => <ChatSkeleton key={i} />)}

        {!hasMore && filteredChats.length > 0 && !searchQuery && (
          <div className="text-center text-xs text-muted-foreground py-4 border-t mt-2">
            All chats loaded
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-2 md:p-3 border-t bg-muted/30">
        <Button
          onClick={() => setShowAccount(true)}
          variant="ghost"
          className="w-full justify-start gap-3 h-auto py-2.5"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
          <div className="flex-1 text-left hidden md:block">
            <p className="text-sm font-medium truncate">{userDetails?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {userDetails?.email || "email@example.com"}
            </p>
          </div>
        </Button>
      </div>

      {/* ACCOUNT MODAL */}
      <Dialog open={showAccount} onOpenChange={setShowAccount}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={24} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{userDetails?.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {userDetails?.email}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={!!editingChat} onOpenChange={() => setEditingChat(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Chat Title</DialogTitle>
            <DialogDescription>
              Give your chat a more descriptive name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chat-title">Title</Label>
              <Input
                id="chat-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isEditLoading) {
                    handleSaveEdit();
                  }
                }}
                placeholder="Enter chat title..."
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setEditingChat(null)}
              disabled={isEditLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isEditLoading}>
              {isEditLoading ? <Spinner /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={!!deletingChat} onOpenChange={() => setDeletingChat(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingChat?.title}"?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-sm text-destructive">
                This action cannot be undone. All messages in this chat will be permanently deleted.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
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
              {isDeleting ? <Spinner /> : "Delete Chat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}