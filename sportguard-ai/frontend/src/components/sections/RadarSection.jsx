import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C } from "../../constants/theme";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase"; // Ensure this path matches where you put firebase.js

export default function RadarSection({ onTriggerStrike }) {
  const [scanning, setScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [simUrl, setSimUrl] = useState("");
  const [scanningUrl, setScanningUrl] = useState(false);



  // --- NEW: Real-time Firestore Listener ---
  useEffect(() => {
    // Listen to the "infringements" collection, ordered by newest first
    const q = query(collection(db, "infringements"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log("Live Radar Update:", data);
      setLiveAlerts(data);
    }, (error) => {
      console.error("Firestore Listener Error:", error);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const scan = () => {
    setScanning(true);
    setShowResults(false);

    // Simulate the time it takes for the scan to run
    setTimeout(() => {
      setScanning(false);
      setShowResults(true); // Reveal the table after 3 seconds
    }, 3000);
  };

  const scanUrl = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    console.log("RADAR DEBUG: Sending scan request for URL:", simUrl);

    if (!simUrl) return;

    setScanningUrl(true);
    try {
      console.log("FETCH: Sending request to backend...");
      const response = await fetch("http://localhost:8000/scan-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: simUrl }),
      });

      console.log("RADAR DEBUG: Backend response received:", response);
      const result = await response.json();

      if (!response.ok || result.error) {
        console.error("Scan Error:", result.error || "Failed to scan URL");
      } else if (!result.match) {
        console.log("No infringement detected.");
      }

      setSimUrl("");
      setShowResults(true);
    } catch (err) {
      console.error("FRONTEND CRASH:", err);
    } finally {
      setScanningUrl(false);
    }
  };

  // Strictly render live data from the Firestore infringements collection
  const displayData = liveAlerts;

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      id="radar"
      style={{ padding: "60px 40px", background: "#111", borderBottom: `4px solid ${C.yellow}` }}
    >
      <div style={{ marginBottom: "16px" }}><span className="tag tag-yellow">DETECTION ENGINE</span></div>
      <h2 className="pixel" style={{ fontSize: "clamp(2rem,4vw,3rem)", margin: "0 0 8px", color: C.yellow }}>
        #RADAR — INFRINGEMENT DETECTION
      </h2>
      <p className="mono" style={{ fontSize: "0.8rem", color: C.muted, margin: "0 0 40px" }}>
        Google Cloud Vision API + VGG16 pHASH cross-referencing across the open web
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", marginBottom: "32px" }}>
        <div style={{ border: `4px solid ${C.orange}`, padding: "24px", background: C.dark, borderRight: "none", position: "relative" }}>
          <div style={{ position: "absolute", top: -14, left: 8, background: "#111", padding: "0 8px" }}>
            <span className="mono" style={{ fontSize: "0.65rem", color: C.orange }}>VISUAL MATCH ENGINE</span>
          </div>
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            <div style={{ width: "120px", height: "80px", background: C.mid, border: `2px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="pixel" style={{ color: C.text, fontSize: "2rem" }}>▶</span>
            </div>
            <div>
              <div className="pixel" style={{ color: C.orange, fontSize: "1.2rem", marginBottom: "8px" }}>ORIGINAL ASSET</div>
              <div className="mono" style={{ fontSize: "0.7rem", color: C.muted, lineHeight: 1.8 }}>
                ID: SG-2026-00847<br />pHASH: a3f4bc9e21d7<br />Format: MP4 · 4K UHD
              </div>
            </div>
          </div>
        </div>

        <div style={{ border: `4px solid ${C.yellow}`, padding: "24px", background: C.dark, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: -14, left: 8, background: "#111", padding: "0 8px" }}>
            <span className="mono" style={{ fontSize: "0.65rem", color: C.yellow }}>GEO INFRINGEMENT MAP</span>
          </div>
          <span className="mono" style={{ color: C.muted, fontSize: "0.8rem" }}>[ Pixel Map Renders Here ]</span>
        </div>
      </div>

      <div style={{ border: `2px solid ${C.mid}`, padding: "20px", background: C.dark, marginBottom: "24px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
        <input type="text" defaultValue="SG-2026-00847" style={{ flex: 1, minWidth: "200px" }} placeholder="Asset ID or pHASH" />
        <button className="btn-orange" onClick={scan} disabled={scanning}>
          {scanning ? "◎ SCANNING..." : "◎ LAUNCH RADAR SCAN"}
        </button>
        <button className="btn-ghost" onClick={() => alert("Opening Radar configuration panel: Setting dH threshold to 12...")}>⚙ CONFIGURE</button>
      </div>

      <div style={{ border: `2px solid ${C.mid}`, padding: "20px", background: C.dark, marginBottom: "24px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          value={simUrl}
          onChange={e => setSimUrl(e.target.value)}
          style={{ flex: 1, minWidth: "200px" }}
          placeholder="Simulation Control: Paste URL to simulate piracy"
        />
        <button className="btn-orange" onClick={scanUrl} disabled={scanningUrl}>
          {scanningUrl ? "◎ SCANNING..." : "◎ SCAN FOR PIRACY"}
        </button>
      </div>

      <AnimatePresence>
        {scanning && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ border: `2px solid ${C.yellow}`, padding: "16px", background: C.dark, marginBottom: "24px", overflow: "hidden" }}>
            <div className="pixel" style={{ color: C.yellow, fontSize: "1.2rem", marginBottom: "8px" }}>
              ◎ SCANNING WEB FOR INFRINGEMENTS<span className="blink">...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NEW: Renders using displayData (Live data OR fakeResults) --- */}
      {showResults && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ border: `4px solid ${C.orange}` }}>
          <div style={{ background: C.orange, padding: "8px 16px", display: "flex", justifyContent: "space-between" }}>
            <span className="pixel" style={{ color: C.dark, fontSize: "1.2rem" }}>◈ {displayData.length} INFRINGEMENTS DETECTED</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            {displayData.length === 0 ? (
              <div className="mono" style={{ padding: "40px", textAlign: "center", color: C.muted, borderTop: `2px solid ${C.orange}` }}>
                [ NO INFRINGEMENTS FOUND ]
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: "600px" }}>
                <thead>
                  <tr style={{ background: C.mid }}>
                    {["GEO", "PLATFORM", "MATCH", "URL", "ACTION"].map(h => (
                      <th key={h} className="mono" style={{ padding: "10px 12px", textAlign: "left", fontSize: "0.68rem", color: C.muted, borderBottom: `2px solid ${C.orange}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((r, i) => (
                    <tr key={r.id || i} style={{ background: i % 2 === 0 ? C.dark : "#1A1A1A", borderBottom: `1px solid ${C.mid}` }}>
                      <td className="mono" style={{ padding: "10px 12px", fontSize: "0.75rem", color: C.text }}>{r.geo || "N/A"}</td>
                      <td className="mono" style={{ padding: "10px 12px", fontSize: "0.75rem", color: C.text }}>{r.platform || "Unknown"}</td>
                      <td className="pixel" style={{ padding: "10px 12px", fontSize: "1.1rem", color: parseFloat(r.match) > 95 ? C.red : C.yellow }}>
                        {typeof r.match === 'number' ? `${r.match}%` : r.match}
                      </td>
                      <td className="mono" style={{ padding: "10px 12px", fontSize: "0.65rem", color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.url}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <button className="btn-ghost" style={{ fontSize: "0.7rem", borderColor: C.orange, color: C.orange }} onClick={() => onTriggerStrike(r)}>STRIKE →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}