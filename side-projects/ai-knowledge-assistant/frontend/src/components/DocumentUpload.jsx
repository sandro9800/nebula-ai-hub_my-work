import { useState } from "react";

export default function DocumentUpload({ userId }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    const formData = new FormData();
    if (title) formData.append("title", title);
    if (content) formData.append("content", content);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Added "${data.title}"`);
        setTitle("");
        setContent("");
        setFile(null);
        window.dispatchEvent(new Event("documents-changed"));
      } else {
        setIsError(true);
        setMessage(data.error || "Failed to add document");
      }
    } catch (err) {
      setIsError(true);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Add Document</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Company Policy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content (or upload file)</label>
          <textarea
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste text content here..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload .txt, .md, or .pdf</label>
          <input
            type="file"
            accept=".txt,.md,.pdf"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          disabled={loading || (!title && !content && !file)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white py-2 rounded-md font-medium transition"
        >
          {loading ? "Adding..." : "Add Document"}
        </button>
      </form>
      {message && (
        <div className={`mt-3 p-3 rounded-md text-sm ${isError ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {message}
        </div>
      )}
    </section>
  );
}
