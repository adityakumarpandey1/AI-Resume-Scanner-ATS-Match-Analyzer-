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

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      localStorage.setItem("result", JSON.stringify(data));
      router.push("/result");
    } catch {
      alert("Failed to analyze resume");
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
        {/* Upload button */}
        <label htmlFor="resume-upload" className="file-button">
          Choose Resume
        </label>

        {/* Analyze button */}
        <button
          onClick={submit}
          disabled={loading}
          className="button analyze-btn"
        >
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </button>
      </div>

      {/* PDF PREVIEW LINK (separate from label) */}
      {file && file.type === "application/pdf" && (
        <div className="file-preview">
          <a
            href={URL.createObjectURL(file)}
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 {file.name}
          </a>
        </div>
      )}
    </>
  );
}