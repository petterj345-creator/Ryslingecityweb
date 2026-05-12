import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Default Data ─── */
const DEFAULT_STORE = [
  { id: "adventurer", name: "Adventurer", price: 49, currency: "DKK", category: "ranks", color: "#22D67A", icon: "⚔️", perks: ["Colored chat name", "5 homes", "/hat command", "Adventurer kit (daily)", "Access to /fly in lobby"], popular: false },
  { id: "hero", name: "Hero", price: 99, currency: "DKK", category: "ranks", color: "#00BFFF", icon: "🛡️", perks: ["All Adventurer perks", "10 homes", "Particle effects", "/nick command", "Hero kit (daily)", "Priority queue"], popular: true },
  { id: "mythic", name: "Mythic", price: 199, currency: "DKK", category: "ranks", color: "#FF4D6A", icon: "👑", perks: ["All Hero perks", "20 homes", "Custom join message", "/fly everywhere", "Mythic kit (daily)", "Exclusive mount"], popular: false },
  { id: "claimblocks500", name: "500 Claimblocks", price: 25, currency: "DKK", category: "extras", color: "#B388FF", icon: "🧱", perks: ["500 extra claimblocks", "Protect more land", "Instant delivery"], popular: false },
  { id: "claimblocks2000", name: "2000 Claimblocks", price: 79, currency: "DKK", category: "extras", color: "#B388FF", icon: "🏰", perks: ["2000 extra claimblocks", "Fortify your base", "Instant delivery", "20% discount"], popular: true },
  { id: "dungeonkey", name: "Dungeon Key x3", price: 59, currency: "DKK", category: "extras", color: "#FFB300", icon: "🗝️", perks: ["3 dungeon crate keys", "Rare loot & gear drops", "Instant delivery"], popular: false },
  { id: "bosstoken", name: "Boss Summon Token x5", price: 89, currency: "DKK", category: "extras", color: "#FF5252", icon: "💀", perks: ["5 boss summon tokens", "Summon world bosses on demand", "Mythic loot chance", "Instant delivery"], popular: false },
];

const DEFAULT_UPDATES = [
  { id: "u1", date: "May 12, 2026", title: "The Abyssal Dungeon 🌊", desc: "A brand new underwater dungeon with 4 floors, custom mobs, and an epic boss fight against the Leviathan.", type: "major" },
  { id: "u2", date: "May 8, 2026", title: "Anti-Cheat Update", desc: "Improved anti-cheat detection for a fairer experience.", type: "minor" },
  { id: "u3", date: "May 1, 2026", title: "Webshop Claimblocks", desc: "You can now purchase extra claimblocks directly from the webshop!", type: "feature" },
  { id: "u4", date: "Apr 25, 2026", title: "World Boss: The Warden King 👑", desc: "A new roaming world boss spawns every 4 hours. Defeat it for mythic loot.", type: "major" },
  { id: "u5", date: "Apr 18, 2026", title: "Custom Mob Rebalance", desc: "Tweaked 30+ custom mobs — Skeletal Mages deal less damage, Shadow Stalkers are faster.", type: "minor" },
  { id: "u6", date: "Apr 10, 2026", title: "New Class: Necromancer 💀", desc: "Summon undead minions, drain life, and command the dead. Available at /class select.", type: "feature" },
];

const DEFAULT_ROADMAP = [
  { id: "r1", quarter: "Q2 2026", title: "The Abyssal Dungeon", date: "May 20, 2026", status: "in-progress", progress: 65, desc: "4-floor underwater dungeon with the Leviathan boss. Unique loot table with trident enchants.", icon: "🌊" },
  { id: "r2", quarter: "Q2 2026", title: "Guild System v1", date: "June 5, 2026", status: "in-progress", progress: 40, desc: "Create guilds, invite members, shared guild bank, and guild-vs-guild wars.", icon: "🏛️" },
  { id: "r3", quarter: "Q2 2026", title: "Fishing Overhaul", date: "June 18, 2026", status: "planned", progress: 0, desc: "Custom fish, fishing tournaments, rare catches, and a new fisherman NPC questline.", icon: "🎣" },
  { id: "r4", quarter: "Q3 2026", title: "The Nether Citadel", date: "July 10, 2026", status: "planned", progress: 0, desc: "End-game dungeon in the Nether with 6 floors, custom mobs, and the Infernal Overlord boss.", icon: "🔥" },
  { id: "r5", quarter: "Q3 2026", title: "Player Housing 2.0", date: "Aug 1, 2026", status: "planned", progress: 0, desc: "Furniture system, interior decorating, player housing plots with neighbors and districts.", icon: "🏡" },
  { id: "r6", quarter: "Q3 2026", title: "Mount System", date: "Aug 20, 2026", status: "planned", progress: 0, desc: "Rideable custom mounts — horses, wolves, dragons. Earned through quests and boss drops.", icon: "🐉" },
  { id: "r7", quarter: "Q3 2026", title: "Summer Festival", date: "Jul 1 – Jul 31", status: "planned", progress: 0, desc: "Beach arena, summer quests, limited cosmetics, and a summer boss.", icon: "☀️" },
  { id: "r8", quarter: "Q4 2026", title: "PvP Season 2", date: "Oct 2026", status: "concept", progress: 0, desc: "Ranked PvP with ELO, seasonal rewards, new arenas, and class balance pass.", icon: "⚔️" },
  { id: "r9", quarter: "Q4 2026", title: "The End Expansion", date: "Nov 2026", status: "concept", progress: 0, desc: "Custom End dimension with new islands, void creatures, and the Ender Titan boss.", icon: "🌌" },
  { id: "r10", quarter: "Q4 2026", title: "Economy Rework", date: "Dec 2026", status: "concept", progress: 0, desc: "Player-driven auction house, shop plots, dynamic pricing, and trade routes.", icon: "💰" },
];

const RULES = [
  "No griefing, raiding, or stealing from other players",
  "Respect all players and staff — no toxicity",
  "No hacks, exploits, or unauthorized mods",
  "Max 1 alt account per player",
  "No advertising other servers",
  "Do not abuse bugs — report them to staff",
  "Staff decisions are final",
  "English in global chat",
];

