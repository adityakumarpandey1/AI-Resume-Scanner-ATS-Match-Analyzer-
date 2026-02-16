import { useState } from "react";
import { useRouter } from "next/router";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit() {
    if (!file) return alert("Please upload a resume");

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    // This looks for the Netlify variable; if not found, it defaults to localhost
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      localStorage.setItem("result", JSON.stringify(data));
      router.push("/result");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to analyze resume. Make sure the backend is running!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hidden file input */}
      <input
        type="file"
        id="resume-upload"
        hidden
        onChange={(e) => setFile(e.target.files[0])}
        accept=".pdf,.doc,.docx"
      />

      {/* BUTTON ROW */}
      <div className="button-row">
        <label htmlFor="resume-upload" className="file-button">
          {file ? "Change Resume" : "Choose Resume"}
        </label>

        <button
          onClick={submit}
          disabled={loading}
          className="button analyze-btn"
        >
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </button>
      </div>

      {/* PDF PREVIEW LINK */}
      {file && (
        <div className="file-preview">
          <p style={{ marginTop: "10px", color: "#666" }}>
            Selected: <strong>{file.name}</strong>
          </p>
          {file.type === "application/pdf" && (
            <a
              href={URL.createObjectURL(file)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0070f3", textDecoration: "underline" }}
            >
              View PDF Preview
            </a>
          )}
        </div>
      )}
    </>
  );
}