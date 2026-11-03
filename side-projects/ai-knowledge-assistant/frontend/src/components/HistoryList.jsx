import { useState, useEffect } from "react";

export default function HistoryList({ sessionId, userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchHistory();
    const handler = () => fetchHistory();
    window.addEventListener("history-changed", handler);
    return () => window.removeEventListener("history-changed", handler);
  }, [sessionId, userId]);

  async function fetchHistory() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/history?session_id=${sessionId}&limit=10`
      );
      const data = await res.json();
      setHistory((data.history || []).reverse());
    } catch (err) {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  if (!userId) return null;
  if (loading) return <p className="text-gray-500 text-sm">Loading history...</p>;

  return (
    <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Recent Conversations</h2>
      {history.length === 0 ? (
        <p className="text-gray-500 text-sm">No conversation history yet.</p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-1">{item.question}</p>
              <p className="text-xs text-gray-600 mb-2 whitespace-pre-wrap">{item.answer}</p>
              {item.sources && item.sources.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {item.sources.map((s) => (
                    <span key={s.id} className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      [{s.id}] {s.title}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-2">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
