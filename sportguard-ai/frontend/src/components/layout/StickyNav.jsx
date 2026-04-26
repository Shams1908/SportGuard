import { useState, useEffect } from "react";
import { C } from "../../constants/theme";

export default function StickyNav() {
  const [active, setActive] = useState("home");
  const [time, setTime] = useState(new Date());

  // Clock tick
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const links = [
    { id: "home", label: "[ HOME ]" },
    { id: "ingestion", label: "[ INGESTION ]" },
    { id: "radar", label: "[ RADAR ]" },
    { id: "legal", label: "[ LEGAL STRIKE ]" },
    { id: "explorer", label: "[ EXPLORER ]" },
  ];

  // Scroll spy logic to highlight the active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for the sticky nav height

      for (const link of [...links].reverse()) {
        const section = document.getElementById(link.id);
        if (section && section.offsetTop <= scrollPosition) {
          setActive(link.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll click handler
  const scrollToSection = (id) => {
    setActive(id);
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 60; // -60px to account for the nav height
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: C.orange,
      borderBottom: `4px solid ${C.dark}`,
      display: "flex",
      alignItems: "stretch",
      overflowX: "auto",
      boxShadow: `0px 4px 0px ${C.dark}` // Brutalist shadow
    }}>
      {/* Logo Slug */}
      <div style={{ background: C.dark, padding: "0 20px", display: "flex", alignItems: "center", borderRight: `4px solid ${C.dark}`, flexShrink: 0 }}>
        <span className="pixel" style={{ color: C.orange, fontSize: "1.4rem", whiteSpace: "nowrap" }}>SPORTGUARD▸AI</span>
      </div>

      {/* Nav Links */}
      {links.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            style={{
              background: isActive ? C.dark : "transparent",
              color: isActive ? C.orange : C.dark,
              border: "none",
              borderRight: `2px solid ${C.dark}`,
              padding: "14px 24px",
              cursor: "pointer",
              fontFamily: "'VT323',monospace",
              fontSize: "1.3rem",
              letterSpacing: "0.05em",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            {label}
          </button>
        );
      })}

      {/* Right side system clock */}
      <div style={{ marginLeft: "auto", padding: "0 20px", display: "flex", alignItems: "center", borderLeft: `2px solid ${C.dark}`, flexShrink: 0 }}>
        <span className="mono" style={{ fontSize: "0.8rem", color: C.dark, fontWeight: 700 }}>
          {time.toUTCString().slice(17, 25)} UTC
        </span>
      </div>
    </nav>
  );
}