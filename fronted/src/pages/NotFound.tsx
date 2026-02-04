import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-indigo-50 via-pink-50 to-emerald-50
                    dark:from-gray-950 dark:via-gray-900 dark:to-black
                    text-foreground px-6">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center 
                        rounded-full bg-destructive/10">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        {/* Text */}
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg font-medium mb-2">
          Page not found
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Action */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl 
                     bg-primary text-primary-foreground font-semibold
                     hover:opacity-90 transition"
        >
          <Home className="w-4 h-4" />
          Go back home
        </Link>
      </div>
    </div>
  );
}
