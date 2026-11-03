import { useState, useEffect } from "react";

export default function DocumentList({ userId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchDocuments();
    const handler = () => fetchDocuments();
    window.addEventListener("documents-changed", handler);
    return () => window.removeEventListener("documents-changed", handler);
  }, [userId]);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteDoc(id) {
    if (!window.confirm("Delete this document?")) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        window.dispatchEvent(new Event("documents-changed"));
      }
    } catch (err) {
      alert("Failed to delete");
    }
  }

  if (loading) return <p className="text-gray-500 text-sm">Loading documents...</p>;

  return (
    <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Your Documents ({documents.length})</h2>
      {documents.length === 0 ? (
        <p className="text-gray-500 text-sm">No documents yet. Add one above.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {documents.map((doc) => (
            <li key={doc.id} className="py-3 flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{doc.title}</p>
                <p className="text-xs text-gray-500">
                  {doc.source_type} • {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  #{doc.id}
                </span>
                <button
                  onClick={() => deleteDoc(doc.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