const FEATURES = [
  { icon: "🐉", title: "Custom Bosses", desc: "Epic boss fights with unique mechanics and mythic loot drops", color: "#FF4D6A" },
  { icon: "🏔️", title: "Dungeons", desc: "Multi-floor dungeons with puzzles, mobs, and final bosses", color: "#B388FF" },
  { icon: "👹", title: "Custom Mobs", desc: "100+ custom creatures with unique abilities and AI", color: "#FFB300" },
  { icon: "⚔️", title: "RPG Classes", desc: "Choose your class — Warrior, Mage, Archer, Necromancer & more", color: "#22D67A" },
  { icon: "🗺️", title: "Quests", desc: "Story-driven questlines with NPC dialogue and rewards", color: "#00BFFF" },
  { icon: "🏠", title: "Claiming", desc: "Protect your builds with claimblocks — expand via playtime or shop", color: "#FF8A65" },
];

const ADMIN_PASSWORD = "ryslingeadmin2026";

/* ─── Storage helpers ─── */
async function loadData(key, fallback) {
  try {
    const r = localStorage.getItem(key);
    return r ? JSON.parse(r) : fallback;
  } catch { return fallback; }
}
async function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error("Save error:", e); }
}

/* ─── Shared styles ─── */
const inputStyle = {
  width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)",
  border: "1px solid #2A2548", borderRadius: 8, color: "#E0D8F0",
  fontSize: 14, fontFamily: "var(--mono)", outline: "none", boxSizing: "border-box",
};
const labelStyle = { color: "#8A82A6", fontSize: 11, fontFamily: "var(--mono)", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 };
const adminBtnStyle = (color) => ({
  padding: "8px 18px", background: color, border: "none", borderRadius: 8,
  color: "#0A0818", fontSize: 13, fontWeight: 700, fontFamily: "var(--head)",
  letterSpacing: 1, cursor: "pointer", transition: "all 0.2s",
});

/* ─── Particles ─── */
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); let id; const ps = [];
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) ps.push({ x: Math.random() * c.width, y: Math.random() * c.height, s: Math.random() * 2.5 + 0.5, sy: -(Math.random() * 0.4 + 0.08), sx: (Math.random() - 0.5) * 0.25, o: Math.random() * 0.4 + 0.05, hue: Math.random() > 0.7 ? 280 : 160 });
    const draw = () => { ctx.clearRect(0, 0, c.width, c.height); ps.forEach(p => { p.x += p.sx; p.y += p.sy; if (p.y < -10) { p.y = c.height + 10; p.x = Math.random() * c.width; } ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fillStyle = `hsla(${p.hue},60%,70%,${p.o})`; ctx.fill(); }); id = requestAnimationFrame(draw); };
    draw(); return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []); return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

