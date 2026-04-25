import { useState } from "react";

const NEIGHBOURHOODS = [
  "Kensington Market", "Queen West", "Ossington", "Leslieville",
  "Distillery District", "Little Italy", "Chinatown", "Annex",
  "Liberty Village", "Parkdale", "Roncesvalles", "Financial District",
  "King West", "Bloor West Village", "Danforth"
];

export default function App() {
  const [neighbourhood, setNeighbourhood] = useState("");
  const [vibe, setVibe] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function search() {
    if (!neighbourhood || !vibe.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    setSearched(true);

    try {
      const res = await fetch("http://localhost:3001/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ neighbourhood, vibe }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.recommendations);
    } catch (e) {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  }

  const priceLabel = (level) => {
    const map = {
      PRICE_LEVEL_INEXPENSIVE: "$",
      PRICE_LEVEL_MODERATE: "$$",
      PRICE_LEVEL_EXPENSIVE: "$$$",
      PRICE_LEVEL_VERY_EXPENSIVE: "$$$$"
    };
    return map[level] || "$$";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0c0c0c",
      fontFamily: "'Georgia', serif",
      color: "#f0ebe0",
    }}>
      <div style={{
        borderBottom: "1px solid #1e1e1e",
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "#0f0f0f",
      }}>
        <span style={{ fontSize: "24px" }}>🍜</span>
        <div>
          <div style={{ fontSize: "18px", letterSpacing: "2px", textTransform: "uppercase", color: "#e8c87e" }}>Toronto Vibes</div>
          <div style={{ fontSize: "11px", color: "#444", letterSpacing: "1px" }}>Find your spot by feeling</div>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>

        <div style={{ marginBottom: "48px" }}>
          <h1 style={{
            fontSize: "40px", fontWeight: "normal", lineHeight: "1.2",
            color: "#f0ebe0", marginBottom: "12px", letterSpacing: "-0.5px"
          }}>
            What are you<br />
            <em style={{ color: "#e8c87e" }}>feeling right now?</em>
          </h1>
          <p style={{ color: "#444", fontSize: "15px", marginBottom: "36px" }}>
            Pick a neighbourhood, describe the vibe, get real recommendations.
          </p>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#555", display: "block", marginBottom: "8px" }}>
              Neighbourhood
            </label>
            <select
              value={neighbourhood}
              onChange={e => setNeighbourhood(e.target.value)}
              style={{
                width: "100%", background: "#141414", border: "1px solid #222",
                borderRadius: "8px", color: neighbourhood ? "#f0ebe0" : "#444",
                fontSize: "15px", padding: "14px 16px", fontFamily: "inherit",
                outline: "none", cursor: "pointer",
              }}
            >
              <option value="">Select a neighbourhood...</option>
              {NEIGHBOURHOODS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#555", display: "block", marginBottom: "8px" }}>
              The Vibe
            </label>
            <input
              value={vibe}
              onChange={e => setVibe(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              placeholder="e.g. cozy date night, loud and fun with friends, cheap and authentic..."
              style={{
                width: "100%", background: "#141414", border: "1px solid #222",
                borderRadius: "8px", color: "#f0ebe0", fontSize: "15px",
                padding: "14px 16px", fontFamily: "inherit", outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={search}
            disabled={loading || !neighbourhood || !vibe.trim()}
            style={{
              width: "100%", padding: "16px",
              background: neighbourhood && vibe.trim() && !loading
                ? "linear-gradient(135deg, #e8c87e, #b89040)"
                : "#1a1a1a",
              border: "none", borderRadius: "8px",
              color: neighbourhood && vibe.trim() && !loading ? "#0c0c0c" : "#333",
              fontSize: "15px", fontWeight: "bold",
              cursor: neighbourhood && vibe.trim() && !loading ? "pointer" : "not-allowed",
              fontFamily: "inherit", letterSpacing: "1px", textTransform: "uppercase",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Finding your spot..." : "Find Restaurants →"}
          </button>
        </div>

        {error && (
          <div style={{ background: "#1a0d0d", border: "1px solid #3a1a1a", borderRadius: "8px", padding: "16px", color: "#c08080", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", color: "#444", padding: "40px", fontSize: "15px", fontStyle: "italic" }}>
            Reading reviews and matching your vibe...
          </div>
        )}

        {results.length > 0 && (
          <div>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#444", marginBottom: "24px" }}>
              {results.length} spots for "{vibe}" in {neighbourhood}
            </div>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  background: "#111", border: "1px solid #1e1e1e",
                  borderRadius: "12px", padding: "28px", marginBottom: "16px",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#e8c87e44"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e1e"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "20px", color: "#f0ebe0", marginBottom: "4px" }}>{r.name}</div>
                    <div style={{ fontSize: "13px", color: "#444" }}>{r.address}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
                    <div style={{ fontSize: "18px", color: "#e8c87e", fontWeight: "bold" }}>⭐ {r.rating}</div>
                    <div style={{ fontSize: "13px", color: "#444" }}>{priceLabel(r.priceLevel)}</div>
                  </div>
                </div>

                <div style={{ fontSize: "14px", color: "#b0a890", lineHeight: "1.7", marginBottom: "16px" }}>
                  {r.whyItMatches}
                </div>

                <div style={{
                  borderLeft: "2px solid #e8c87e44", paddingLeft: "14px",
                  fontSize: "13px", color: "#666", fontStyle: "italic", marginBottom: "20px"
                }}>
                  "{r.standoutDetail}"
                </div>

                <a
                  href={r.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block", padding: "8px 20px",
                    borderRadius: "20px", border: "1px solid #2a2a2a",
                    color: "#e8c87e", fontSize: "12px", textDecoration: "none",
                    letterSpacing: "1px", textTransform: "uppercase",
                    transition: "all 0.2s",
                  }}
                >
                  Open in Maps →
                </a>
              </div>
            ))}
          </div>
        )}

        {searched && !loading && results.length === 0 && !error && (
          <div style={{ textAlign: "center", color: "#444", padding: "40px", fontStyle: "italic" }}>
            No results found. Try a different vibe or neighbourhood.
          </div>
        )}
      </div>
    </div>
  );
}
