import { useEffect, useState } from "react";

export default function ResumePreview({ file }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setUrl(blobUrl);

    return () => URL.revokeObjectURL(blobUrl);
  }, [file]);

  if (!url) return null;

  return (
    <iframe
      src={url}
      width="100%"
      height="400px"
      style={{ border: "1px solid #ddd", marginTop: "16px" }}
    />
  );
}