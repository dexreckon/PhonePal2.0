"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function PhoneScopeUI() {
  const [phoneModel, setPhoneModel] = useState("");
  const [mode, setMode] = useState("simplified");
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneModel) return;

    setIsLoading(true);
    setReportData(null);

    try {
      const response = await fetch("https://dexreckon2.app.n8n.cloud/webhook/9c0e78b9-fb4b-446a-9fa8-6ab812c37185", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: {
            phoneModel: phoneModel,
            mode: mode,
          }
        }),
      });

      if (!response.ok) throw new Error("AI Pipeline collapsed.");
      
      const data = await response.json();
      setReportData(data.summary);
      
    } catch (error) {
      setReportData("⚠️ Error: Could not connect to the n8n processing node.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="liquid-bg-overlay"></div>
      
      <video id="bg-video" autoPlay loop muted playsInline>
        <source src="/background.mp4" type="video/mp4" />
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-colorful-fluid-looping-background-43093-large.mp4"
          type="video/mp4"
        />
      </video>

      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="ambient-glow glow-3"></div>

      <main className="app-container">
        <header className="app-header">
          <div className="brand-group">
            <h1 className="brand-title">Shandar Mobiles</h1>
          </div>
        </header>

        <div className="workspace-grid">
          {/* Control Center */}
          <section className="glass-panel panel-controls">
            <div className="panel-header">
              <h2 className="panel-title">Control Center</h2>
            </div>

            <form onSubmit={handleSearch} className="control-form">
              <div className="input-group">
                <label className="input-label">Enter Phone Model</label>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="e.g. Pixel 8 Pro, Samsung S24"
                    value={phoneModel}
                    onChange={(e) => setPhoneModel(e.target.value)}
                    required
                  />
                  <div className="glow-border"></div>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Analysis Target Persona</label>
                <div className="segmented-control" data-active={mode === "expert" ? "1" : "0"}>
                  <div className="slider-bg"></div>
                  <button
                    type="button"
                    className={`segment-btn ${mode === "simplified" ? "active" : ""}`}
                    onClick={() => setMode("simplified")}
                  >
                    Simplified
                  </button>
                  <button
                    type="button"
                    className={`segment-btn ${mode === "expert" ? "active" : ""}`}
                    onClick={() => setMode("expert")}
                  >
                    Expert
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-liquid-search" disabled={isLoading}>
                <span className="btn-text">{isLoading ? "Processing..." : "Generate Report"}</span>
                <div className="btn-glow"></div>
              </button>
            </form>
          </section>

          {/* Display Panel */}
          <section className="glass-panel panel-display">
            {isLoading && (
              <div className="loader-overlay" style={{ display: "flex" }}>
                <div className="liquid-loader">
                  <div className="drop drop-1"></div>
                  <div className="drop drop-2"></div>
                  <div className="drop drop-3"></div>
                </div>
                <div className="loader-text">Compiling web and social data...</div>
              </div>
            )}

            <div className="report-body markdown-content">
              {!reportData && !isLoading ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📱</div>
                  <h3>Enter a phone model to begin</h3>
                  <p>The system will scrape recent reviews and compile a technical or simplified report.</p>
                </div>
              ) : (
                <div>
                  {reportData && (
                    <>
                      <h2 className="report-meta-title">{phoneModel}</h2>
                      <div className="meta-row" style={{ marginBottom: "20px" }}>
                        Mode: {mode.toUpperCase()}
                      </div>
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 style={{ fontSize: "1.6rem", fontWeight: "700", margin: "1.5rem 0 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: "0.5rem" }}>{children}</h1>
                          ),
                          h2: ({ children }) => (
                            <h2 style={{ fontSize: "1.35rem", fontWeight: "700", margin: "1.5rem 0 0.6rem" }}>{children}</h2>
                          ),
                          h3: ({ children }) => (
                            <h3 style={{ fontSize: "1.15rem", fontWeight: "600", margin: "1.25rem 0 0.5rem", opacity: 0.95 }}>{children}</h3>
                          ),
                          h4: ({ children }) => (
                            <h4 style={{ fontSize: "1rem", fontWeight: "600", margin: "1rem 0 0.4rem", opacity: 0.9 }}>{children}</h4>
                          ),
                          p: ({ children }) => (
                            <p style={{ margin: "0.6rem 0", lineHeight: "1.75", opacity: 0.88 }}>{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong style={{ fontWeight: "700", opacity: 1 }}>{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em style={{ fontStyle: "italic", opacity: 0.9 }}>{children}</em>
                          ),
                          ul: ({ children }) => (
                            <ul style={{ paddingLeft: "1.5rem", margin: "0.6rem 0", listStyleType: "disc" }}>{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol style={{ paddingLeft: "1.5rem", margin: "0.6rem 0", listStyleType: "decimal" }}>{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li style={{ margin: "0.3rem 0", lineHeight: "1.65", opacity: 0.88 }}>{children}</li>
                          ),
                          hr: () => (
                            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.15)", margin: "1.25rem 0" }} />
                          ),
                          blockquote: ({ children }) => (
                            <blockquote style={{ borderLeft: "3px solid rgba(255,255,255,0.3)", paddingLeft: "1rem", margin: "1rem 0", opacity: 0.8, fontStyle: "italic" }}>{children}</blockquote>
                          ),
                          code: ({ children }) => (
                            <code style={{ background: "rgba(255,255,255,0.1)", padding: "0.15rem 0.4rem", borderRadius: "4px", fontSize: "0.88em", fontFamily: "monospace" }}>{children}</code>
                          ),
                        }}
                      >
                        {reportData}
                      </ReactMarkdown>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
