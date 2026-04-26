import { useState } from "react";
import { motion } from "framer-motion";
import { C } from "../../constants/theme";

export default function ExplorerSection() {
  // Initial registry data
  const assets = [
    { id: "SG-2026-00001", name: "UEFA_CL_Final_2026_4K.mp4", hash: "a3f4bc9e21d7", date: "2026-01-14", status: "SEALED", strikes: 0 },
    { id: "SG-2026-00002", name: "NBA_Finals_G7_Highlights.mp4", hash: "c9d2ef438ba1", date: "2026-01-19", status: "SEALED", strikes: 2 },
    { id: "SG-2026-00003", name: "F1_MonacoGP_OnBoard_2026.mov", hash: "ff128bce74a3", date: "2026-02-03", status: "ACTIVE", strikes: 0 },
    { id: "SG-2026-00004", name: "EPL_Derby_GoalReel_R29.mp4", hash: "78acd3e2190f", date: "2026-02-11", status: "DISPUTED", strikes: 5 },
    { id: "SG-2026-00005", name: "UFC309_KO_Compilation.mp4", hash: "23b7ae90dc15", date: "2026-02-22", status: "SEALED", strikes: 1 },
    { id: "SG-2026-00006", name: "Wimbledon_Final_4K_Extended.mp4", hash: "6712def83a29", date: "2026-03-01", status: "ACTIVE", strikes: 0 },
    { id: "SG-2026-00007", name: "Olympics_2026_Sprint_Final.mp4", hash: "b49c102e5f87", date: "2026-03-08", status: "SEALED", strikes: 0 },
  ];

  // Object to track verification state for each asset ID
  const [vStatus, setVStatus] = useState({});

  const handleVerifyRow = (id) => {
    // 1. Trigger "VERIFYING" state
    setVStatus(prev => ({ ...prev, [id]: "VERIFYING" }));

    // 2. Simulate the audit trail sequence
    setTimeout(() => {
      // 3. Finalize as "VALID"
      setVStatus(prev => ({ ...prev, [id]: "VALID ✓" }));
    }, 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      id="explorer"
      style={{ padding: "60px 40px", background: "#111", borderBottom: `4px solid ${C.green}` }}
    >
      <div style={{ marginBottom: "16px" }}><span className="tag tag-green">C2PA REGISTRY</span></div>
      <h2 className="pixel" style={{ fontSize: "clamp(2rem,4vw,3rem)", margin: "0 0 8px", color: C.green }}>
        #EXPLORER — ASSET CHAIN-OF-CUSTODY
      </h2>
      <p className="mono" style={{ fontSize: "0.8rem", color: C.muted, margin: "0 0 40px" }}>
        Complete C2PA Golden Record manifest browser. Perform real-time integrity audits.
      </p>

      <div style={{ border: `4px solid ${C.green}`, background: C.dark }}>
        <div style={{ background: C.green, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <span className="pixel" style={{ color: C.dark, fontSize: "1.2rem" }}>◈ C2PA ASSET REGISTRY — {assets.length} RECORDS</span>
          <button
            className="btn-ghost"
            style={{ borderColor: C.dark, color: C.dark, background: "rgba(0,0,0,0.05)" }}
            onClick={() => document.getElementById("ingestion")?.scrollIntoView({ behavior: "smooth" })}
          >
            + INGEST NEW
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: "900px" }}>
            <thead>
              <tr style={{ background: C.mid }}>
                {["ASSET ID", "FILENAME", "pHASH", "DATE", "STATUS", "STRIKES", "INTEGRITY AUDIT"].map(h => (
                  <th key={h} className="mono" style={{ padding: "12px", textAlign: "left", fontSize: "0.65rem", color: C.muted, borderBottom: `2px solid ${C.green}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((a, i) => {
                const statusColor = a.status === "SEALED" ? C.green : a.status === "ACTIVE" ? C.yellow : C.red;
                const state = vStatus[a.id] || "IDLE";

                return (
                  <motion.tr
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    key={a.id}
                    style={{ background: i % 2 === 0 ? C.dark : "#131313", borderBottom: `1px solid ${C.mid}` }}
                  >
                    <td className="mono" style={{ padding: "12px", fontSize: "0.7rem", color: C.green }}>{a.id}</td>
                    <td className="mono" style={{ padding: "12px", fontSize: "0.68rem", color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</td>
                    <td className="mono" style={{ padding: "12px", fontSize: "0.68rem", color: C.muted }}>{a.hash}</td>
                    <td className="mono" style={{ padding: "12px", fontSize: "0.7rem", color: C.muted }}>{a.date}</td>
                    <td style={{ padding: "12px" }}>
                      <span className="tag" style={{ borderColor: statusColor, color: statusColor, fontSize: "0.75rem" }}>{a.status}</span>
                    </td>
                    <td className="pixel" style={{ padding: "12px", fontSize: "1.1rem", color: a.strikes > 3 ? C.red : a.strikes > 0 ? C.yellow : C.muted, textAlign: "center" }}>
                      {a.strikes > 0 ? `⚡${a.strikes}` : "—"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        className="btn-ghost"
                        disabled={state !== "IDLE"}
                        style={{
                          width: "120px",
                          fontSize: "0.68rem",
                          borderColor: state === "VALID ✓" ? C.green : state === "VERIFYING" ? C.yellow : C.purple,
                          color: state === "VALID ✓" ? C.green : state === "VERIFYING" ? C.yellow : C.text,
                          opacity: state === "VERIFYING" ? 0.7 : 1,
                          cursor: state === "IDLE" ? "pointer" : "default"
                        }}
                        onClick={() => handleVerifyRow(a.id)}
                      >
                        {state === "IDLE" ? "VERIFY ▶" : state}
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "12px 16px", background: C.dark, borderTop: `2px solid ${C.mid}`, display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
          <div className="mono" style={{ fontSize: "0.7rem", color: C.muted }}>SYSTEM LEGEND:</div>
          {[
            { label: "SEALED", count: 4, c: C.green },
            { label: "ACTIVE", count: 2, c: C.yellow },
            { label: "DISPUTED", count: 1, c: C.red },
          ].map(({ label, count, c }) => (
            <div key={label} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ width: "8px", height: "8px", background: c }} />
              <span className="mono" style={{ fontSize: "0.7rem", color: C.muted }}>{label}: <span style={{ color: c }}>{count}</span></span>
            </div>
          ))}
          <span className="mono" style={{ fontSize: "0.65rem", color: C.muted, marginLeft: "auto" }}>
            ISO 18013-7 · C2PA v2.1 · ECDSA P-256 SIGNATURES
          </span>
        </div>
      </div>
    </motion.section>
  );
}