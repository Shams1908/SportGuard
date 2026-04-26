import { useState } from "react";
import { motion } from "framer-motion";
import { C } from "../../constants/theme";

export default function IngestionSection() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState(-1);
  const [log, setLog] = useState([]);

  const stages = [
    { label: "IDENTITY SHIELD", color: C.orange, detail: "Zero Trust token validation · Anti-DoS check" },
    { label: "pHASH GEN", color: C.yellow, detail: "VGG16 deep feature extraction · perceptual hash" },
    { label: "CYBER SEAL", color: C.purple, detail: "LSB steganographic watermark · C2PA Golden Record" },
  ];

  const simulate = () => {
    if (!file) return;
    setStage(-1);
    setLog([]);
    const msgs = [
      `[IDENTITY] Validating Zero Trust token for ${file}...`,
      "[IDENTITY] Anti-DoS rate limiter: PASS",
      "[IDENTITY] JWT signature: VERIFIED ✓",
      `[pHASH] Loading ${file} into VGG16 pipeline...`,
      "[pHASH] Extracting deep feature vectors (4096-dim)...",
      "[pHASH] pHASH generated: a3f4bc9e21d7...",
      "[pHASH] Fingerprint indexed in registry ✓",
      "[SEAL] Embedding LSB steganographic watermark...",
      "[SEAL] Generating C2PA manifest (ISO 18013-7)...",
      "[SEAL] Golden Record anchored. Asset ID: SG-2026-00847 ✓",
    ];
    msgs.forEach((m, i) => {
      setTimeout(() => {
        setLog(prev => [...prev, m]);
        if (i === 2) setStage(0);
        if (i === 6) setStage(1);
        if (i === 9) setStage(2);
      }, i * 600);
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      id="ingestion"
      style={{ padding: "60px 40px", background: C.bg, borderBottom: `4px solid ${C.orange}` }}
    >
      <div style={{ marginBottom: "16px" }}><span className="tag tag-orange">PIPELINE</span></div>
      <h2 className="pixel" style={{ fontSize: "clamp(2rem,4vw,3rem)", margin: "0 0 8px", color: C.orange }}>
        #INGESTION — ASSET PIPELINE
      </h2>
      <p className="mono" style={{ fontSize: "0.8rem", color: C.muted, margin: "0 0 40px" }}>
        Drag a media asset to trigger the full Zero Trust → pHASH → C2PA protection pipeline
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "40px", flexWrap: "wrap" }}>
        {stages.map(({ label, color, detail }, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: "200px" }}>
            <div style={{ flex: 1, border: `4px solid ${stage >= i ? color : C.mid}`, padding: "20px 16px", background: stage >= i ? `${color}10` : C.dark, transition: "all 0.4s", position: "relative" }}>
              <div style={{ position: "absolute", top: -14, left: 8, background: C.bg, padding: "0 8px" }}>
                <span className="mono" style={{ fontSize: "0.65rem", color: C.muted }}>STAGE {i + 1}</span>
              </div>
              <div className="pixel" style={{ color: stage >= i ? color : C.muted, fontSize: "1.4rem", marginBottom: "8px" }}>
                {stage >= i ? "▶" : "○"} [{label}]
              </div>
              <div className="mono" style={{ fontSize: "0.68rem", color: stage >= i ? C.text : C.muted, lineHeight: 1.5 }}>{detail}</div>
              {stage === i && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ height: "3px", background: C.mid, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: color, animation: "march 0.5s linear infinite", backgroundImage: `repeating-linear-gradient(90deg,${color} 0px,${color} 6px,transparent 6px,transparent 10px)` }} />
                  </div>
                </div>
              )}
            </div>
            {i < 2 && (
              <div style={{ padding: "0 8px" }}>
                <span className="pixel" style={{ fontSize: "2rem", color: stage > i ? C.yellow : C.muted }}>→</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", border: `4px solid ${C.mid}` }}>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f.name); }}
          style={{
            minHeight: "220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: dragging ? `${C.orange}15` : C.dark,
            border: dragging ? `4px solid ${C.orange}` : `4px solid transparent`,
            cursor: "pointer", padding: "32px", borderRight: `2px solid ${C.mid}`, transition: "all 0.2s",
          }}>
          <svg width="48" height="48" viewBox="0 0 16 16" style={{ imageRendering: "pixelated", marginBottom: "16px" }}>
            <rect x="6" y="1" width="4" height="8" fill={dragging ? C.orange : C.muted} />
            <rect x="4" y="5" width="8" height="2" fill={dragging ? C.orange : C.muted} />
            <rect x="2" y="5" width="2" height="2" fill={dragging ? C.orange : C.muted} />
            <rect x="12" y="5" width="2" height="2" fill={dragging ? C.orange : C.muted} />
            <rect x="1" y="12" width="14" height="3" fill={dragging ? C.orange : C.muted} />
          </svg>
          <div className="pixel" style={{ color: dragging ? C.orange : C.muted, fontSize: "1.3rem", textAlign: "center" }}>
            {file ? `◈ ${file}` : "DROP MEDIA ASSET HERE"}
          </div>
          {file && (
            <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
              <button className="btn-yellow" onClick={simulate}>▶ RUN PIPELINE</button>
              <button className="btn-ghost" onClick={() => { setFile(null); setStage(-1); setLog([]); }}>✕ CLEAR</button>
            </div>
          )}
        </div>

        <div style={{ background: C.dark, padding: "20px", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", minHeight: "220px" }}>
          <div style={{ color: C.green, marginBottom: "12px" }}>SportGuard@pipeline:~$ <span className="blink">█</span></div>
          {log.length === 0 && <div style={{ color: C.muted }}>// Awaiting asset ingestion...</div>}
          {log.map((l, i) => <div key={i} style={{ color: l.includes("✓") ? C.green : l.includes("PASS") ? C.green : C.text, marginBottom: "4px" }}>{l}</div>)}
          {stage === 2 && <div style={{ marginTop: "16px", padding: "8px", border: `2px solid ${C.green}`, color: C.green }}>✓ PIPELINE COMPLETE — Asset protection record created</div>}
        </div>
      </div>
    </motion.section>
  );
}