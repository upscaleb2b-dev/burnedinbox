"use client";
import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";

function ceil(n: number) { return Math.ceil(n); }
function fmt(n: number)  { return ceil(n).toLocaleString(); }

export default function DomainCountPage() {
  const [totalInboxes, setTotalInboxes]   = useState(30);
  const [clients, setClients]             = useState(3);
  const [separateClients, setSeparate]    = useState(true);
  const [trackingDomains, setTracking]    = useState(true);
  const [backupDomains, setBackup]        = useState(true);

  const maxPerDomain   = 3;
  const sendingDomains = ceil(totalInboxes / maxPerDomain);
  const perClient      = separateClients ? clients : 0;
  const tracking       = trackingDomains ? ceil(clients > 1 ? clients : 1) : 0;
  const backup         = backupDomains ? ceil(sendingDomains * 0.25) : 0;
  const total          = sendingDomains + perClient + tracking + backup;
  const costLow        = total * 10;
  const costHigh       = total * 20;

  const Row = ({ label, val, note, sub }: { label: string; val: number; note?: string; sub?: boolean }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: sub ? "6px 0 6px 14px" : "10px 0", borderBottom: "1px solid var(--border)" }}>
      <div>
        <span style={{ fontSize: sub ? 13 : 14, color: sub ? "var(--ink-4)" : "var(--ink-3)" }}>{label}</span>
        {note && <span style={{ fontSize: 11, color: "var(--ink-5)", marginLeft: 8 }}>{note}</span>}
      </div>
      <span style={{ fontSize: sub ? 15 : 18, fontWeight: 700, fontFamily: "'Geist Mono', monospace", color: "var(--ink)" }}>{fmt(val)}</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input[type=range] { accent-color: var(--red); width: 100%; } .toggle { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); cursor: pointer; } .tog-btn { width: 36px; height: 20px; border-radius: 10px; border: none; cursor: pointer; transition: background 0.2s; position: relative; } .tog-btn::after { content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #fff; top: 3px; transition: left 0.2s; }`}</style>

      <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 26, height: 26, background: "var(--red)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}><Flame size={13} color="#fff" /></div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", color: "var(--ink)" }}>burned<span style={{ color: "var(--red)" }}>inbox</span></span>
        </Link>
        <Link href="/tools/infra-calc" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}><ArrowLeft size={13} /> Calculators</Link>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--red)", marginBottom: 10 }}>Calculator</p>
          <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.3px" }}>Domain Count Calculator</h1>
          <p style={{ fontSize: 15, color: "var(--ink-3)", lineHeight: 1.7 }}>How many domains do you need total — sending, tracking, backup — across your full operation.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 20 }}>Your setup</p>

            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Total inboxes</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", fontFamily: "'Geist Mono', monospace" }}>{totalInboxes}</span>
              </div>
              <input type="range" min={3} max={300} step={3} value={totalInboxes} onChange={e => setTotalInboxes(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}><span>3</span><span>300</span></div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Client count</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", fontFamily: "'Geist Mono', monospace" }}>{clients}</span>
              </div>
              <input type="range" min={1} max={50} step={1} value={clients} onChange={e => setClients(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}><span>1</span><span>50</span></div>
            </div>

            {[
              { label: "Separate domains per client", val: separateClients, set: setSeparate, note: "Isolates reputation" },
              { label: "Dedicated tracking domains",  val: trackingDomains, set: setTracking,  note: "1 per client" },
              { label: "Backup domain pool",          val: backupDomains,   set: setBackup,    note: "25% of sending" },
            ].map(({ label, val, set, note }) => (
              <div key={label} className="toggle" onClick={() => set(!val)}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{label}</span>
                  <span style={{ fontSize: 11, color: "var(--ink-5)", display: "block" }}>{note}</span>
                </div>
                <div className="tog-btn" style={{ background: val ? "var(--red)" : "var(--border)" }}>
                  <span style={{ position: "absolute", width: 14, height: 14, borderRadius: "50%", background: "#fff", top: 3, left: val ? 19 : 3, transition: "left 0.2s" }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-4)", marginBottom: 20 }}>Domain breakdown</p>
            <Row label="Sending domains" val={sendingDomains} note="max 3 inboxes each" />
            {separateClients && <Row label="Client isolation" val={perClient} note="dedicated per client" sub />}
            {trackingDomains && <Row label="Tracking domains" val={tracking} note="separate from sending" sub />}
            {backupDomains   && <Row label="Backup domains"   val={backup}   note="pre-warmed reserve"  sub />}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 0", marginTop: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Total domains</span>
              <span style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Geist Mono', monospace", color: "var(--red)" }}>{fmt(total)}</span>
            </div>
            <div style={{ padding: "12px 14px", background: "var(--paper-2)", borderRadius: 8, border: "1px solid var(--border)", marginTop: 8 }}>
              <p style={{ fontSize: 11, color: "var(--ink-4)", marginBottom: 4 }}>Annual registration cost</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", fontFamily: "'Geist Mono', monospace" }}>${costLow.toLocaleString()} – ${costHigh.toLocaleString()}</p>
              <p style={{ fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}>Based on $10–20/domain/year</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, padding: "16px 20px", background: "var(--red-dim)", border: "1px solid var(--red-border)", borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--ink)" }}>Critical:</strong> Never use your sending domain as your tracking domain. Keep client domains isolated so one bad campaign doesn&apos;t contaminate another. Check <a href="/tools/tracking-domain" style={{ color: "var(--red)", textDecoration: "none", fontWeight: 600 }}>tracking domain setup</a> before launching.
          </p>
        </div>
      </div>
    </div>
  );
}
