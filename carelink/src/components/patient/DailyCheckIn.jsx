import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import DAILY_QUESTIONS from '../../config/dailyQuestions.js';
import { getTodayCheckIn, createCheckIn, submitCheckIn } from '../../lib/carelinkDb.js';
import { calculateCheckInRisk, correlateCheckIn } from '../../lib/correlationEngine.js';
import { getRiskFlagsByPatient, createRiskFlag, getCheckInsByPatient } from '../../lib/carelinkDb.js';
import SAFETY_TEXT from '../../config/medicalSafetyText.js';
import { nowIso } from '../../utils/date.js';

export function DailyCheckIn({ patient, onNavigate }) {
  const [step, setStep] = useState(0); // 0 = intro, 1-10 = questions, 11 = done
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [existingCI, setExistingCI] = useState(null);
  const [urgentShown, setUrgentShown] = useState(false);

  useEffect(() => {
    const ci = getTodayCheckIn(patient.id);
    if (ci?.submittedAt) setExistingCI(ci);
  }, [patient.id]);

  const q = DAILY_QUESTIONS[step - 1];
  const totalSteps = DAILY_QUESTIONS.length;
  const progress = step === 0 ? 0 : Math.round((step / totalSteps) * 100);

  function getCurrentAnswer() {
    return answers[q?.id];
  }

  function setAnswer(val) {
    setAnswers(prev => ({ ...prev, [q.id]: val }));
    // Show urgent warning immediately
    if (q.id === 'q5' && val !== 'none') setUrgentShown(true);
  }

  async function handleSubmit() {
    // Build answer records
    const answerRecords = DAILY_QUESTIONS.map(dq => {
      const val = answers[dq.id];
      let severityScore = 0;

      if (dq.answerType === 'scale') {
        const num = Number(val) || 0;
        if (dq.severityInvert) severityScore = Math.max(0, dq.scaleMax - num);
        else severityScore = num;
      } else if (dq.answerType === 'yes_no') {
        severityScore = (val === 'yes' || val === true) ? (dq.yesIsSevere ? 3 : 0) : 0;
      } else if (dq.answerType === 'urgent_concern') {
        const opt = dq.options?.find(o => o.value === val);
        severityScore = opt?.severity || 0;
      } else if (dq.answerType === 'status_selector') {
        const opt = dq.options?.find(o => o.value === val);
        severityScore = opt?.severity || 0;
      } else if (dq.answerType === 'free_text') {
        severityScore = val && val.trim().length > 5 ? 1 : 0;
      }

      return {
        questionId: dq.id,
        questionText: dq.questionText,
        answerType: dq.answerType,
        answerValue: val !== undefined ? val : null,
        severityScore,
        freeTextNote: dq.answerType === 'free_text' ? (val || '') : '',
        patientId: patient.id,
        submittedStatus: true,
        syncStatus: 'pending',
        createdAt: nowIso(),
      };
    });

    const { riskLevel, totalSeverityScore } = calculateCheckInRisk(answerRecords);

    // Create or find today's check-in
    let ci = getTodayCheckIn(patient.id);
    if (!ci) ci = createCheckIn({ patientId: patient.id });

    const finalCI = submitCheckIn(ci.id, answerRecords, totalSeverityScore, riskLevel);

    // Run correlation engine
    const recentCIs = getCheckInsByPatient(patient.id).slice(-3);
    const flags = correlateCheckIn({ patient, checkIn: finalCI, answers: answerRecords, recentCheckIns: recentCIs });
    for (const flag of flags) createRiskFlag(flag);

    setSubmitted(true);
    setStep(totalSteps + 1);
  }

  // Existing check-in guard
  if (existingCI) {
    return (
      <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
        <button onClick={() => onNavigate('patient-home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', padding: 0 }}>
          <ChevronLeft size={16} /> Back
        </button>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)', borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
          <Check size={40} color='var(--green-mid)' style={{ marginBottom: '14px' }} />
          <h2 style={{ color: 'var(--green-mid)', marginBottom: '8px' }}>Already checked in today!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            You completed today's check-in. Your care team can see your submission.
          </p>
          <button onClick={() => onNavigate('patient-timeline')} style={{ marginTop: '20px', padding: '10px 24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '13px' }}>
            View My Submissions
          </button>
        </div>
      </div>
    );
  }

  // Done screen
  if (step === totalSteps + 1 && submitted) {
    return (
      <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
          <Check size={48} color='var(--green-mid)' style={{ marginBottom: '16px' }} />
          <h2 style={{ color: 'var(--green-mid)', margin: '0 0 10px', fontSize: '20px' }}>Check-in submitted</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px', lineHeight: 1.5 }}>
            Thank you. Your responses have been saved and will be reviewed by your care team.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '24px', lineHeight: 1.5 }}>
            {SAFETY_TEXT.patientNotice}
          </p>
          <button onClick={() => onNavigate('patient-home')} style={{
            padding: '12px 28px', background: 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))',
            border: 'none', borderRadius: '10px', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer', fontSize: '14px',
          }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Intro screen
  if (step === 0) {
    return (
      <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
        <button onClick={() => onNavigate('patient-home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', padding: 0 }}>
          <ChevronLeft size={16} /> Back
        </button>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: '16px', padding: '28px' }}>
          <h2 style={{ color: 'var(--gold-bright)', margin: '0 0 10px', fontSize: '20px' }}>Daily Recovery Check-In</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
            {totalSteps} quick questions about how you're feeling today. Your answers are saved privately and shared with your care team.
          </p>
          <ul style={{ color: 'var(--text-muted)', fontSize: '12px', paddingLeft: '16px', marginBottom: '24px', lineHeight: 2 }}>
            <li>Takes about 2 minutes</li>
            <li>Your answers are saved locally</li>
            <li>Your care team will review your responses</li>
            <li>This is not an emergency service</li>
          </ul>
          <button onClick={() => setStep(1)} style={{
            width: '100%', padding: '14px', background: 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))',
            border: 'none', borderRadius: '12px', color: '#0a0a0a', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
          }}>
            Begin Check-In
          </button>
        </div>
      </div>
    );
  }

  // Question screen
  const current = answers[q.id];
  const hasAnswer = current !== undefined && current !== null && current !== '';

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0, fontSize: '13px' }}>
          <ChevronLeft size={16} /> Back
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{step} / {totalSteps}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--gold-mid), var(--gold-bright))', borderRadius: '4px', transition: 'width 0.3s' }} />
      </div>

      {/* Urgent warning */}
      {urgentShown && q.id !== 'q5' && (
        <div style={{ background: 'rgba(255,68,85,0.1)', border: '1px solid rgba(255,68,85,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <AlertTriangle size={16} color='var(--status-error)' style={{ flexShrink: 0, marginTop: '1px' }} />
          <p style={{ color: 'var(--status-error)', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
            You indicated an urgent concern. Please contact your care team or emergency services if you feel you need immediate help.
          </p>
        </div>
      )}

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Question {step}</p>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '17px', fontWeight: 600, lineHeight: 1.4, margin: '0 0 24px' }}>
          {q.questionText}
        </h3>

        {/* Scale */}
        {q.answerType === 'scale' && (
          <div>
            {q.id === 'q2' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap' }}>
                  {Array.from({ length: q.scaleMax - q.scaleMin + 1 }, (_, i) => q.scaleMin + i).map(v => (
                    <button key={v} onClick={() => setAnswer(v)} style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: current === v ? 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))' : 'var(--bg-secondary)',
                      border: `1px solid ${current === v ? 'var(--gold-bright)' : 'var(--border-card)'}`,
                      color: current === v ? '#0a0a0a' : 'var(--text-secondary)', fontWeight: current === v ? 700 : 400,
                      cursor: 'pointer', fontSize: '14px',
                    }}>{v}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ color: 'var(--green-mid)', fontSize: '11px' }}>No pain</span>
                  <span style={{ color: 'var(--status-error)', fontSize: '11px' }}>Worst</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                {Array.from({ length: q.scaleMax - q.scaleMin + 1 }, (_, i) => q.scaleMin + i).map(v => (
                  <button key={v} onClick={() => setAnswer(v)} style={{
                    flex: 1, padding: '12px 6px', borderRadius: '10px',
                    background: current === v ? 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))' : 'var(--bg-secondary)',
                    border: `1px solid ${current === v ? 'var(--gold-bright)' : 'var(--border-card)'}`,
                    color: current === v ? '#0a0a0a' : 'var(--text-secondary)', fontWeight: current === v ? 700 : 400,
                    cursor: 'pointer', fontSize: '12px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '2px' }}>{v}</div>
                    <div style={{ fontSize: '10px' }}>{q.scaleLabels?.[v] || ''}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Yes/No */}
        {q.answerType === 'yes_no' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            {['yes', 'no'].map(opt => (
              <button key={opt} onClick={() => setAnswer(opt)} style={{
                flex: 1, padding: '16px', borderRadius: '12px', fontSize: '15px', fontWeight: 600,
                background: current === opt
                  ? opt === 'yes' ? 'rgba(176,96,255,0.2)' : 'rgba(0,204,106,0.15)'
                  : 'var(--bg-secondary)',
                border: `1px solid ${current === opt ? (opt === 'yes' ? 'var(--border-purple)' : 'var(--border-green)') : 'var(--border-card)'}`,
                color: current === opt ? (opt === 'yes' ? 'var(--purple-bright)' : 'var(--green-mid)') : 'var(--text-secondary)',
                cursor: 'pointer', textTransform: 'capitalize',
              }}>{opt}</button>
            ))}
          </div>
        )}

        {/* Options (urgent_concern / status_selector) */}
        {(q.answerType === 'urgent_concern' || q.answerType === 'status_selector') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {q.options.map(opt => (
              <button key={opt.value} onClick={() => setAnswer(opt.value)} style={{
                padding: '13px 16px', borderRadius: '10px', textAlign: 'left',
                background: current === opt.value ? 'rgba(245,200,66,0.12)' : 'var(--bg-secondary)',
                border: `1px solid ${current === opt.value ? 'var(--border-gold)' : 'var(--border-card)'}`,
                color: current === opt.value ? 'var(--gold-bright)' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '13px', fontWeight: current === opt.value ? 600 : 400,
              }}>{opt.label}</button>
            ))}
          </div>
        )}

        {/* Free text */}
        {q.answerType === 'free_text' && (
          <textarea
            value={current || ''}
            onChange={e => setAnswer(e.target.value)}
            placeholder={q.placeholder}
            rows={4}
            style={{
              width: '100%', padding: '12px', background: 'var(--bg-secondary)',
              border: '1px solid var(--border-card)', borderRadius: '10px',
              color: 'var(--text-primary)', fontSize: '14px', resize: 'vertical', outline: 'none',
              lineHeight: 1.5, boxSizing: 'border-box',
            }}
          />
        )}
      </div>

      {step < totalSteps ? (
        <button
          onClick={() => setStep(s => s + 1)}
          disabled={!hasAnswer}
          style={{
            width: '100%', padding: '14px',
            background: hasAnswer ? 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))' : 'var(--bg-secondary)',
            border: 'none', borderRadius: '12px',
            color: hasAnswer ? '#0a0a0a' : 'var(--text-muted)',
            fontWeight: 700, fontSize: '15px',
            cursor: hasAnswer ? 'pointer' : 'not-allowed',
          }}
        >
          Next <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!hasAnswer}
          style={{
            width: '100%', padding: '14px',
            background: hasAnswer ? 'linear-gradient(135deg, var(--green-dim), var(--green-mid))' : 'var(--bg-secondary)',
            border: 'none', borderRadius: '12px',
            color: hasAnswer ? '#0a0a0a' : 'var(--text-muted)',
            fontWeight: 700, fontSize: '15px',
            cursor: hasAnswer ? 'pointer' : 'not-allowed',
          }}
        >
          Submit Check-In ✓
        </button>
      )}
    </div>
  );
}
export default DailyCheckIn;
