
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { api } from "@/api/api";

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

import { Plus, Edit, Trash2, User, LogOut } from "lucide-react";
import { Spinner } from "./ui/spinner";

const LIMIT = 20;

type ChatSidebarProps = {
  activeChat: any;
  onSelect: (chat: any) => void;
  onCreateNewChat: () => void;
};

export default function ChatSidebar({
  activeChat,
  onSelect,
  onCreateNewChat,
}: ChatSidebarProps) {
  const [chats, setChats] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [editingChat, setEditingChat] = useState<any>(null);
  const [deletingChat, setDeletingChat] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showAccount, setShowAccount] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const[userDetails,setUserDetails]=useState<any>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  
   useEffect(()=>{
      const user = localStorage.getItem("user");
      if(!user) return ;
      const userObj= JSON.parse(localStorage.getItem("user")||"");
      setUserDetails( userObj);
      console.log(userObj)
  },[])

  /* ===================== FETCH CHATS ===================== */
  const fetchChats = async (pageNum: number) => {
    if (loading || !hasMore) return;

    setLoading(true);

    const res = await axios.get(
      `${api}/api/chats?page=${pageNum}&limit=${LIMIT}`,
      {
        headers: {
          authorization: localStorage.getItem("token"),
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
    setLoading(false);
  };

  /* ===================== INITIAL LOAD ===================== */
  useEffect(() => {
    fetchChats(1);
  }, []);



  /* ===================== SCROLL HANDLER ===================== */
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      fetchChats(page + 1);
    }
  };

  /* ===================== EDIT CHAT ===================== */
  const handleSaveEdit = async () => {
    setIsEditLoading(true);

    const res = await axios.put(
      `${api}/api/chats/${editingChat._id}`,
      { title: editTitle },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    setChats((prev) =>
      prev.map((c) => (c._id === res.data._id ? res.data : c))
    );

    setIsEditLoading(false);
    setEditingChat(null);
  };

  /* ===================== DELETE CHAT ===================== */
  const handleDelete = async () => {
    setIsDeleting(true);
    await axios.delete(`${api}/api/chats/${deletingChat._id}`, {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    });

    setChats((prev) => prev.filter((c) => c._id !== deletingChat._id));

    setIsDeleting(false);
    setDeletingChat(null);
  };

  /* ===================== SKELETON ===================== */
  const ChatSkeleton = () => (
    <div
      style={{
        height: 32,
        borderRadius: 8,
        background: "#e5e7eb",
        marginBottom: 6,
      }}
    />
  );

  return (
    <aside
      style={{
        width: 280,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #e5e7eb",
        background: "#fafafa",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: 12,
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>Chats</strong>
        <button
          onClick={onCreateNewChat}
          style={{
            padding: 4,
            borderRadius: 6,
            border: "none",
            background: "#e5e7eb",
            cursor: "pointer",
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* CHAT LIST */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 6px",
        }}
      >
        {chats.map((chat) => (
          <div
            key={chat._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 6,
            }}
          >
            <button
              onClick={() => onSelect(chat)}
              style={{
                flex: 1,
                padding: "6px 10px",
                fontSize: 13,
                borderRadius: 8,
                border: "none",
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                background:
                  activeChat?._id === chat._id
                    ? "linear-gradient(135deg, #2563eb, #1e40af)"
                    : "#f1f5f9",
                color: activeChat?._id === chat._id ? "#fff" : "#111827",
                cursor: "pointer",
              }}
            >
              {chat.title}
            </button>

            <button
              onClick={() => {
                setEditingChat(chat);
                setEditTitle(chat.title);
              }}
              style={{
                padding: 4,
                borderRadius: 6,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              <Edit size={13} />
            </button>

            <button
              onClick={() => setDeletingChat(chat)}
              style={{
                padding: 4,
                borderRadius: 6,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#ef4444",
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        {loading &&
          Array.from({ length: 4 }).map((_, i) => <ChatSkeleton key={i} />)}

        {!hasMore && chats.length > 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "12px 0",
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            You've reached the end 👋
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ padding: 8, borderTop: "1px solid #e5e7eb" }}>
        <button
          onClick={() => setShowAccount(true)}
          style={{
            padding: 6,
            borderRadius: 6,
            border: "none",
            background: "#e5e7eb",
            cursor: "pointer",
          }}
        >
          <User size={16} />
        </button>
      </div>

      {/* ACCOUNT MODAL */}
      <Dialog open={showAccount} onOpenChange={setShowAccount}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
          </DialogHeader>
          <DialogDescription className="mb-4">
           Name: {userDetails?.name} Email:  {userDetails?.email}
            </DialogDescription>
          <Button
            variant="destructive"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={!!editingChat} onOpenChange={() => setEditingChat(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit chat</DialogTitle>
          </DialogHeader>
          <Label>{editingChat?.title}</Label>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <DialogDescription className="mb-4">
            Update the title for this chat.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={handleSaveEdit}>
              {isEditLoading ? <Spinner /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog
        open={!!deletingChat}
        onOpenChange={() => setDeletingChat(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete chat: {deletingChat?.title}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="mb-4">
            This action cannot be undone. This will permanently delete this
            chat and all its messages.
          </DialogDescription>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              {isDeleting ? <Spinner /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}