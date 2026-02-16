import UploadForm from "../components/UploadForm";

export default function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">ATS Resume Scanner</h1>
        <p className="subtitle">
          Check how well your resume performs in Applicant Tracking Systems
        </p>
        <UploadForm />
      </div>
    </div>
  );
}