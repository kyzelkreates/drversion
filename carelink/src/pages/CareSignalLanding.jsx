// CareSignal OS™ — Public Landing & Explainer Page
// Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™
// SAFE — layers on top of existing dashboard + PWA. Does not replace either.

import React, { useState, useEffect } from 'react';

// ─── Shared style helpers ─────────────────────────────────────────────
const s = {
  section: { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
  h2: { fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, color: '#f5c842', margin: '0 0 12px', lineHeight: 1.2 },
  h3: { fontSize: 'clamp(15px, 2.5vw, 20px)', fontWeight: 700, color: '#e8e8e8', margin: '0 0 10px' },
  p:  { fontSize: 'clamp(14px, 2vw, 16px)', color: '#a0a0a0', lineHeight: 1.75, margin: '0 0 16px' },
  label: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f5c842', marginBottom: '10px', display: 'block' },
  divider: { width: '48px', height: '3px', background: 'linear-gradient(90deg, #f5c842, transparent)', margin: '14px 0 24px', borderRadius: '2px' },
  card: { background: '#141414', border: '1px solid #252525', borderRadius: '16px', padding: '28px' },
  goldCard: { background: 'linear-gradient(135deg, rgba(245,200,66,0.07), rgba(245,200,66,0.02))', border: '1px solid rgba(245,200,66,0.25)', borderRadius: '16px', padding: '28px' },
};

function Badge({ children, color = '#f5c842' }) {
  return (
    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color, background: `${color}18`, border: `1px solid ${color}40`, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant = 'gold', style: extra = {} }) {
  const [hov, setHov] = useState(false);
  const base = { padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.18s', whiteSpace: 'nowrap', border: 'none', ...extra };
  const v = {
    gold:   { background: hov ? '#f5c842'  : 'rgba(245,200,66,0.12)',  color: hov ? '#0a0a0a' : '#f5c842',  border: '1px solid rgba(245,200,66,0.5)' },
    silver: { background: hov ? '#e8e8e8'  : 'rgba(232,232,232,0.08)', color: hov ? '#0a0a0a' : '#e8e8e8',  border: '1px solid rgba(232,232,232,0.3)' },
    green:  { background: hov ? '#00ff88'  : 'rgba(0,255,136,0.1)',    color: hov ? '#0a0a0a' : '#00ff88',   border: '1px solid rgba(0,255,136,0.4)' },
    ghost:  { background: 'transparent', color: hov ? '#f5c842' : '#666', border: '1px solid #252525' },
  };
  return <button style={{ ...base, ...v[variant] }} onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{children}</button>;
}

function SHead({ label, title, sub }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <span style={s.label}>{label}</span>
      <div style={s.divider} />
      <h2 style={s.h2}>{title}</h2>
      {sub && <p style={{ ...s.p, maxWidth: '680px' }}>{sub}</p>}
    </div>
  );
}

function Grid({ cols = 3, children }) {
  const minW = cols === 2 ? '300px' : cols === 4 ? '200px' : '220px';
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minW}), 1fr))`, gap: '18px' }}>{children}</div>;
}

function ICard({ emoji, title, desc, color = '#f5c842' }) {
  return (
    <div style={s.card}>
      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${color}18`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '14px' }}>{emoji}</div>
      <h3 style={{ ...s.h3, fontSize: '15px', marginBottom: '8px' }}>{title}</h3>
      {desc && <p style={{ ...s.p, fontSize: '13px', margin: 0 }}>{desc}</p>}
    </div>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────
