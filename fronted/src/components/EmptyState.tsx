import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
type EmptyStateProps = {
  onNewChat: () => void;
};

export default function EmptyState({ onNewChat }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="relative mb-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
            <Sparkles className="h-6 w-6 text-primary absolute -top-1 -right-1" />
          </div>

          <h3 className="text-lg font-semibold mb-2">
            Welcome to DocumentAI
          </h3>

          <p className="text-muted-foreground mb-4">
            Start a conversation with our AI assistant.
          </p>

          <Button className="w-full" onClick={onNewChat}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Start New Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


// /*** import { Card, CardContent } from "@/components/ui/card";
// import { 
//   MessageSquare, 
//   Sparkles, 
//   Zap, 
//   FileText, 
//   Brain,
//   ArrowRight
// } from "lucide-react";
// import { useTheme } from "@/context/ThemeContext";

// export default function EmptyState() {
//   const { theme } = useTheme();
//   const features = [
//     {
//       icon: Brain,
//       title: "Intelligent Conversations",
//       description: "Ask questions and get smart, contextual responses"
//     },
//     {
//       icon: FileText,
//       title: "Document Analysis",
//       description: "Upload and analyze documents with AI precision"
//     },
//     {
//       icon: Zap,
//       title: "Lightning Fast",
//       description: "Get instant answers powered by advanced AI"
//     }
//   ];

//   const suggestions = [
//     "Summarize a complex document",
//     "Help me write a professional email",
//     "Explain a technical concept",
//     "Analyze data and create insights"
//   ];

//   return (
//     <div className={`flex-1 flex items-center justify-center p-6 transition-colors duration-300 ${
//       theme === "dark" 
//         ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" 
//         : "bg-gradient-to-br from-gray-50 via-white to-blue-50"
//     }`}>
//       <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-700">
//         {/* Hero Section */}
//         <div className="text-center space-y-4">
//           <div className="relative inline-flex items-center justify-center">
//             <div className={`absolute inset-0 blur-3xl rounded-full transition-colors ${
//               theme === "dark" ? "bg-blue-500/20" : "bg-blue-400/30"
//             }`} />
//             <div className={`relative p-6 rounded-2xl shadow-lg transition-all ${
//               theme === "dark" 
//                 ? "bg-gradient-to-br from-blue-600 to-blue-800" 
//                 : "bg-gradient-to-br from-blue-500 to-blue-600"
//             }`}>
//               <MessageSquare className="h-16 w-16 text-white" />
//               <Sparkles className={`h-8 w-8 absolute -top-2 -right-2 animate-pulse ${
//                 theme === "dark" ? "text-yellow-400" : "text-yellow-300"
//               }`} />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <h1 className={`text-4xl md:text-5xl font-bold transition-colors ${
//               theme === "dark"
//                 ? "bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
//                 : "bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
//             }`}>
//               Welcome to DocumentAI
//             </h1>
//             <p className={`text-lg max-w-2xl mx-auto transition-colors ${
//               theme === "dark" ? "text-gray-400" : "text-gray-600"
//             }`}>
//               Your intelligent assistant for documents, conversations, and more. 
//               Select a chat from the sidebar or create a new one to get started.
//             </p>
//           </div>
//         </div>

//         {/* Features Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {features.map((feature, index) => (
//             <Card 
//               key={index} 
//               className={`border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
//                 theme === "dark"
//                   ? "bg-gray-900/50 border-gray-800 hover:border-blue-700"
//                   : "bg-white border-gray-200 hover:border-blue-400"
//               }`}
//             >
//               <CardContent className="p-6 space-y-3">
//                 <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
//                   theme === "dark" ? "bg-blue-500/20" : "bg-blue-100"
//                 }`}>
//                   <feature.icon className={`h-6 w-6 ${
//                     theme === "dark" ? "text-blue-400" : "text-blue-600"
//                   }`} />
//                 </div>
//                 <h3 className={`font-semibold text-lg transition-colors ${
//                   theme === "dark" ? "text-gray-100" : "text-gray-900"
//                 }`}>
//                   {feature.title}
//                 </h3>
//                 <p className={`text-sm transition-colors ${
//                   theme === "dark" ? "text-gray-400" : "text-gray-600"
//                 }`}>
//                   {feature.description}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Suggestions Section */}
//         <Card className={`border-2 transition-colors ${
//           theme === "dark" ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"
//         }`}>
//           <CardContent className="p-6 space-y-4">
//             <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
//               theme === "dark" ? "text-gray-400" : "text-gray-600"
//             }`}>
//               <Sparkles className={`h-4 w-4 ${
//                 theme === "dark" ? "text-blue-400" : "text-blue-600"
//               }`} />
//               Try asking me to...
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {suggestions.map((suggestion, index) => (
//                 <button
//                   key={index}
//                   className={`group text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between ${
//                     theme === "dark"
//                       ? "border-gray-800 hover:border-blue-700 hover:bg-gray-800/50"
//                       : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
//                   }`}
//                 >
//                   <span className={`text-sm font-medium transition-colors ${
//                     theme === "dark"
//                       ? "text-gray-300 group-hover:text-gray-100"
//                       : "text-gray-700 group-hover:text-gray-900"
//                   }`}>
//                     {suggestion}
//                   </span>
//                   <ArrowRight className={`h-4 w-4 transition-all ${
//                     theme === "dark"
//                       ? "text-gray-600 group-hover:text-blue-400"
//                       : "text-gray-400 group-hover:text-blue-600"
//                   } group-hover:translate-x-1`} />
//                 </button>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Footer Hint */}
//         <div className="text-center">
//           <p className={`text-sm flex items-center justify-center gap-2 transition-colors ${
//             theme === "dark" ? "text-gray-500" : "text-gray-600"
//           }`}>
//             <MessageSquare className="h-4 w-4" />
//             Click the <span className={`font-semibold ${
//               theme === "dark" ? "text-gray-300" : "text-gray-900"
//             }`}>+</span> button in the sidebar to start a new conversation
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }* */