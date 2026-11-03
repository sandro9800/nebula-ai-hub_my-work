import { useState, useEffect } from "react";
import DocumentUpload from "./components/DocumentUpload";
import DocumentList from "./components/DocumentList";
import ChatInterface from "./components/ChatInterface";
import HistoryList from "./components/HistoryList";
import Login from "./components/Login";
import Register from "./components/Register";

function newSessionId() {
  // crypto.randomUUID only exists on https/localhost, so keep a fallback
  if (globalThis.crypto && globalThis.crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => newSessionId());

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated) {
        setUser({ user_id: data.user_id, username: data.username });
      }
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    setUser(null);
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow border border-gray-200">
          <h1 className="text-2xl font-bold text-center mb-6">
            🧠 Knowledge Assistant
          </h1>
          <div className="space-y-4">
            <Login onLogin={handleLogin} />
            <div className="flex items-center justify-center py-4">
              <div className="w-px bg-gray-300 mx-4"></div>
              <span className="text-sm text-gray-500">or</span>
              <div className="w-px bg-gray-300 mx-4"></div>
            </div>
            <Register onRegister={handleLogin} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white py-6 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>🧠</span> Knowledge Assistant
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              RAG-powered Q&A over your documents
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-indigo-500/20 px-3 py-1 rounded-full text-xs text-indigo-100">
              {user.username}
            </span>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                handleLogout();
              }}
              className="bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded-md font-medium transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <DocumentUpload />
          <DocumentList userId={user.user_id} />
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6 min-h-[500px]">
          <ChatInterface sessionId={sessionId} userId={user.user_id} />
          <HistoryList sessionId={sessionId} userId={user.user_id} />
        </div>
      </main>
    </div>
  );
}
