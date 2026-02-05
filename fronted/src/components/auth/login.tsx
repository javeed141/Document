import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/api/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

const Login: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  /* ================= PASSWORD RULES ================= */
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/chat-page");
    }
  }, [navigate]);

  /* ================= LOGIN ================= */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    setError("");

    /* ✅ VALIDATION (no logic changed — only added guard) */
    if (!hasMinLength || !hasUppercase || !hasSpecial) {
      toast.error(
        "Password must be 8+ chars, include uppercase and special character",
        { position: "top-center" }
      );
      setSubmit(false);
      return;
    }

    try {
      const res = await axios.post(`${api}/api/auth/login`, {
        email,
        password,
      });

      setEmail("");
      setPassword("");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful", { position: "top-center" });
      navigate("/chat-page");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(`${message} : ${err.message}`, { position: "top-center" });
    } finally {
      setSubmit(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-muted px-4">
      
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

            {/* EMAIL */}
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

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-lg"
                >
                  {showPassword ? "🐵" : "🙈"}
                </button>
              </div>

              {/* ✅ PASSWORD REQUIREMENTS DISPLAY */}
              <div className="text-xs space-y-1 mt-2">
                <p className={hasMinLength ? "text-green-600" : "text-muted-foreground"}>
                  {hasMinLength ? "✓" : "•"} At least 8 characters
                </p>
                <p className={hasUppercase ? "text-green-600" : "text-muted-foreground"}>
                  {hasUppercase ? "✓" : "•"} One uppercase letter
                </p>
                <p className={hasSpecial ? "text-green-600" : "text-muted-foreground"}>
                  {hasSpecial ? "✓" : "•"} One special character
                </p>
              </div>
            </div>

            {/* DEMO BUTTON */}
            {/* <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setEmail("john123@gmail.com");
                setPassword("Test@1234");
                toast.info("Evaluator credentials filled");
              }}
            >
              Fill Evaluator Demo Login
            </Button> */}

            {/* ERROR */}
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
            <Link to="/register" className="font-medium text-primary hover:underline">
              Register
            </Link>
          </p>

        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
