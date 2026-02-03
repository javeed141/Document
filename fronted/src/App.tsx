import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/auth/Home";
import { Toaster } from "sonner";
import ChatPage from "./pages/ChatPage";


const App: React.FC = () => {
  return (
    <BrowserRouter>
        <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ChatPage />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
