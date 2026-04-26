import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { C } from "../../constants/theme";
import { ShieldIcon, RadarIcon, GavelIcon, ChainIcon } from "../ui/Icons";

export default function HeroSection() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, []);

  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVars = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 12 } } };

  return (
    <section id="home" style={{ background: C.dark, borderBottom: `4px solid ${C.orange}`, position: "relative", overflow: "hidden", minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
      <div className="noise-overlay" />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px)" }} />

      {/* Background Waveform */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", display: "flex", alignItems: "flex-end", gap: "3px", padding: "0 20px", opacity: 0.15, overflow: "hidden" }}>
        {Array.from({ length: 80 }).map((_, i) => {
          const h = Math.abs(Math.sin((i + tick * 0.3) * 0.4)) * 100;
          return <div key={i} style={{ flex: 1, height: `${h}%`, background: C.orange, minWidth: "2px" }} />;
        })}
      </div>

      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="show"
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          padding: "6vh 40px 15vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        {/* Block 1: MASSIVE Typography dominating the page */}
        <motion.div variants={itemVars} style={{
          display: "flex",
          gap: "clamp(10px, 1.5vw, 20px)",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "8vh", // Massive negative space pushed below the text
          width: "100%"
        }}>
          {/* Using 11vw makes the text scale aggressively with the window width, tightening line-height makes it punchy */}
          <h1 className="pixel" style={{ fontSize: "clamp(4rem, 9vw, 16rem)", margin: 0, lineHeight: 0.85, color: C.text }}>PROTECT.</h1>
          <h1 className="pixel" style={{ fontSize: "clamp(4rem, 9vw, 16rem)", margin: 0, lineHeight: 0.85, color: C.orange }}>TRACK.</h1>
          <h1 className="pixel" style={{ fontSize: "clamp(4rem, 9vw, 16rem)", margin: 0, lineHeight: 0.85, color: C.yellow }}>ENFORCE.</h1>
        </motion.div>

        {/* Block 2: Shortened Description Box */}
        <motion.div variants={itemVars} style={{ display: "flex", justifyContent: "center", marginBottom: "50px", width: "100%" }}>
          <div style={{ border: `2px solid ${C.text}`, padding: "16px 32px", maxWidth: "700px", background: `${C.dark}CC`, backdropFilter: "blur(4px)" }}>
            <p className="mono" style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6, color: C.text }}>
              Enterprise-grade digital asset protection for sports media. Shielding every broadcast and highlight end-to-end using VGG16 pHASH fingerprinting, C2PA provenance, and AI-powered DMCA automation.
            </p>
          </div>
        </motion.div>

        {/* Block 3: Icons Row (Symmetrically Centered) */}
        <motion.div variants={itemVars} style={{ display: "flex", gap: "clamp(20px, 4vw, 50px)", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { icon: <ShieldIcon size={64} color={C.orange} />, label: "ZERO TRUST", tag: "IDENTITY" },
            { icon: <RadarIcon size={64} color={C.yellow} />, label: "pHASH + CNN", tag: "DETECTION" },
            { icon: <GavelIcon size={64} color={C.purple} />, label: "GEMINI DMCA", tag: "LEGAL" },
            { icon: <ChainIcon size={64} color={C.green} />, label: "C2PA RECORD", tag: "PROVENANCE" },
          ].map(({ icon, label, tag }) => (
            <motion.div whileHover={{ scale: 1.05, y: -5 }} key={tag} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", cursor: "pointer", width: "140px" }}>
              <div style={{ border: `2px solid ${C.mid}`, padding: "16px", background: C.mid, display: "flex", justifyContent: "center", alignItems: "center", height: "100px", width: "100px" }}>{icon}</div>
              <span className="pixel" style={{ color: C.text, fontSize: "1.2rem", whiteSpace: "nowrap" }}>{label}</span>
              <span className="tag tag-orange" style={{ fontSize: "0.85rem" }}>{tag}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}