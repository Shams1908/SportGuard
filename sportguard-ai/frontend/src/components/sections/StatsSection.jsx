import { useState } from "react";
import { motion } from "framer-motion";
import { C } from "../../constants/theme";
import useCounter from "../../hooks/useCounter";

export default function StatsSection() {
  const [started, setStarted] = useState(false);
  const a = useCounter(12847, 2200, started);
  const b = useCounter(3291, 2000, started);
  const c = useCounter(847, 1800, started);
  const d = useCounter(99, 1600, started);

  const cards = [
    { label: "ASSETS SECURED", val: a, suffix: "", prefix: "", desc: "Active fingerprints in registry", color: C.purple },
    { label: "INFRINGEMENTS BLOCKED", val: b, suffix: "", prefix: "", desc: "Detected & neutralised this month", color: C.orange },
    { label: "TAKEDOWNS SENT", val: c, suffix: "", prefix: "", desc: "DMCA notices dispatched via AI", color: C.yellow },
    { label: "PROTECTION RATE", val: d, suffix: "%", prefix: "", desc: "Platform-wide integrity score", color: C.green },
  ];

  const cardVars = { hidden: { scale: 0.9, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { type: "spring", bounce: 0.4 } } };

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} onViewportEnter={() => setStarted(true)} id="home" style={{ padding: "60px 40px", background: C.bg, borderBottom: `4px solid ${C.mid}` }}>
      <div style={{ marginBottom: "32px" }}>
        <span className="tag tag-orange" style={{ marginRight: "12px" }}>COMMAND CENTER</span>
        <span className="pixel" style={{ color: C.muted, fontSize: "1.1rem" }}>// LIVE METRICS</span>
      </div>
      <h2 className="pixel" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", margin: "0 0 40px", color: C.text }}>SYSTEM STATUS OVERVIEW</h2>

      <motion.div variants={{ show: { transition: { staggerChildren: 0.1 } } }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "0" }}>
        {cards.map(({ label, val, suffix, prefix, desc, color }, i) => (
          <motion.div variants={cardVars} whileHover={{ y: -5 }} key={i} style={{ border: `4px solid ${color}`, padding: "32px 24px", position: "relative", background: C.dark, marginRight: i < 3 ? "-4px" : 0, zIndex: i }}>
            <div className="noise-overlay" />
            <div className="mono" style={{ fontSize: "0.7rem", color: C.muted, marginBottom: "16px", letterSpacing: "0.1em" }}>{label}</div>
            <div className="pixel" style={{ fontSize: "clamp(3rem,5vw,4.5rem)", color, lineHeight: 1, marginBottom: "8px" }}>{prefix}{val.toLocaleString()}{suffix}</div>
            <div className="mono" style={{ fontSize: "0.72rem", color: C.muted, borderTop: `1px solid ${color}`, paddingTop: "12px", marginTop: "12px" }}>{desc}</div>
            <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "16px", height: "16px", background: color }} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
