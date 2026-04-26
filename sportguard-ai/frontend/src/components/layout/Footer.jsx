import { C } from "../../constants/theme";

export default function Footer() {
  return (
    <footer style={{ background: C.dark, borderTop: `4px solid ${C.orange}`, padding: "40px 40px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "40px", marginBottom: "40px" }}>

        {/* Brand & Mission */}
        <div>
          <div className="pixel" style={{ fontSize: "2rem", color: C.orange, marginBottom: "8px" }}>SPORTGUARD▸AI</div>
          <div className="mono" style={{ fontSize: "0.72rem", color: C.muted, lineHeight: 1.7, marginBottom: "16px" }}>
            Enterprise-grade digital asset protection<br />for the global sports media industry.<br />Built on open standards. Powered by AI.
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span className="tag tag-orange" style={{ fontSize: "0.85rem", padding: "2px 8px" }}>SDG 9</span>
            <span className="tag tag-yellow" style={{ fontSize: "0.85rem", padding: "2px 8px" }}>C2PA v2.1</span>
            <span className="tag tag-purple" style={{ fontSize: "0.85rem", padding: "2px 8px" }}>DMCA</span>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <div className="pixel" style={{ color: C.yellow, fontSize: "1.2rem", marginBottom: "16px" }}>TECHNOLOGY STACK</div>
          {[
            ["AI/ML", "VGG16 CNN + pHASH Engine"],
            ["BACKEND", "Python + FastAPI"],
            ["CYBERSEC", "Zero Trust + LSB Stego"],
            ["LEGAL AI", "Gemini 2.5 Flash"],
            ["WEB DETECT", "Google Cloud Vision API"],
            ["PROVENANCE", "C2PA + IPFS"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
              <span className="mono" style={{ fontSize: "0.68rem", color: C.orange, flexShrink: 0, width: "80px" }}>{k}</span>
              <span className="mono" style={{ fontSize: "0.68rem", color: C.muted }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Contact Links */}
        <div>
          <div className="pixel" style={{ color: C.purple, fontSize: "1.2rem", marginBottom: "16px" }}>CONTACT US</div>
          {[
            ["◈ EMAIL", "team@sportguard.ai"],
            ["◈ GITHUB", "github.com/sportguard-ai"],
            ["◈ DEVPOST", "devpost.com/sportguard"],
            ["◈ DISCORD", "discord.gg/sportguard"],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: "10px" }}>
              <div className="pixel" style={{ fontSize: "1rem", color: C.muted, marginBottom: "2px" }}>{k}</div>
              <div className="mono" style={{ fontSize: "0.72rem", color: C.text }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Hackathon Badge */}
        <div>
          <div className="pixel" style={{ color: C.orange, fontSize: "1.2rem", marginBottom: "16px" }}>BUILT FOR</div>
          <div style={{ border: `4px solid ${C.orange}`, padding: "20px", textAlign: "center", background: "#111" }}>
            <div className="pixel" style={{ fontSize: "1.4rem", color: C.yellow, marginBottom: "8px" }}>GOOGLE</div>
            <div className="pixel" style={{ fontSize: "1.4rem", color: C.text, marginBottom: "8px" }}>SOLUTION</div>
            <div className="pixel" style={{ fontSize: "1.4rem", color: C.orange, marginBottom: "16px" }}>CHALLENGE</div>
            <div style={{ border: `2px solid ${C.yellow}`, padding: "4px 12px", display: "inline-block" }}>
              <span className="pixel" style={{ color: C.yellow, fontSize: "1.8rem" }}>2026</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="section-divider" style={{ marginBottom: "20px", borderTop: `2px solid ${C.mid}` }} />

      {/* Copyright & Status Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div className="mono" style={{ fontSize: "0.7rem", color: C.muted }}>
          © 2026 SportGuard AI. Targeting UN SDG 9 — Industry, Innovation & Infrastructure.
        </div>
        <div className="mono" style={{ fontSize: "0.7rem", color: C.muted }}>
          Powered by Gemini · VGG16 · Google Cloud · FastAPI · C2PA
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ width: "8px", height: "8px", background: C.green, animation: "blink 1s step-end infinite" }} />
          <span className="mono" style={{ fontSize: "0.68rem", color: C.green }}>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
}