import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
      <p className="text-sm font-mono text-violet-300">404</p>
      <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-white">
        Lost in the <span className="gradient-text">void</span>
      </h1>
      <p className="mt-3 text-slate-400 max-w-md mx-auto">
        The page you tried to open has moved, was renamed, or never existed in
        the first place.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/" className="btn-primary">
          <Home size={14} /> Home
        </Link>
        <Link to="/search" className="btn-ghost">
          <Search size={14} /> Search
        </Link>
      </div>
    </div>
  );
}