/* ─── Server Status ─── */
function ServerStatus() {
  const [status, setStatus] = useState({ online: null, players: 0, max: 100 });
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText("ryslingecity.mintservers.com"); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  useEffect(() => {
    const fetchStatus = () => {
      fetch("https://api.mcsrvstat.us/2/ryslingecity.mintservers.com")
        .then(r => r.json())
        .then(data => {
          console.log("MC Server API response:", data);
          setStatus({
            online: data.online === true,
            players: (data.players && data.players.online) ? data.players.online : 0,
            max: (data.players && data.players.max) ? data.players.max : 20,
          });
        })
        .catch(err => {
          console.error("MC Server API error:", err);
          setStatus({ online: false, players: 0, max: 20 });
        });
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const loading = status.online === null;
  const c = loading ? "#6B6490" : status.online ? "#22D67A" : "#FF4D6A";
  return (
    <div style={{ background: "rgba(10,8,20,0.85)", border: `1px solid ${c}44`, borderRadius: 16, padding: "20px 28px", display: "flex", alignItems: "center", gap: 20, backdropFilter: "blur(24px)", boxShadow: `0 0 50px ${c}12`, flexWrap: "wrap" }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: c, boxShadow: `0 0 14px ${c}`, animation: "pulse 2s infinite" }} />
      <div style={{ flex: 1, minWidth: 140 }}>
        <div style={{ color: c, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontFamily: "var(--mono)" }}>{loading ? "● CHECKING..." : status.online ? "● SERVER ONLINE" : "● OFFLINE"}</div>
        <div style={{ color: "#6B6490", fontSize: 13, marginTop: 2, fontFamily: "var(--mono)" }}>{loading ? "Fetching server status..." : status.online ? `${status.players}/${status.max} players online` : "Server is offline"}</div>
      </div>
      <button onClick={copy} style={{ background: `${c}14`, border: `1px solid ${c}30`, color: c, padding: "10px 24px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontFamily: "var(--mono)", fontWeight: 600, transition: "all 0.3s" }}>{copied ? "✓ Copied!" : "ryslingecity.mintservers.com"}</button>
    </div>
  );
}

/* ─── Store Card ─── */
function StoreCard({ item, onBuy }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: h ? "rgba(18,14,35,0.95)" : "rgba(10,8,22,0.85)", border: `1px solid ${h ? item.color + "55" : "#1E1A36"}`, borderRadius: 18, padding: 28, position: "relative", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)", transform: h ? "translateY(-6px)" : "none", boxShadow: h ? `0 24px 64px ${item.color}12` : "none", backdropFilter: "blur(20px)", overflow: "hidden" }}>
      {item.popular && <div style={{ position: "absolute", top: 14, right: 14, background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`, color: "#0A0818", fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 6, letterSpacing: 1.5, fontFamily: "var(--mono)" }}>POPULAR</div>}
      <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
      <h3 style={{ color: item.color, fontSize: 21, fontWeight: 800, margin: "0 0 4px", fontFamily: "var(--head)", letterSpacing: 1 }}>{item.name}</h3>
      <div style={{ color: "#E0D8F0", fontSize: 30, fontWeight: 800, fontFamily: "var(--mono)", margin: "8px 0 16px" }}>{item.price} <span style={{ fontSize: 14, color: "#4A4468" }}>DKK</span></div>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px" }}>{item.perks.map((p, i) => <li key={i} style={{ color: "#8A82A6", fontSize: 13, padding: "5px 0", display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--mono)" }}><span style={{ color: item.color, fontSize: 7 }}>◆</span>{p}</li>)}</ul>
      <button onClick={() => onBuy(item)} style={{ width: "100%", padding: 13, background: h ? item.color : "transparent", border: `2px solid ${item.color}`, color: h ? "#0A0818" : item.color, borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 800, fontFamily: "var(--head)", letterSpacing: 2, textTransform: "uppercase", transition: "all 0.3s" }}>BUY NOW</button>
    </div>
  );
}

/* ─── Checkout Modal ─── */
function CheckoutModal({ item, onClose }) {
  const [username, setUsername] = useState(""); const [step, setStep] = useState("username");
  if (!item) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(180deg,#100D22,#0A0818)", border: "1px solid #1E1A36", borderRadius: 22, padding: 36, maxWidth: 440, width: "100%", boxShadow: `0 50px 120px ${item.color}12`, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#4A4468", fontSize: 20, cursor: "pointer" }}>✕</button>
        {step === "username" && (<>
          <div style={{ textAlign: "center", marginBottom: 24 }}><div style={{ fontSize: 52 }}>{item.icon}</div><h2 style={{ color: item.color, fontFamily: "var(--head)", fontSize: 26, fontWeight: 800, margin: "12px 0 4px" }}>{item.name}</h2><p style={{ color: "#4A4468", fontFamily: "var(--mono)", fontSize: 13 }}>{item.price} DKK</p></div>
          <label style={labelStyle}>Minecraft Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Your IGN..." style={inputStyle} />
          <button onClick={() => username.trim() && setStep("payment")} disabled={!username.trim()} style={{ width: "100%", padding: 14, background: username.trim() ? item.color : "#1E1A36", border: "none", borderRadius: 10, color: username.trim() ? "#0A0818" : "#3A3558", fontSize: 15, fontWeight: 800, fontFamily: "var(--head)", letterSpacing: 2, textTransform: "uppercase", cursor: username.trim() ? "pointer" : "not-allowed", marginTop: 16 }}>CONTINUE TO PAYMENT →</button>
        </>)}
        {step === "payment" && (<>
          <div style={{ textAlign: "center", marginBottom: 24 }}><div style={{ fontSize: 36 }}>💳</div><h2 style={{ color: "#E0D8F0", fontFamily: "var(--head)", fontSize: 22, fontWeight: 800, margin: "12px 0 4px" }}>Stripe Checkout</h2><p style={{ color: "#4A4468", fontFamily: "var(--mono)", fontSize: 12 }}>Player: <span style={{ color: item.color }}>{username}</span></p></div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1E1A36", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ color: "#8A82A6", fontFamily: "var(--mono)", fontSize: 13 }}>{item.name}</span><span style={{ color: "#E0D8F0", fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700 }}>{item.price} DKK</span></div>
            <div style={{ borderTop: "1px solid #1E1A36", paddingTop: 12, display: "flex", justifyContent: "space-between" }}><span style={{ color: "#E0D8F0", fontFamily: "var(--mono)", fontSize: 15, fontWeight: 700 }}>Total</span><span style={{ color: item.color, fontFamily: "var(--mono)", fontSize: 18, fontWeight: 800 }}>{item.price} DKK</span></div>
          </div>
          <div style={{ marginBottom: 12 }}><span style={labelStyle}>CARD NUMBER</span><input placeholder="4242 4242 4242 4242" style={inputStyle} /></div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}><div style={{ flex: 1 }}><span style={labelStyle}>EXPIRY</span><input placeholder="MM/YY" style={inputStyle} /></div><div style={{ flex: 1 }}><span style={labelStyle}>CVC</span><input placeholder="123" style={inputStyle} /></div></div>
          <button onClick={() => setStep("success")} style={{ width: "100%", padding: 14, background: `linear-gradient(135deg, ${item.color}, ${item.color}CC)`, border: "none", borderRadius: 10, color: "#0A0818", fontSize: 15, fontWeight: 800, fontFamily: "var(--head)", letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>PAY {item.price} DKK</button>
          <div style={{ textAlign: "center", marginTop: 12 }}><span style={{ color: "#3A3558", fontSize: 11, fontFamily: "var(--mono)" }}>🔒 Secure payment via Stripe</span></div>
        </>)}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 68, marginBottom: 16 }}>✅</div><h2 style={{ color: "#22D67A", fontFamily: "var(--head)", fontSize: 24 }}>Payment Complete!</h2><p style={{ color: "#8A82A6", fontFamily: "var(--mono)", fontSize: 13, marginTop: 8 }}>{item.name} will be delivered to <span style={{ color: item.color }}>{username}</span> automatically.</p></div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* ─── ADMIN PANEL ─── */
/* ═══════════════════════════════════════════════════ */
function AdminPanel({ updates, setUpdates, roadmap, setRoadmap, onClose, onSave }) {
  const [section, setSection] = useState("news");
  const [editItem, setEditItem] = useState(null);
  const [saved, setSaved] = useState(false);

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  // ── News form
  const emptyNews = { id: "", date: "", title: "", desc: "", type: "major" };
  const [newsForm, setNewsForm] = useState(emptyNews);

  const saveNews = () => {
    if (!newsForm.title || !newsForm.desc) return;
    const item = { ...newsForm, id: newsForm.id || "u" + Date.now() };
    if (editItem) {
      setUpdates(prev => prev.map(u => u.id === editItem.id ? item : u));
    } else {
      setUpdates(prev => [item, ...prev]);
    }
    setNewsForm(emptyNews); setEditItem(null); showSaved(); onSave();
  };

  const deleteNews = (id) => { setUpdates(prev => prev.filter(u => u.id !== id)); onSave(); };

  // ── Roadmap form
  const emptyRoadmap = { id: "", quarter: "Q2 2026", title: "", date: "", status: "planned", progress: 0, desc: "", icon: "🎯" };
  const [roadmapForm, setRoadmapForm] = useState(emptyRoadmap);

  const saveRoadmapItem = () => {
    if (!roadmapForm.title || !roadmapForm.desc) return;
    const item = { ...roadmapForm, id: roadmapForm.id || "r" + Date.now(), progress: parseInt(roadmapForm.progress) || 0 };
    if (editItem) {
      setRoadmap(prev => prev.map(r => r.id === editItem.id ? item : r));
    } else {
      setRoadmap(prev => [...prev, item]);
    }
    setRoadmapForm(emptyRoadmap); setEditItem(null); showSaved(); onSave();
  };

  const deleteRoadmap = (id) => { setRoadmap(prev => prev.filter(r => r.id !== id)); onSave(); };

  const moveRoadmap = (index, dir) => {
    setRoadmap(prev => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    onSave();
  };

  const sections = [
    { id: "news", label: "📢 News", color: "#FF4D6A" },
    { id: "roadmap", label: "🗺️ Roadmap", color: "#B388FF" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)", zIndex: 2000, overflow: "auto" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>

        {/* Admin header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>🔧</span>
            <h1 style={{ fontFamily: "var(--title)", fontSize: 24, fontWeight: 900, color: "#B388FF", margin: 0 }}>ADMIN PANEL</h1>
            {saved && <span style={{ color: "#22D67A", fontSize: 13, fontFamily: "var(--mono)", animation: "slideUp 0.3s ease" }}>✓ Saved!</span>}
          </div>
          <button onClick={onClose} style={{ ...adminBtnStyle("#FF4D6A"), padding: "8px 20px" }}>✕ CLOSE</button>
        </div>

        {/* Section tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => { setSection(s.id); setEditItem(null); setNewsForm(emptyNews); setRoadmapForm(emptyRoadmap); }} style={{
              background: section === s.id ? `${s.color}20` : "rgba(255,255,255,0.03)",
              border: `1px solid ${section === s.id ? `${s.color}44` : "#1E1A36"}`,
              color: section === s.id ? s.color : "#4A4468",
              padding: "10px 20px", borderRadius: 10, cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: "var(--head)", letterSpacing: 1,
            }}>{s.label}</button>
          ))}
        </div>

        {/* ── NEWS SECTION ── */}
        {section === "news" && (
          <div>
            <div style={{ background: "rgba(10,8,22,0.9)", border: "1px solid #1E1A36", borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <h3 style={{ color: "#FF4D6A", fontFamily: "var(--head)", fontSize: 18, fontWeight: 700, margin: "0 0 20px" }}>{editItem ? "✏️ Edit Update" : "➕ Add New Update"}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div><label style={labelStyle}>Title</label><input value={newsForm.title} onChange={e => setNewsForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. New Dungeon Released 🏰" style={inputStyle} /></div>
                <div><label style={labelStyle}>Date</label><input value={newsForm.date} onChange={e => setNewsForm(p => ({ ...p, date: e.target.value }))} placeholder="e.g. May 15, 2026" style={inputStyle} /></div>
              </div>
              <div style={{ marginBottom: 14 }}><label style={labelStyle}>Description</label><textarea value={newsForm.desc} onChange={e => setNewsForm(p => ({ ...p, desc: e.target.value }))} placeholder="What's new..." rows={3} style={{ ...inputStyle, resize: "vertical" }} /></div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Type</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["major", "minor", "feature"].map(t => (
                      <button key={t} onClick={() => setNewsForm(p => ({ ...p, type: t }))} style={{
                        padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "var(--mono)", fontWeight: 700, textTransform: "uppercase",
                        background: newsForm.type === t ? (t === "major" ? "#FF4D6A" : t === "minor" ? "#FFB300" : "#B388FF") + "30" : "transparent",
                        border: `1px solid ${newsForm.type === t ? (t === "major" ? "#FF4D6A" : t === "minor" ? "#FFB300" : "#B388FF") : "#1E1A36"}`,
                        color: newsForm.type === t ? (t === "major" ? "#FF4D6A" : t === "minor" ? "#FFB300" : "#B388FF") : "#4A4468",
                      }}>{t === "major" ? "Major" : t === "minor" ? "Fix" : "New"}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  {editItem && <button onClick={() => { setEditItem(null); setNewsForm(emptyNews); }} style={adminBtnStyle("#4A4468")}>Cancel</button>}
                  <button onClick={saveNews} style={adminBtnStyle("#22D67A")}>{editItem ? "UPDATE" : "ADD"}</button>
                </div>
              </div>
            </div>

            {/* Existing news items */}
            <h3 style={{ color: "#6B6490", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: 2, marginBottom: 12 }}>EXISTING UPDATES ({updates.length})</h3>
            {updates.map(u => {
              const tc = { major: "#FF4D6A", minor: "#FFB300", feature: "#B388FF" };
              return (
                <div key={u.id} style={{ background: "rgba(10,8,22,0.7)", border: "1px solid #1E1A36", borderRadius: 12, padding: "14px 18px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ background: `${tc[u.type]}20`, color: tc[u.type], fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4, fontFamily: "var(--mono)", letterSpacing: 1 }}>{u.type.toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <div style={{ color: "#E0D8F0", fontSize: 14, fontWeight: 600 }}>{u.title}</div>
                    <div style={{ color: "#4A4468", fontSize: 11, fontFamily: "var(--mono)" }}>{u.date}</div>
                  </div>
                  <button onClick={() => { setEditItem(u); setNewsForm(u); }} style={{ background: "none", border: "1px solid #2A2548", color: "#B388FF", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "var(--mono)" }}>Edit</button>
                  <button onClick={() => deleteNews(u.id)} style={{ background: "none", border: "1px solid #2A2548", color: "#FF4D6A", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "var(--mono)" }}>Delete</button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ROADMAP SECTION ── */}
        {section === "roadmap" && (
          <div>
            <div style={{ background: "rgba(10,8,22,0.9)", border: "1px solid #1E1A36", borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <h3 style={{ color: "#B388FF", fontFamily: "var(--head)", fontSize: 18, fontWeight: 700, margin: "0 0 20px" }}>{editItem ? "✏️ Edit Roadmap Item" : "➕ Add Roadmap Item"}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div><label style={labelStyle}>Title</label><input value={roadmapForm.title} onChange={e => setRoadmapForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Pet System" style={inputStyle} /></div>
                <div><label style={labelStyle}>Icon (emoji)</label><input value={roadmapForm.icon} onChange={e => setRoadmapForm(p => ({ ...p, icon: e.target.value }))} placeholder="🎯" style={inputStyle} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div><label style={labelStyle}>Quarter</label>
                  <select value={roadmapForm.quarter} onChange={e => setRoadmapForm(p => ({ ...p, quarter: e.target.value }))} style={{ ...inputStyle, appearance: "auto" }}>
                    <option value="Q2 2026">Q2 2026</option><option value="Q3 2026">Q3 2026</option><option value="Q4 2026">Q4 2026</option><option value="Q1 2027">Q1 2027</option><option value="Q2 2027">Q2 2027</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Date</label><input value={roadmapForm.date} onChange={e => setRoadmapForm(p => ({ ...p, date: e.target.value }))} placeholder="e.g. Aug 2026" style={inputStyle} /></div>
                <div><label style={labelStyle}>Status</label>
                  <select value={roadmapForm.status} onChange={e => setRoadmapForm(p => ({ ...p, status: e.target.value }))} style={{ ...inputStyle, appearance: "auto" }}>
                    <option value="in-progress">In Progress</option><option value="planned">Planned</option><option value="concept">Concept</option>
                  </select>
                </div>
              </div>
              {roadmapForm.status === "in-progress" && (
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Progress ({roadmapForm.progress}%)</label>
                  <input type="range" min="0" max="100" value={roadmapForm.progress} onChange={e => setRoadmapForm(p => ({ ...p, progress: e.target.value }))} style={{ width: "100%", accentColor: "#22D67A" }} />
                </div>
              )}
              <div style={{ marginBottom: 14 }}><label style={labelStyle}>Description</label><textarea value={roadmapForm.desc} onChange={e => setRoadmapForm(p => ({ ...p, desc: e.target.value }))} placeholder="What this feature includes..." rows={3} style={{ ...inputStyle, resize: "vertical" }} /></div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                {editItem && <button onClick={() => { setEditItem(null); setRoadmapForm(emptyRoadmap); }} style={adminBtnStyle("#4A4468")}>Cancel</button>}
                <button onClick={saveRoadmapItem} style={adminBtnStyle("#B388FF")}>{editItem ? "UPDATE" : "ADD"}</button>
              </div>
            </div>

            {/* Existing roadmap items */}
            <h3 style={{ color: "#6B6490", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: 2, marginBottom: 12 }}>EXISTING ROADMAP ({roadmap.length})</h3>
            {roadmap.map((r, idx) => {
              const sc = { "in-progress": "#22D67A", planned: "#FFB300", concept: "#6B6490" };
              const arrowBtn = (disabled) => ({ background: "none", border: "1px solid #2A2548", color: disabled ? "#2A2548" : "#B388FF", padding: "3px 8px", borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer", fontSize: 12, fontFamily: "var(--mono)", lineHeight: 1 });
              return (
                <div key={r.id} style={{ background: "rgba(10,8,22,0.7)", border: "1px solid #1E1A36", borderRadius: 12, padding: "14px 18px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <button onClick={() => moveRoadmap(idx, -1)} disabled={idx === 0} title="Move up" style={arrowBtn(idx === 0)}>▲</button>
                    <button onClick={() => moveRoadmap(idx, 1)} disabled={idx === roadmap.length - 1} title="Move down" style={arrowBtn(idx === roadmap.length - 1)}>▼</button>
                  </div>
                  <span style={{ fontSize: 20 }}>{r.icon}</span>
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <div style={{ color: "#E0D8F0", fontSize: 14, fontWeight: 600 }}>{r.title}</div>
                    <div style={{ color: "#4A4468", fontSize: 11, fontFamily: "var(--mono)" }}>{r.quarter} · {r.date}</div>
                  </div>
                  <div style={{ background: `${sc[r.status]}20`, color: sc[r.status], fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4, fontFamily: "var(--mono)", letterSpacing: 1 }}>{r.status.toUpperCase()}</div>
                  <button onClick={() => { setEditItem(r); setRoadmapForm(r); }} style={{ background: "none", border: "1px solid #2A2548", color: "#B388FF", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "var(--mono)" }}>Edit</button>
                  <button onClick={() => deleteRoadmap(r.id)} style={{ background: "none", border: "1px solid #2A2548", color: "#FF4D6A", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "var(--mono)" }}>Delete</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* ─── MAIN APP ─── */
/* ═══════════════════════════════════════════════════ */
export default function RyslingeCity() {
  const [tab, setTab] = useState("home");
  const [filter, setFilter] = useState("all");
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data state
  const [storeItems] = useState(DEFAULT_STORE);
  const [updates, setUpdates] = useState(DEFAULT_UPDATES);
  const [roadmapItems, setRoadmapItems] = useState(DEFAULT_ROADMAP);

  // Admin state
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  // Load data from storage
  useEffect(() => {
    (async () => {
      const u = await loadData("ryslingecity-updates", DEFAULT_UPDATES);
      const r = await loadData("ryslingecity-roadmap", DEFAULT_ROADMAP);
      setUpdates(u);
      setRoadmapItems(r);
      setLoading(false);
    })();
  }, []);

  // Save handler
  const handleSave = useCallback(() => {
    setTimeout(async () => {
      await saveData("ryslingecity-updates", updates);
      await saveData("ryslingecity-roadmap", roadmapItems);
    }, 100);
  }, [updates, roadmapItems]);

  // Auto-save when data changes
  useEffect(() => { if (!loading) { saveData("ryslingecity-updates", updates); } }, [updates, loading]);
  useEffect(() => { if (!loading) { saveData("ryslingecity-roadmap", roadmapItems); } }, [roadmapItems, loading]);

  const tryLogin = () => {
    if (pwInput === ADMIN_PASSWORD) { setAdminAuth(true); setShowAdmin(true); setPwError(false); }
    else { setPwError(true); }
  };

  const items = filter === "all" ? storeItems : storeItems.filter(i => i.category === filter);

  // Group roadmap by quarter
  const roadmapGrouped = roadmapItems.reduce((acc, item) => {
    if (!acc[item.quarter]) acc[item.quarter] = [];
    acc[item.quarter].push(item);
    return acc;
  }, {});

  const tabs = [
    { id: "home", label: "HOME", icon: "🏠" },
    { id: "store", label: "STORE", icon: "🛒" },
    { id: "updates", label: "NEWS", icon: "📢" },
    { id: "roadmap", label: "ROADMAP", icon: "🗺️" },
    { id: "rules", label: "RULES", icon: "📜" },
  ];

  if (loading) return <div style={{ minHeight: "100vh", background: "#08061A", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#B388FF", fontFamily: "monospace", fontSize: 16 }}>Loading...</span></div>;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #08061A 0%, #0C0A1E 30%, #100D28 60%, #08061A 100%)", color: "#C8C0E0", fontFamily: "var(--head)", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Fira+Code:wght@400;500;600;700&family=Cinzel:wght@700;800;900&display=swap');
        :root { --head:'Chakra Petch',sans-serif; --mono:'Fira Code',monospace; --title:'Cinzel',serif; }
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes titleGlow{0%,100%{text-shadow:0 0 30px rgba(180,130,255,0.3)}50%{text-shadow:0 0 60px rgba(180,130,255,0.55),0 0 100px rgba(180,130,255,0.15)}}
        @keyframes runeFloat{0%,100%{opacity:0.08;transform:rotate(0deg)}50%{opacity:0.15;transform:rotate(3deg)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#08061A}::-webkit-scrollbar-thumb{background:#1E1A36;border-radius:3px}
      `}</style>

      <Particles />
      <div style={{ position: "fixed", top: "15%", left: "5%", fontSize: 120, opacity: 0.04, animation: "runeFloat 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0, color: "#B388FF" }}>⚔</div>
      <div style={{ position: "fixed", bottom: "10%", right: "5%", fontSize: 100, opacity: 0.04, animation: "runeFloat 8s ease-in-out infinite 2s", pointerEvents: "none", zIndex: 0, color: "#FF4D6A" }}>🐉</div>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,6,26,0.92)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(180,130,255,0.08)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 26 }}>🏰</span>
            <span style={{ fontFamily: "var(--title)", fontSize: 20, fontWeight: 900, background: "linear-gradient(135deg, #B388FF, #FF4D6A, #FFB300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 3 }}>RYSLINGECITY</span>
          </div>
          <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: tab === t.id ? "rgba(180,130,255,0.1)" : "transparent",
                border: tab === t.id ? "1px solid rgba(180,130,255,0.2)" : "1px solid transparent",
                color: tab === t.id ? "#B388FF" : "#4A4468",
                padding: "8px 14px", borderRadius: 8, cursor: "pointer",
                fontSize: 12, fontWeight: 700, fontFamily: "var(--head)", letterSpacing: 2,
                display: "flex", alignItems: "center", gap: 6, transition: "all 0.3s",
              }}><span style={{ fontSize: 13 }}>{t.icon}</span><span>{t.label}</span></button>
            ))}
            {/* Admin button */}
            <button onClick={() => { if (adminAuth) setShowAdmin(true); else setTab("admin-login"); }} style={{
              background: "rgba(255,77,106,0.08)", border: "1px solid rgba(255,77,106,0.2)",
              color: "#FF4D6A", padding: "8px 12px", borderRadius: 8, cursor: "pointer",
              fontSize: 12, fontWeight: 700, fontFamily: "var(--head)", letterSpacing: 1,
              marginLeft: 4, transition: "all 0.3s",
            }}>🔧</button>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 2 }}>

        {/* ── Admin Login ── */}
        {tab === "admin-login" && !adminAuth && (
          <div style={{ animation: "slideUp 0.6s ease", maxWidth: 400, margin: "80px auto", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontFamily: "var(--title)", fontSize: 28, fontWeight: 900, color: "#B388FF", margin: "0 0 8px" }}>ADMIN LOGIN</h2>
            <p style={{ color: "#4A4468", fontFamily: "var(--mono)", fontSize: 13, marginBottom: 28 }}>Enter the admin password to continue</p>
            <input type="password" value={pwInput} onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key === "Enter" && tryLogin()}
              placeholder="Password..." style={{ ...inputStyle, textAlign: "center", fontSize: 18, padding: "16px", marginBottom: 16 }} />
            {pwError && <p style={{ color: "#FF4D6A", fontSize: 13, fontFamily: "var(--mono)", marginBottom: 12 }}>Wrong password. Try again.</p>}
            <button onClick={tryLogin} style={{ width: "100%", padding: 14, background: "#B388FF", border: "none", borderRadius: 10, color: "#0A0818", fontSize: 15, fontWeight: 800, fontFamily: "var(--head)", letterSpacing: 2, cursor: "pointer" }}>LOGIN</button>
            <button onClick={() => setTab("home")} style={{ background: "none", border: "none", color: "#4A4468", fontSize: 13, fontFamily: "var(--mono)", cursor: "pointer", marginTop: 16 }}>← Back to site</button>
          </div>
        )}

        {/* ═══ HOME ═══ */}
        {tab === "home" && (
          <div style={{ animation: "slideUp 0.6s ease" }}>
            <div style={{ textAlign: "center", padding: "60px 0 50px" }}>
              <div style={{ fontSize: 80, marginBottom: 16, animation: "float 4s ease-in-out infinite" }}>🏰</div>
              <h1 style={{ fontFamily: "var(--title)", fontSize: "clamp(34px,6vw,62px)", fontWeight: 900, background: "linear-gradient(135deg, #B388FF 0%, #E040FB 30%, #FF4D6A 60%, #FFB300 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 12px", animation: "titleGlow 4s ease-in-out infinite", lineHeight: 1.1 }}>RYSLINGECITY</h1>
              <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "#6B6490", letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>RPG · Custom Mobs · Dungeons · Boss Fights</div>
              <p style={{ color: "#4A4468", fontSize: 14, fontFamily: "var(--mono)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7 }}>An epic RPG Minecraft server with hand-crafted dungeons,<br />custom bosses, unique classes, and endless adventures.</p>
              <ServerStatus />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, margin: "48px 0" }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ background: "rgba(10,8,22,0.8)", border: "1px solid #1E1A36", borderRadius: 14, padding: 22, backdropFilter: "blur(10px)", animation: `slideUp 0.5s ease ${i * 0.08}s both` }}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{f.icon}</div>
                  <h3 style={{ color: f.color, fontFamily: "var(--head)", fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>{f.title}</h3>
                  <p style={{ color: "#4A4468", fontSize: 12, fontFamily: "var(--mono)", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "linear-gradient(135deg, rgba(88,101,242,0.12), rgba(88,101,242,0.04))", border: "1px solid rgba(88,101,242,0.2)", borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div><h3 style={{ color: "#7289DA", margin: "0 0 6px", fontSize: 20, fontWeight: 700 }}>Join the Discord</h3><p style={{ color: "#4A4468", fontSize: 13, fontFamily: "var(--mono)", margin: 0 }}>Chat with the community, find parties, and get support</p></div>
              <a href="https://discord.gg/WgjNwxaneK" target="_blank" rel="noopener noreferrer" style={{ background: "#5865F2", border: "none", color: "white", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "var(--head)", letterSpacing: 2, textDecoration: "none", display: "inline-block" }}>DISCORD →</a>
            </div>
          </div>
        )}

        {/* ═══ STORE ═══ */}
        {tab === "store" && (
          <div style={{ animation: "slideUp 0.6s ease" }}>
            <div style={{ textAlign: "center", margin: "40px 0 28px" }}><h2 style={{ fontFamily: "var(--title)", fontSize: 36, fontWeight: 900, color: "#B388FF", margin: "0 0 8px" }}>STORE</h2><p style={{ color: "#4A4468", fontFamily: "var(--mono)", fontSize: 13 }}>Instant delivery via CraftingStore + Stripe</p></div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32, flexWrap: "wrap" }}>
              {[{ id: "all", l: "All" }, { id: "ranks", l: "Ranks" }, { id: "extras", l: "Extras" }].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{ background: filter === f.id ? "rgba(180,130,255,0.12)" : "transparent", border: `1px solid ${filter === f.id ? "rgba(180,130,255,0.3)" : "#1E1A36"}`, color: filter === f.id ? "#B388FF" : "#4A4468", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "var(--head)", letterSpacing: 2 }}>{f.l}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 18 }}>{items.map((item, i) => <div key={item.id} style={{ animation: `slideUp 0.5s ease ${i * 0.07}s both` }}><StoreCard item={item} onBuy={setCheckout} /></div>)}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 48, flexWrap: "wrap" }}>{["🔒 Stripe Security", "⚡ Instant Delivery", "💬 24/7 Support"].map((b, i) => <span key={i} style={{ color: "#2A2548", fontSize: 12, fontFamily: "var(--mono)", letterSpacing: 1 }}>{b}</span>)}</div>
          </div>
        )}

        {/* ═══ NEWS ═══ */}
        {tab === "updates" && (
          <div style={{ animation: "slideUp 0.6s ease" }}>
            <div style={{ textAlign: "center", margin: "40px 0 28px" }}><h2 style={{ fontFamily: "var(--title)", fontSize: 36, fontWeight: 900, color: "#B388FF", margin: "0 0 8px" }}>NEWS</h2><p style={{ color: "#4A4468", fontFamily: "var(--mono)", fontSize: 13 }}>Latest updates and patch notes</p></div>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              {updates.map((u, i) => {
                const tc = { major: "#FF4D6A", minor: "#FFB300", feature: "#B388FF" };
                const tl = { major: "MAJOR", minor: "FIX", feature: "NEW" };
                return (
                  <div key={u.id || i} style={{ background: "rgba(10,8,22,0.8)", border: "1px solid #1E1A36", borderRadius: 14, padding: "20px 26px", marginBottom: 12, display: "flex", gap: 18, alignItems: "flex-start", backdropFilter: "blur(10px)", animation: `slideUp 0.5s ease ${i * 0.07}s both` }}>
                    <div style={{ background: `${tc[u.type]}14`, border: `1px solid ${tc[u.type]}30`, color: tc[u.type], fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 6, fontFamily: "var(--mono)", letterSpacing: 1.5, whiteSpace: "nowrap", marginTop: 2 }}>{tl[u.type]}</div>
                    <div style={{ flex: 1 }}><h3 style={{ color: "#E0D8F0", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{u.title}</h3><p style={{ color: "#4A4468", fontSize: 13, fontFamily: "var(--mono)", margin: "0 0 6px", lineHeight: 1.6 }}>{u.desc}</p><span style={{ color: "#2A2548", fontSize: 11, fontFamily: "var(--mono)" }}>{u.date}</span></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ ROADMAP ═══ */}
        {tab === "roadmap" && (
          <div style={{ animation: "slideUp 0.6s ease" }}>
            <div style={{ textAlign: "center", margin: "40px 0 12px" }}><h2 style={{ fontFamily: "var(--title)", fontSize: 36, fontWeight: 900, color: "#B388FF", margin: "0 0 8px" }}>ROADMAP</h2><p style={{ color: "#4A4468", fontFamily: "var(--mono)", fontSize: 13 }}>What we're building — and when it's coming</p></div>
            <div style={{ display: "flex", gap: 20, justifyContent: "center", margin: "20px 0 36px", flexWrap: "wrap" }}>
              {[{ label: "In Progress", color: "#22D67A" }, { label: "Planned", color: "#FFB300" }, { label: "Concept", color: "#6B6490" }].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, boxShadow: `0 0 8px ${s.color}66` }} /><span style={{ color: s.color, fontSize: 12, fontFamily: "var(--mono)", letterSpacing: 1 }}>{s.label}</span></div>
              ))}
            </div>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              {Object.entries(roadmapGrouped).map(([quarter, qItems], qi) => (
                <div key={quarter} style={{ marginBottom: 48, animation: `slideUp 0.5s ease ${qi * 0.12}s both` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <div style={{ background: "linear-gradient(135deg, rgba(180,130,255,0.15), rgba(255,77,106,0.1))", border: "1px solid rgba(180,130,255,0.25)", borderRadius: 10, padding: "8px 18px" }}><span style={{ fontFamily: "var(--title)", fontSize: 18, fontWeight: 900, color: "#B388FF", letterSpacing: 2 }}>{quarter}</span></div>
                    <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(180,130,255,0.2), transparent)" }} />
                  </div>
                  <div style={{ position: "relative", paddingLeft: 32 }}>
                    <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: "linear-gradient(180deg, rgba(180,130,255,0.2), rgba(180,130,255,0.05))", borderRadius: 1 }} />
                    {qItems.map((item, i) => {
                      const sc = { "in-progress": "#22D67A", planned: "#FFB300", concept: "#6B6490" }[item.status];
                      const sl = { "in-progress": "IN PROGRESS", planned: "PLANNED", concept: "CONCEPT" }[item.status];
                      return (
                        <div key={item.id} style={{ position: "relative", marginBottom: 16, animation: `slideUp 0.5s ease ${(qi * 0.12) + (i * 0.08)}s both` }}>
                          <div style={{ position: "absolute", left: -26, top: 20, width: 12, height: 12, borderRadius: "50%", background: sc, boxShadow: `0 0 10px ${sc}55`, border: "2px solid #0A0818" }} />
                          <div style={{ background: "rgba(10,8,22,0.85)", border: "1px solid #1E1A36", borderRadius: 14, padding: "20px 24px", backdropFilter: "blur(10px)" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 22 }}>{item.icon}</span><h3 style={{ color: "#E0D8F0", fontSize: 17, fontWeight: 700, margin: 0, fontFamily: "var(--head)" }}>{item.title}</h3></div>
                              <div style={{ background: `${sc}14`, border: `1px solid ${sc}30`, color: sc, fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 6, fontFamily: "var(--mono)", letterSpacing: 1.5 }}>{sl}</div>
                            </div>
                            <p style={{ color: "#6B6490", fontSize: 13, fontFamily: "var(--mono)", margin: "0 0 10px", lineHeight: 1.65 }}>{item.desc}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: "#2A2548", fontSize: 12 }}>📅</span><span style={{ color: "#4A4468", fontSize: 12, fontFamily: "var(--mono)" }}>{item.date}</span></div>
                            {item.status === "in-progress" && item.progress > 0 && (
                              <div style={{ marginTop: 14 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ color: "#4A4468", fontSize: 10, fontFamily: "var(--mono)", letterSpacing: 1 }}>PROGRESS</span><span style={{ color: sc, fontSize: 10, fontFamily: "var(--mono)", fontWeight: 700 }}>{item.progress}%</span></div>
                                <div style={{ width: "100%", height: 4, background: "#1E1A36", borderRadius: 2, overflow: "hidden" }}><div style={{ width: `${item.progress}%`, height: "100%", background: `linear-gradient(90deg, ${sc}, ${sc}88)`, borderRadius: 2, boxShadow: `0 0 8px ${sc}44` }} /></div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div style={{ background: "rgba(180,130,255,0.04)", border: "1px solid rgba(180,130,255,0.1)", borderRadius: 12, padding: "18px 24px", textAlign: "center", marginTop: 12 }}><p style={{ color: "#6B6490", fontSize: 12, fontFamily: "var(--mono)", margin: 0, lineHeight: 1.6 }}>🗳️ Have ideas or feature requests? Share them on our Discord — community votes shape the roadmap!</p></div>
            </div>
          </div>
        )}

        {/* ═══ RULES ═══ */}
        {tab === "rules" && (
          <div style={{ animation: "slideUp 0.6s ease" }}>
            <div style={{ textAlign: "center", margin: "40px 0 28px" }}><h2 style={{ fontFamily: "var(--title)", fontSize: 36, fontWeight: 900, color: "#B388FF", margin: "0 0 8px" }}>RULES</h2><p style={{ color: "#4A4468", fontFamily: "var(--mono)", fontSize: 13 }}>Follow the rules for a fair experience</p></div>
            <div style={{ maxWidth: 620, margin: "0 auto" }}>
              {RULES.map((r, i) => (
                <div key={i} style={{ background: "rgba(10,8,22,0.8)", border: "1px solid #1E1A36", borderRadius: 12, padding: "16px 22px", marginBottom: 8, display: "flex", alignItems: "center", gap: 16, backdropFilter: "blur(10px)", animation: `slideUp 0.5s ease ${i * 0.06}s both` }}>
                  <div style={{ width: 32, height: 32, background: "rgba(180,130,255,0.06)", border: "1px solid rgba(180,130,255,0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#B388FF", fontSize: 14, fontWeight: 800, fontFamily: "var(--mono)", flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ color: "#8A82A6", fontSize: 14, fontFamily: "var(--mono)" }}>{r}</span>
                </div>
              ))}
              <div style={{ background: "rgba(255,77,106,0.06)", border: "1px solid rgba(255,77,106,0.15)", borderRadius: 12, padding: "18px 24px", marginTop: 20, textAlign: "center" }}><p style={{ color: "#FF8FA3", fontSize: 13, fontFamily: "var(--mono)", margin: 0 }}>⚠️ Breaking the rules may result in a mute, kick, or permanent ban.</p></div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #1E1A36", padding: 24, textAlign: "center", position: "relative", zIndex: 2 }}><p style={{ color: "#1E1A36", fontSize: 12, fontFamily: "var(--mono)", margin: 0 }}>© 2026 RyslingeCity — Not affiliated with Mojang Studios</p></footer>

      {checkout && <CheckoutModal item={checkout} onClose={() => setCheckout(null)} />}
      {showAdmin && adminAuth && <AdminPanel updates={updates} setUpdates={setUpdates} roadmap={roadmapItems} setRoadmap={setRoadmapItems} onClose={() => setShowAdmin(false)} onSave={handleSave} />}
    </div>
  );
}
