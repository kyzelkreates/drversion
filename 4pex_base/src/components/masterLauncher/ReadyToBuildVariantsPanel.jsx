// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// ReadyToBuildVariantsPanel.jsx — Run 10
import { POST_COMPLETION_INSTRUCTIONS } from '../../config/finalBaseCompletionRules.js';

const NEXT_STEPS = [
  { step: 1, text: 'Download the full project zip from Run 9 Base Package Builder.' },
  { step: 2, text: 'Choose ONE product variant to build first.' },
  { step: 3, text: 'Generate the Master Variant Prompt from Run 10 Master Variant Launcher.' },
  { step: 4, text: 'Attach the zip to your chosen builder tool (Base44 / Manus / Cursor / Replit).' },
  { step: 5, text: 'Start a NEW isolated project — do NOT reuse or overwrite this base.' },
  { step: 6, text: 'Paste the Master Variant Prompt into the builder as the first message.' },
  { step: 7, text: 'Build ONE variant at a time.' },
];

const RECOMMENDED_FIRST = [
  'Four Paws LMS + Learner PWA',
  'Fleet Control Dashboard + Driver PWA',
  'Patient Monitoring Dashboard + Patient PWA',
  'Coach Training Dashboard + Training PWA',
  'Therapist Dashboard + Patient/Client PWA',
];

export default function ReadyToBuildVariantsPanel({ isComplete }) {
  if (!isComplete) {
    return (
      <div className="card">
        <div className="card-title">Ready to Build Variants</div>
        <div style={{ color: '#64748b', fontSize: 13 }}>
          Complete the base to unlock the variant build pathway.
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ border: '2px solid #22c55e' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#4ade80', marginBottom: 4 }}>
          4P3X Reusable Base Structure™ — COMPLETE
        </div>
        <div style={{ fontSize: 13, color: '#86efac' }}>
          Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
        </div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          Stop building the base. Begin real product variant builds.
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="section-header">What to do next</div>
        {NEXT_STEPS.map((s) => (
          <div key={s.step} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid #1e293b' }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: '#1e1b4b', color: '#a5b4fc',
              fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>{s.step}</div>
            <div style={{ fontSize: 13, color: '#e2e8f0', paddingTop: 3 }}>{s.text}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="section-header">Recommended First Variants</div>
        {RECOMMENDED_FIRST.map((v, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
            <span style={{ color: '#6366f1', fontSize: 14 }}>→</span>
            <span style={{ fontSize: 13, color: '#cbd5e1' }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 20,
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: 8,
        padding: 12,
        fontSize: 11,
        color: '#64748b',
        fontFamily: 'monospace',
        maxHeight: 200,
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
      }}>
        {POST_COMPLETION_INSTRUCTIONS}
      </div>
    </div>
  );
}
