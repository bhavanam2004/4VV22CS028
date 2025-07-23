import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  // Set expiry to 30 minutes (in milliseconds)
  const THIRTY_MINUTES = 30 * 60 * 1000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    setError("");
    const body = { url, validity: THIRTY_MINUTES };
    if (code) body.code = code;
    try {
      const res = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(
          <div>
            <b>Short URL:</b>{" "}
            <a href={data.shortUrl} target="_blank" rel="noopener noreferrer">
              {data.shortUrl}
            </a>
            <br />
            <b>Endpoint:</b> <code>/{code || data.shortUrl.split("/").pop()}</code>
          </div>
        );
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Server error. Is your backend running?");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Long URL:
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              style={{ width: "100%", margin: "8px 0", padding: "8px" }}
              placeholder="https://example.com"
            />
          </label>
        </div>
        <div>
          <label>
            Short Code (optional):
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ width: "100%", margin: "8px 0", padding: "8px" }}
              placeholder="e.g. mycode123"
            />
          </label>
        </div>
        <button type="submit" style={{ padding: "8px 16px" }}>
          Shorten
        </button>
      </form>
      <div style={{ marginTop: 16, color: "green" }}>{result}</div>
      <div style={{ marginTop: 16, color: "red" }}>{error}</div>
    </div>
  );
}
export default App;