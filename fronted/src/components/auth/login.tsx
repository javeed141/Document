import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { api } from "@/api/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useTheme } from "@/context/ThemeContext";



import { toast } from "sonner"
import { Spinner } from "../ui/spinner";


const Login: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submit, setSubmit] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      navigate("/")
      return;
    }
  }, [])


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmit(true)
    setError("")

    try {
      console.log(api)
      const res = await axios.post(`${api}/api/auth/login`, {
        email,
        password,
      })
console.log(res)
      setEmail("")
      setPassword("")
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      toast.success("Login successful", { position: "top-center" })
      navigate("/")
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Login failed"

      setError(message)

      toast.error(message, { position: "top-center" })
    } finally {
      setSubmit(false)
    }
  }

 

  
  return (
  <div className="relative min-h-screen flex items-center justify-center bg-muted px-4">
    
    {/* 🌗 Theme Toggle Button */}
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 rounded-md border px-3 py-2 text-sm font-medium
                 bg-background text-foreground hover:bg-accent"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>

    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
             <form onSubmit={handleLogin} className="space-y-4">
             <div className="space-y-2">
             <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submit}>
              {submit ? <Spinner /> : "Login"}
            </Button>
          </form>
 <p className="mt-4 text-center text-sm text-muted-foreground">
    New user?{" "}
    <Link
      to="/register"
      className="font-medium text-primary hover:underline"
    >
      Register
    </Link>
  </p>      </CardContent>
    </Card>
  </div>
);

};


export default Login;
