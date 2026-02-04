import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "../ui/spinner"
import { toast } from "sonner"
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/api/api"







const Register: React.FC = () => {
  const {theme,toggleTheme}=useTheme()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const[submit,setSubmit]=useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

 const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setSubmit(true)
  setError(null) // reset previous error

  try {
    await axios.post(
      `${api}/api/auth/register`,
      {
        name,
        email,
        password,
      }
    )

    localStorage.removeItem("token")

    setName("")
    setEmail("")
    setPassword("")

    toast.success("Registration successful", {
      position: "top-center",
    })

    navigate("/login")
  } catch (err: any) {
    // 🔥 extract backend message safely
    const message =
      err.response?.data?.message || "Registration failed"

    setError(message)

    toast.error(message, {
      position: "top-center",
    })
  } finally {
    setSubmit(false)
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
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
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
         <form onSubmit={handleRegister} className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input
      id="name"
      type="text"
      placeholder="John Doe"
      autoComplete="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      type="email"
      placeholder="you@example.com"
      autoComplete="email"
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
    {submit ? <Spinner /> : "Register"}
  </Button>

  <p className="text-sm text-center text-muted-foreground">
    Already have an account?{" "}
    <Link
      to="/login"
      className="text-primary underline-offset-4 hover:underline"
    >
      Login
    </Link>
  </p>
</form>

        </CardContent>
      </Card>
    </div>
  )
}

export default Register
