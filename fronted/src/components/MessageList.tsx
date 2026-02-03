import LoadingState from "./LoadingState";
import MessageBubble from "./MEssageBubble";


export default function MessageList({ messages, loading }: any) {
  if (loading) return <LoadingState />;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg: any) => (
        <MessageBubble key={msg._id} message={msg} />
      ))}
    </div>
  );
}