function Topbar({ onDash, onPwa }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(10,10,10,0.96)' : 'rgba(10,10,10,0.7)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${scrolled ? '#252525' : 'transparent'}`, transition: 'all 0.2s', padding: '0 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #f5c842, #d4a017)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#0a0a0a', fontSize: '16px' }}>C</div>
          <span style={{ fontWeight: 800, fontSize: '15px', color: '#f5c842', letterSpacing: '-0.02em' }}>CareSignal OS™</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Btn variant="ghost" onClick={onPwa} style={{ padding: '9px 16px', fontSize: '12px' }}>Patient App</Btn>
          <Btn variant="gold"  onClick={onDash} style={{ padding: '9px 18px', fontSize: '12px' }}>Dashboard</Btn>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────
function Hero({ onDash, onPwa }) {
  return (
    <section style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(245,200,66,0.09) 0%, transparent 70%), #0a0a0a', padding: '140px 20px 100px', textAlign: 'center' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}><Badge color="#f5c842">4P3X Verse™ Product</Badge></div>
        <h1 style={{ fontSize: 'clamp(38px, 8vw, 76px)', fontWeight: 900, color: '#f5c842', margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1.05 }}>CareSignal OS™</h1>
        <p style={{ fontSize: 'clamp(14px, 2.5vw, 18px)', color: '#888', fontWeight: 500, margin: '0 0 20px' }}>
          Doctor, patient, recovery, and support monitoring platform<br />
          <span style={{ color: '#f5c842', fontWeight: 700 }}>Powered by 4P3X Intelligent AI™</span>{' '}
          <span style={{ color: '#555' }}>Created by Kyzel Kreates™</span>
        </p>
        <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: '#a0a0a0', lineHeight: 1.7, maxWidth: '700px', margin: '0 auto 36px' }}>
          A modular care-support system connecting a professional dashboard with a patient-facing PWA to help organise recovery signals, check-ins, progress updates, follow-up actions, and support workflows.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '44px' }}>
          {['Live Deployed Product','Patient Monitoring','Recovery Support','Care Signals','Dashboard + PWA','Demo Mode / Live Mode Ready','Powered by 4P3X Intelligent AI™'].map((b) => (
            <Badge key={b} color="#f5c842">{b}</Badge>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: '20px' }}>
          <Btn variant="gold"   onClick={onDash} style={{ padding: '16px 32px', fontSize: '15px' }}>🖥️ Open Control Dashboard</Btn>
          <Btn variant="silver" onClick={onPwa}  style={{ padding: '16px 32px', fontSize: '15px' }}>📱 Open Patient Recovery PWA</Btn>
          <Btn variant="ghost"  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '16px 28px', fontSize: '15px' }}>View How It Works ↓</Btn>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88', display: 'inline-block', boxShadow: '0 0 8px #00ff8866' }} />
          <span style={{ color: '#555', fontSize: '12px' }}>kyzelkreates.github.io/drversion — live deployed</span>
        </div>
      </div>
    </section>
  );
}

// ─── Section 1: What ──────────────────────────────────────────────────
function WhatSection() {
  return (
    <div style={{ background: '#111111', padding: '72px 0' }}>
      <div style={s.section}>
        <SHead label="Section 01 — What" title="What is CareSignal OS™?" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: '32px', alignItems: 'start' }}>
          <div>
            <p style={s.p}>CareSignal OS™ is a modular patient monitoring, recovery-support, and care-signal platform designed to connect a professional control dashboard with a patient-facing PWA. It helps demonstrate how recovery journeys, check-ins, notes, progress updates, wellbeing signals, tasks, alerts, and follow-up workflows can be organised in one clear system.</p>
            <p style={s.p}>CareSignal OS™ does not replace medical judgement. It is a structured digital support layer designed to help professionals, support teams, and patients see recovery information more clearly.</p>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Badge color="#00ff88">Recovery Support</Badge>
              <Badge color="#f5c842">Care Signals</Badge>
              <Badge color="#b060ff">Workflow Organisation</Badge>
              <Badge color="#4a9eff">Decision-Support Layer</Badge>
            </div>
          </div>
          <div style={s.goldCard}>
            <h3 style={{ ...s.h3, color: '#f5c842', marginBottom: '16px' }}>What CareSignal OS™ is</h3>
            {['A modular care-support system','A professional control dashboard','A patient-facing recovery PWA','A recovery signal organiser','A workflow-support layer','A demo/live mode product','Part of the 4P3X Verse™ ecosystem'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ color: '#00ff88', fontSize: '13px', flexShrink: 0 }}>✓</span>
                <span style={{ color: '#a0a0a0', fontSize: '14px' }}>{item}</span>
              </div>
            ))}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(245,200,66,0.15)' }}>
              <h3 style={{ ...s.h3, color: '#555', fontSize: '13px', marginBottom: '10px' }}>What it is NOT</h3>
              {['Not a diagnostic tool','Not a prescription system','Not a replacement for clinicians','Not a regulated medical device'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#ff4455', fontSize: '13px', flexShrink: 0 }}>✗</span>
                  <span style={{ color: '#555', fontSize: '13px' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section 2: Who ───────────────────────────────────────────────────
function WhoSection() {
  const users = [
    { emoji:'🩺', title:'Doctors & Clinics', desc:'Professional oversight and patient record visibility', color:'#f5c842' },
    { emoji:'🧠', title:'Therapists', desc:'Session follow-up, progress tracking, and note organisation', color:'#f5c842' },
    { emoji:'🏥', title:'Recovery Teams', desc:'Multi-patient monitoring and care signal dashboards', color:'#f5c842' },
    { emoji:'🤝', title:'Care Coordinators', desc:'Cross-team visibility and follow-up action management', color:'#f5c842' },
    { emoji:'🏃', title:'Rehabilitation Services', desc:'Progress tracking and milestone management', color:'#f5c842' },
    { emoji:'💚', title:'Mental Health & Wellbeing', desc:'Wellbeing signal monitoring and check-in tracking', color:'#00ff88' },
    { emoji:'🏠', title:'Home Recovery Patients', desc:'Guided check-ins and between-appointment support', color:'#4a9eff' },
    { emoji:'👨‍👩‍👧', title:'Family-Supported Pathways', desc:'Recovery visibility for family-supported care', color:'#4a9eff' },
    { emoji:'🏢', title:'Workplace Health Teams', desc:'Return-to-work and burnout recovery support', color:'#b060ff' },
    { emoji:'🌍', title:'Community Care Teams', desc:'Distributed care signal monitoring and visibility', color:'#b060ff' },
    { emoji:'🔒', title:'Private Healthcare', desc:'Premium recovery-support workflow organisation', color:'#f5c842' },
    { emoji:'📡', title:'Remote Support Services', desc:'Remote patient check-ins and signal visibility', color:'#4a9eff' },
  ];
  return (
    <div style={{ background: '#0a0a0a', padding: '72px 0' }}>
      <div style={s.section}>
        <SHead label="Section 02 — Who" title="Who is CareSignal OS™ for?" sub="CareSignal OS™ is for people and organisations that need a clearer way to monitor recovery information, patient progress, check-ins, follow-up actions, and support needs between appointments or sessions." />
        <Grid cols={3}>{users.map((u) => <ICard key={u.title} {...u} />)}</Grid>
      </div>
    </div>
  );
}

// ─── Section 3: Where ─────────────────────────────────────────────────
function WhereSection() {
  const envs = ['GP / clinic support workflows','Outpatient recovery','Post-treatment follow-up','Therapy and counselling support','Rehabilitation programmes','Burnout and wellbeing recovery','Home recovery monitoring','Community care','Supported living','Remote patient check-ins','Private healthcare services','Workplace recovery / return-to-work'];
  return (
    <div style={{ background: '#111111', padding: '72px 0' }}>
      <div style={s.section}>
        <SHead label="Section 03 — Where" title="Where can it be used?" sub="CareSignal OS™ can be adapted for clinics, recovery services, wellbeing teams, therapy providers, rehabilitation programmes, community care settings, and remote support services where progress needs to be tracked between appointments." />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {envs.map((e) => (
            <span key={e} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#b060ff', background: 'rgba(176,96,255,0.1)', border: '1px solid rgba(176,96,255,0.25)' }}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section 4: When ──────────────────────────────────────────────────
function WhenSection() {
  const moments = [
    { emoji:'📅', title:'After appointments', desc:'Keep recovery visibility going between sessions', color:'#4a9eff' },
    { emoji:'📋', title:'During recovery plans', desc:'Organise tasks, milestones, and progress markers', color:'#4a9eff' },
    { emoji:'🔔', title:'Between check-ins', desc:'Capture patient updates and wellbeing signals', color:'#4a9eff' },
    { emoji:'👁️', title:'When monitoring is needed', desc:'Track ongoing recovery with a structured system', color:'#4a9eff' },
    { emoji:'📊', title:'When visibility matters', desc:'Give care teams a clearer picture of patient progress', color:'#4a9eff' },
    { emoji:'🚩', title:'When escalation signals arise', desc:'Record and flag signals that need follow-up attention', color:'#ff4455' },
    { emoji:'📈', title:'Reviewing progress over time', desc:'Recovery data, trends, and timeline history', color:'#4a9eff' },
    { emoji:'🔄', title:'Recovery beyond appointments', desc:'Structured support for ongoing recovery journeys', color:'#00ff88' },
  ];
  return (
    <div style={{ background: '#0a0a0a', padding: '72px 0' }}>
      <div style={s.section}>
        <SHead label="Section 04 — When" title="When would CareSignal OS™ be used?" sub="CareSignal OS™ becomes useful when recovery continues outside the appointment room. It helps organise what happens between sessions: patient check-ins, notes, progress markers, support tasks, symptoms, wellbeing updates, and follow-up actions." />
        <Grid cols={4}>{moments.map((m) => <ICard key={m.title} {...m} />)}</Grid>
      </div>
    </div>
  );
}

// ─── Section 5: Why ───────────────────────────────────────────────────
function WhySection() {
  return (
    <div style={{ background: '#111111', padding: '72px 0' }}>
      <div style={s.section}>
        <SHead label="Section 05 — Why" title="Why was CareSignal OS™ built?" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: '32px' }}>
          <div>
            <p style={s.p}>CareSignal OS™ was built to demonstrate how the 4P3X Verse™ modular architecture can be refactored into a healthcare, recovery, and patient-support product. Many recovery journeys involve scattered information, missed follow-ups, unclear progress, and disconnected communication.</p>
            <p style={s.p}>CareSignal OS™ shows how a dashboard and patient PWA can create a clearer structure around recovery without replacing professional judgement.</p>
            <p style={{ ...s.p, color: '#f5c842', fontWeight: 600 }}>This is part of the wider 4P3X Verse™ concept: one reusable modular architecture that can be adapted into many sector-ready products.</p>
          </div>
          <div style={s.goldCard}>
            <h3 style={{ ...s.h3, color: '#f5c842', marginBottom: '16px' }}>The 4P3X Verse™ principle</h3>
            <p style={{ ...s.p, fontSize: '14px' }}>The same modular base architecture powers every 4P3X Verse™ product — from healthcare and recovery to compliance, operations, and beyond. CareSignal OS™ is one sector adaptation.</p>
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(245,200,66,0.15)' }}>
              <p style={{ color: '#f5c842', fontWeight: 800, fontSize: '15px', margin: '0 0 6px', fontStyle: 'italic' }}>"Demo Mode shows the product.<br />Live Mode runs the product."</p>
              <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>— 4P3X Verse™ core principle</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section 6: How ───────────────────────────────────────────────────
function HowSection() {
  const dashItems = ['Professional patient overview','Recovery records and status','Check-in history and results','Clinical notes and care team notes','Care signals and follow-up flags','Alerts and risk indicators','Progress tracking over time','Support-team coordination view','Reports and data export'];
  const pwaItems  = ['Patient-facing mobile app','Daily recovery check-ins','Guided progress updates','Symptom and wellbeing reporting','Medication and recovery notes','Recovery timeline view','Support task completion','Installable on any device home screen','Works offline after first load','Simple between-appointment support'];
  return (
    <section id="how-it-works" style={{ background: '#0a0a0a', padding: '72px 0' }}>
      <div style={s.section}>
        <SHead label="Section 06 — How" title="How CareSignal OS™ works" sub="The dashboard gives the professional or support team a control view. The patient PWA gives the person receiving support a simple mobile recovery companion. Together, they show how recovery information, care signals, and support actions can move between the patient and the team responsible for helping them." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: '24px' }}>
          <div style={{ ...s.card, border: '1px solid rgba(245,200,66,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '28px' }}>🖥️</span>
              <div><h3 style={{ ...s.h3, marginBottom: '2px' }}>Control Dashboard</h3><span style={{ color: '#555', fontSize: '12px' }}>Professional / clinical side</span></div>
            </div>
            {dashItems.map((item) => (
              <div key={item} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#f5c842', fontSize: '12px', marginTop: '3px', flexShrink: 0 }}>◆</span>
                <span style={{ color: '#a0a0a0', fontSize: '14px' }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ ...s.card, border: '1px solid rgba(0,255,136,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '28px' }}>📱</span>
              <div><h3 style={{ ...s.h3, marginBottom: '2px' }}>Patient Recovery PWA</h3><span style={{ color: '#555', fontSize: '12px' }}>Patient-facing mobile side</span></div>
            </div>
            {pwaItems.map((item) => (
              <div key={item} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#00ff88', fontSize: '12px', marginTop: '3px', flexShrink: 0 }}>◆</span>
                <span style={{ color: '#a0a0a0', fontSize: '14px' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 7: Shortcuts ─────────────────────────────────────────────
function ShortcutsSection({ onDash, onPwa }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(245,200,66,0.04) 0%, rgba(176,96,255,0.04) 100%)', borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e', padding: '72px 0' }}>
      <div style={s.section}>
        <SHead label="Section 07 — Access" title="Open CareSignal OS™ now" sub="Both systems are live and deployed. Choose your access point below." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(245,200,66,0.08), rgba(245,200,66,0.02))', border: '1px solid rgba(245,200,66,0.3)', borderRadius: '20px', padding: '36px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #f5c842, #d4a017)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🖥️</div>
            <div>
              <h3 style={{ ...s.h3, color: '#f5c842', fontSize: '20px', marginBottom: '8px' }}>Control Dashboard</h3>
              <p style={{ ...s.p, fontSize: '14px', margin: 0 }}>Open the professional-side dashboard for patient and recovery overview, care signals, records, progress updates, and support workflow management.</p>
            </div>
            <Btn variant="gold" onClick={onDash} style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>🖥️ Open Control Dashboard</Btn>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,255,136,0.01))', border: '1px solid rgba(0,255,136,0.25)', borderRadius: '20px', padding: '36px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #00ff88, #00cc6a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>📱</div>
            <div>
              <h3 style={{ ...s.h3, color: '#00ff88', fontSize: '20px', marginBottom: '8px' }}>Patient Recovery PWA</h3>
              <p style={{ ...s.p, fontSize: '14px', margin: 0 }}>Open the patient-facing progressive web app for recovery check-ins, guided updates, support tasks, and installable mobile access.</p>
            </div>
            <Btn variant="green" onClick={onPwa} style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>📱 Open Patient Recovery PWA</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section 8: Responsible Use ──────────────────────────────────────
function ResponsibleSection() {
  const points = [
    { e:'👁️', t:'Human oversight required — professionals remain responsible for all decisions' },
    { e:'🚫', t:'Not a diagnostic tool — does not diagnose, detect, or identify conditions' },
    { e:'🚫', t:'Not a treatment replacement — does not prescribe, treat, or cure' },
    { e:'📊', t:'No guaranteed recovery outcome — recovery support only' },
    { e:'🔒', t:'Data privacy required for any live use with real patient data' },
    { e:'🏛️', t:'Clinical governance required before any real healthcare deployment' },
    { e:'🚨', t:'Emergency situations must use emergency services — 999 / 911 / 112' },
  ];
  return (
    <section id="responsible-use" style={{ background: '#0f0a0a', padding: '72px 0', borderTop: '1px solid rgba(255,68,85,0.15)' }}>
      <div style={s.section}>
        <SHead label="Section 08 — Responsible Use" title="Responsible use & safety disclaimer" />
        <div style={{ background: 'rgba(255,68,85,0.04)', border: '1px solid rgba(255,68,85,0.2)', borderRadius: '16px', padding: '32px' }}>
          <p style={{ ...s.p, color: '#e8e8e8', fontSize: '15px', marginBottom: '24px' }}>CareSignal OS™ is a prototype / product demonstration for recovery support, monitoring, workflow organisation, and patient engagement. It does not diagnose, treat, cure, prescribe, or replace qualified medical professionals. Any live healthcare use would require appropriate clinical governance, data protection, security, consent, safeguarding procedures, backend validation, and professional oversight.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '12px' }}>
            {points.map((p) => (
              <div key={p.t} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '14px 16px' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{p.e}</span>
                <span style={{ color: '#a0a0a0', fontSize: '13px', lineHeight: 1.5 }}>{p.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 9: 4P3X Ecosystem ────────────────────────────────────────
function EcosystemSection() {
  const sectors = [
    { l:'Healthcare', e:'🏥', c:'#00ff88' },{ l:'Recovery', e:'💚', c:'#00cc6a' },
    { l:'Compliance', e:'🛡️', c:'#f5c842' },{ l:'Operations', e:'⚙️', c:'#4a9eff' },
    { l:'Wellbeing', e:'🧠', c:'#b060ff' }, { l:'Finance', e:'📊', c:'#f5c842' },
    { l:'Education', e:'🎓', c:'#4a9eff' }, { l:'And more…', e:'🌐', c:'#555' },
  ];
  return (
    <div style={{ background: '#111111', padding: '72px 0' }}>
      <div style={s.section}>
        <SHead label="Section 09 — Ecosystem" title="4P3X Verse™ Ecosystem" sub="CareSignal OS™ is one sector variant of the 4P3X Verse™. The same modular base architecture can support dashboards, PWAs, AI guidance layers, demo/live mode switching, progress tracking, reporting, and backend-ready workflows across many industries." />
        <div style={{ ...s.goldCard, marginBottom: '28px' }}>
          <p style={{ fontSize: 'clamp(17px, 3vw, 22px)', fontWeight: 800, color: '#f5c842', margin: '0 0 8px', fontStyle: 'italic' }}>"Demo Mode shows the product. Live Mode runs the product."</p>
          <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>— 4P3X Verse™ core principle</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '14px' }}>
          {sectors.map((item) => (
            <div key={item.l} style={{ background: '#0a0a0a', border: '1px solid #252525', borderRadius: '12px', padding: '18px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.e}</div>
              <span style={{ color: item.c, fontSize: '13px', fontWeight: 700 }}>{item.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section 10: Demo → Live ──────────────────────────────────────────
function DemoLiveSection() {
  return (
    <div style={{ background: '#0a0a0a', padding: '72px 0' }}>
      <div style={s.section}>
        <SHead label="Section 10 — Demo Mode / Live Mode" title="Demo Mode to Live Mode" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '24px' }}>
          <div style={{ ...s.card, border: '1px solid rgba(245,200,66,0.25)' }}>
            <div style={{ marginBottom: '16px' }}><Badge color="#f5c842">Demo Mode</Badge></div>
            <p style={{ ...s.p, fontSize: '14px' }}>In Demo Mode, CareSignal OS™ safely demonstrates the product experience using controlled sample workflows. Demo data stays separate from real patient data at all times. All product features, flows, and structures are visible without real user data.</p>
            <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>⚠️ Demo data must never be mixed with real patient records.</p>
          </div>
          <div style={{ ...s.card, border: '1px solid rgba(0,255,136,0.2)' }}>
            <div style={{ marginBottom: '16px' }}><Badge color="#00ff88">Live Mode</Badge></div>
            <p style={{ ...s.p, fontSize: '14px' }}>In Live Mode, the system connects to a backend such as Supabase, Firebase, or another suitable platform to support real users, authentication, secure records, persistent recovery data, live updates, dashboards, and role-based access.</p>
            <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>🔒 Live use requires: secure backend, consent, privacy controls, clinical governance, and professional oversight.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section 11: Future ───────────────────────────────────────────────
function FutureSection() {
  const futures = ['Clinic recovery monitoring platform','Therapy follow-up platform','Post-treatment recovery tracker','Rehabilitation progress system','Community care dashboard','Wellbeing support PWA','Workplace return-to-health system','Family-supported recovery tracker','Remote patient engagement tool','AI-assisted care coordination layer','Patient signal and follow-up visibility dashboard'];
  return (
    <div style={{ background: '#111111', padding: '72px 0' }}>
      <div style={s.section}>
        <SHead label="Section 11 — Future" title="What CareSignal OS™ can become" sub="With the right backend, governance, and adaptation — CareSignal OS™ could be deployed into many recovery and care settings." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '12px' }}>
          {futures.map((f, i) => (
            <div key={f} style={{ background: '#0a0a0a', border: '1px solid #252525', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#b060ff', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>{String(i+1).padStart(2,'0')}</span>
              <span style={{ color: '#a0a0a0', fontSize: '14px' }}>{f}</span>
            </div>
          ))}
        </div>
        <p style={{ ...s.p, marginTop: '20px', fontStyle: 'italic', color: '#444' }}>* All future variations described use careful wording: could become, can be adapted into, designed to demonstrate, future live version could support.</p>
      </div>
    </div>
  );
}

// ─── Section 12: Architecture ─────────────────────────────────────────
function ArchSection() {
  const layers = [
    { emoji:'🌐', title:'Landing Page Layer',    desc:'Public-facing explainer, hero, CTA, and ecosystem context',           color:'#f5c842' },
    { emoji:'🖥️', title:'Dashboard Layer',       desc:'Professional control view, patient records, signals, flags, progress', color:'#f5c842' },
    { emoji:'📱', title:'Patient PWA Layer',      desc:'Installable mobile recovery companion, offline-ready, check-ins',     color:'#00ff88' },
    { emoji:'💾', title:'Data / Config Layer',    desc:'Local-first SSOT with structured demo/live separation',               color:'#4a9eff' },
    { emoji:'🔁', title:'Demo / Live Separation', desc:'Safe demo data pathway with backend-ready upgrade path',              color:'#b060ff' },
    { emoji:'🤖', title:'AI Guidance Layer',      desc:'Powered by 4P3X Intelligent AI™ — context, signals, insights',       color:'#f5c842' },
  ];
  return (
    <section id="architecture" style={{ background: '#0a0a0a', padding: '72px 0' }}>
      <div style={s.section}>
        <SHead label="Section 12 — Architecture" title="Tech & Architecture" sub="CareSignal OS™ follows the 4P3X modular architecture pattern: public landing page, control dashboard, installable patient PWA, structured demo/live data pathway, AI-assisted explanation layer, and backend-ready upgrade path." />
        <Grid cols={3}>{layers.map((l) => <ICard key={l.title} {...l} />)}</Grid>
        <div style={{ marginTop: '28px', ...s.goldCard }}>
          <h3 style={{ ...s.h3, color: '#f5c842', marginBottom: '14px' }}>Backend-ready upgrade path</h3>
          <p style={{ ...s.p, fontSize: '14px', marginBottom: '16px' }}>In demo mode it can show the experience safely. In live mode it can connect to Supabase, Firebase, or another suitable backend to support authentication, persistence, real user records, secure access, and live updates.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['Supabase','Firebase','Role-based auth','Secure records','Real-time updates','PWA installable','Offline support'].map((t) => (
              <Badge key={t} color="#f5c842">{t}</Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────
function Footer({ onDash, onPwa }) {
  return (
    <footer style={{ background: '#0d0d0d', borderTop: '1px solid #1e1e1e', padding: '48px 20px 32px', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ fontSize: '22px', fontWeight: 900, color: '#f5c842', marginBottom: '8px' }}>CareSignal OS™</div>
        <p style={{ color: '#555', fontSize: '12px', marginBottom: '24px' }}>Powered by 4P3X Intelligent AI™ · Created by Kyzel Kreates™ · 4P3X Verse™ Ecosystem</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '28px' }}>
          <Btn variant="gold"   onClick={onDash} style={{ padding: '12px 24px', fontSize: '13px' }}>🖥️ Open Control Dashboard</Btn>
          <Btn variant="silver" onClick={onPwa}  style={{ padding: '12px 24px', fontSize: '13px' }}>📱 Open Patient Recovery PWA</Btn>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginBottom: '24px' }}>
          {[{l:'How It Works',id:'how-it-works'},{l:'Responsible Use',id:'responsible-use'},{l:'Architecture',id:'architecture'}].map(({ l, id }) => (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'none', border: 'none', color: '#555', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>{l}</button>
          ))}
        </div>
        <p style={{ color: '#333', fontSize: '11px', lineHeight: 1.6 }}>CareSignal OS™ is a product demonstration. It does not diagnose, treat, cure, or replace qualified medical professionals. Any live healthcare deployment requires clinical governance, data protection, and professional oversight.</p>
      </div>
    </footer>
  );
}

// ─── Main export ──────────────────────────────────────────────────────
export function CareSignalLanding({ onNavigate }) {
  // Wire to EXISTING working routes — no new routes created
  const onDash = () => onNavigate('/carelink', { initialMode: 'clinical' });
  const onPwa  = () => onNavigate('/carelink', { initialMode: 'patient' });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", overflowX: 'hidden' }}>
      <Topbar onDash={onDash} onPwa={onPwa} />
      <Hero onDash={onDash} onPwa={onPwa} />
      <WhatSection />
      <WhoSection />
      <WhereSection />
      <WhenSection />
      <WhySection />
      <HowSection />
      <ShortcutsSection onDash={onDash} onPwa={onPwa} />
      <ResponsibleSection />
      <EcosystemSection />
      <DemoLiveSection />
      <FutureSection />
      <ArchSection />
      <Footer onDash={onDash} onPwa={onPwa} />
    </div>
  );
}

export default CareSignalLanding;
