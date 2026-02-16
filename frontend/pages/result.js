import { useEffect, useState } from "react";
import styles from "../styles/result.module.css";

export default function Result() {
  const [data, setData] = useState(null);

  const [jd, setJd] = useState("");
  const [jdScore, setJdScore] = useState(null);
  const [loadingJD, setLoadingJD] = useState(false);

  const [rewriting, setRewriting] = useState(false);
  const [aiResume, setAiResume] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    try {
      const saved = localStorage.getItem("result");
      if (saved) setData(JSON.parse(saved));
    } catch (err) {
      console.error("Invalid result data", err);
    }
  }, []);

  if (!data) {
    return (
      <div className={styles.resultContainer}>
        <p className={styles.empty}>No resume analysis found.</p>
      </div>
    );
  }

  const score = Number(data.score) || 0;

  const level =
    score >= 80 ? "good" :
    score >= 60 ? "avg" :
    "bad";

  const suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
  const missingKeywords = Array.isArray(data.missingKeywords)
    ? data.missingKeywords
    : [];

  async function rewriteResume() {
    setRewriting(true);
    try {
      const res = await fetch(`${API}/rewrite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: data.resumeText || "",
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "AI rewrite failed");
        return;
      }
      setAiResume(result.rewrittenResume || "");
    } catch (err) {
      console.error("AI rewrite failed", err);
    } finally {
      setRewriting(false);
    }
  }

  async function matchJD() {
    if (!jd.trim()) return;

    setLoadingJD(true);
    try {
      const res = await fetch(`${API}/match-jd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: data.resumeText,
          jdText: jd,
        }),
      });
      const result = await res.json();
      setJdScore(result.matchScore);
    } catch (err) {
      console.error("JD match failed", err);
    } finally {
      setLoadingJD(false);
    }
  }

  return (
    <div className={styles.resultContainer}>
      <div className={styles.resultCard}>

        {/* Badge */}
        <span className={`${styles.badge} ${styles[level]}`}>
          {level === "good"
            ? "Strong ATS Resume"
            : level === "avg"
            ? "Average ATS Match"
            : "Needs Improvement"}
        </span>

        {/* Score */}
        <div className={`${styles.score} ${styles[level]}`}>
          {score}/100
        </div>

        {/* Progress */}
        <div className={styles.progressBg}>
          <div
            className={`${styles.progressFill} ${styles[level]}`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Missing Keywords */}
        <div className={styles.section}>
          <h4>Missing Keywords</h4>
          <p>
            {missingKeywords.length
              ? missingKeywords.join(", ")
              : "None 🎉"}
          </p>
        </div>

        {/* Suggestions */}
        <div className={styles.section}>
          <h4>Suggestions</h4>
          <ul className={styles.list}>
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        {/* JD Match */}
        <div className={styles.section}>
          <h4>Job Description Match</h4>

          <textarea
            className={styles.textarea}
            placeholder="Paste job description here..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />

          <button
            onClick={matchJD}
            disabled={loadingJD}
            className={styles.button}
          >
            {loadingJD ? "Matching..." : "Match JD"}
          </button>

          {jdScore !== null && (
            <p className={styles.jdScore}>
              JD Match Score: <strong>{jdScore}%</strong>
            </p>
          )}
        </div>

        {/* AI Rewrite */}
        <div className={styles.section}>
          <h4>AI Resume Improvement</h4>

          <button
            onClick={rewriteResume}
            disabled={rewriting}
            className={styles.aiBtn}
          >
            {rewriting ? "Improving..." : "AI Improve Resume"}
          </button>

          {aiResume && (
            <textarea
              className={styles.aiTextarea}
              value={aiResume}
              readOnly
            />
          )}
        </div>

        {/* Download */}
        <button
          onClick={() => window.print()}
          className={styles.download}
        >
          Download Report (PDF)
        </button>

      </div>
    </div>
  );
}