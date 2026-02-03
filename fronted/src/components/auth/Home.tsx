import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { api } from "@/api/api";
interface User {
  name: string;
  email: string;
}



const Home: React.FC = () => {
    const navigate=useNavigate()
    const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const[submit,setSubmit]=useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please login.");
      navigate("/login")
      return;
    }

    axios
      .get(`${api}/api/auth/decode`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setError("Invalid token");
        localStorage.removeItem("token");
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <h2 className="text-destructive">{error}</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <h2 className="text-foreground">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card p-8 rounded-lg shadow-lg border max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-foreground">Welcome {user.name} 👋</h1>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">Email: {user.email}</p>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">You are successfully logged in!</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
