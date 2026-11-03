import { useState } from "react";

export default function ChatInterface({ sessionId, userId }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim() || !userId) return;
    setLoading(true);

    const userMsg = { role: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, session_id: sessionId }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer || "No answer returned.",
          sources: data.sources || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error connecting to the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <section className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col h-full">
        <p className="text-gray-500 text-center mt-10">Please login to ask questions.</p>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-10">
            Ask a question about your documents...
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] ${
              msg.role === "user"
                ? "ml-auto text-right bg-indigo-600 text-white p-3 rounded-lg rounded-tr-none"
                : "mr-auto bg-gray-100 text-gray-900 p-3 rounded-lg rounded-tl-none"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {msg.sources.map((s) => (
                  <span key={s.id} className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                    [{s.id}] {s.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="mr-auto bg-gray-100 text-gray-900 p-3 rounded-lg rounded-tl-none animate-pulse">
            <span className="text-sm">Thinking...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleAsk} className="pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-md font-medium transition"
          >
            Ask
          </button>
        </div>
      </form>
    </section>
  );
}
