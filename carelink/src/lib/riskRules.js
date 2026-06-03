// 4P3X CareLink Dashboard™ — Risk Rules
// Rule-based pattern matching only. No diagnosis or prescribing.

export const RISK_RULES = [
  {
    id: 'high_pain_score',
    label: 'High Pain Score',
    evaluate({ answers }) {
      const painQ = answers.find(a => a.questionId === 'q2');
      if (!painQ) return { triggered: false };
      const val = Number(painQ.answerValue);
      if (val >= 8) return {
        triggered: true,
        riskLevel: val >= 9 ? 'urgent_review' : 'high',
        reason: `Pain score ${val}/10 reported.`,
        evidence: `Q2 answer: ${val}`,
        recommendedActionLabel: 'Urgent clinical review may be required',
      };
      if (val >= 6) return {
        triggered: true,
        riskLevel: 'medium',
        reason: `Elevated pain score ${val}/10 reported.`,
        evidence: `Q2 answer: ${val}`,
        recommendedActionLabel: 'Review patient update',
      };
      return { triggered: false };
    },
  },

  {
    id: 'urgent_concern_selected',
    label: 'Urgent Concern Selected',
    evaluate({ answers }) {
      const urgentQ = answers.find(a => a.questionId === 'q5');
      if (!urgentQ || urgentQ.answerValue === 'none') return { triggered: false };
      return {
        triggered: true,
        riskLevel: 'urgent_review',
        reason: 'Patient selected an urgent concern symptom.',
        evidence: `Q5 answer: ${urgentQ.answerValue}`,
        recommendedActionLabel: 'Urgent clinical review may be required',
      };
    },
  },

  {
    id: 'worsening_symptoms',
    label: 'Worsening Symptoms',
    evaluate({ answers }) {
      const q3 = answers.find(a => a.questionId === 'q3');
      if (!q3) return { triggered: false };
      if (q3.answerValue === true || q3.answerValue === 'yes') {
        return {
          triggered: true,
          riskLevel: 'medium',
          reason: 'Patient reports existing symptoms have worsened.',
          evidence: 'Q3: Yes',
          recommendedActionLabel: 'Review worsening symptoms',
        };
      }
      return { triggered: false };
    },
  },

  {
    id: 'new_symptoms',
    label: 'New Symptoms',
    evaluate({ answers }) {
      const q4 = answers.find(a => a.questionId === 'q4');
      if (!q4) return { triggered: false };
      if (q4.answerValue === true || q4.answerValue === 'yes') {
        return {
          triggered: true,
          riskLevel: 'medium',
          reason: 'Patient reports new symptoms today.',
          evidence: 'Q4: Yes',
          recommendedActionLabel: 'Review patient update',
        };
      }
      return { triggered: false };
    },
  },

  {
    id: 'medication_not_taken',
    label: 'Medication Not Taken',
    evaluate({ answers }) {
      const q6 = answers.find(a => a.questionId === 'q6');
      if (!q6) return { triggered: false };
      if (q6.answerValue === false || q6.answerValue === 'no') {
        return {
          triggered: true,
          riskLevel: 'medium',
          reason: 'Patient did not take medication as instructed.',
          evidence: 'Q6: No',
          recommendedActionLabel: 'Check medication concern',
        };
      }
      return { triggered: false };
    },
  },

  {
    id: 'medication_side_effects',
    label: 'Medication Side Effects',
    evaluate({ answers }) {
      const q7 = answers.find(a => a.questionId === 'q7');
      if (!q7) return { triggered: false };
      if (q7.answerValue === true || q7.answerValue === 'yes') {
        return {
          triggered: true,
          riskLevel: 'medium',
          reason: 'Patient reports medication side effects or concerns.',
          evidence: 'Q7: Yes',
          recommendedActionLabel: 'Check medication concern',
        };
      }
      return { triggered: false };
    },
  },

  {
    id: 'poor_sleep',
    label: 'Poor Sleep',
    evaluate({ answers }) {
      const q8 = answers.find(a => a.questionId === 'q8');
      if (!q8) return { triggered: false };
      const val = Number(q8.answerValue);
      if (val <= 2) {
        return {
          triggered: true,
          riskLevel: 'medium',
          reason: 'Patient reports very poor sleep.',
          evidence: `Q8 answer: ${val}/5`,
          recommendedActionLabel: 'Review patient update',
        };
      }
      return { triggered: false };
    },
  },

  {
    id: 'poor_recovery_activities',
    label: 'Poor Eating / Drinking / Moving',
    evaluate({ answers }) {
      const q9 = answers.find(a => a.questionId === 'q9');
      if (!q9) return { triggered: false };
      if (q9.answerValue === 'none') {
        return {
          triggered: true,
          riskLevel: 'high',
          reason: 'Patient reports struggling with eating, drinking, and movement.',
          evidence: 'Q9: None',
          recommendedActionLabel: 'Contact patient if clinically appropriate',
        };
      }
      if (['eating_poor', 'drinking_poor', 'moving_poor'].includes(q9.answerValue)) {
        return {
          triggered: true,
          riskLevel: 'medium',
          reason: 'Patient reports reduced eating, drinking, or movement.',
          evidence: `Q9: ${q9.answerValue}`,
          recommendedActionLabel: 'Review patient update',
        };
      }
      return { triggered: false };
    },
  },

  {
    id: 'free_text_update',
    label: 'Free Text Update from Patient',
    evaluate({ answers }) {
      const q10 = answers.find(a => a.questionId === 'q10');
      if (!q10 || !q10.answerValue || q10.answerValue.trim().length < 5) return { triggered: false };
      return {
        triggered: true,
        riskLevel: 'low',
        reason: 'Patient has added a free-text note for the care team.',
        evidence: `Q10: "${q10.answerValue.slice(0, 80)}${q10.answerValue.length > 80 ? '…' : ''}"`,
        recommendedActionLabel: 'Review patient update',
      };
    },
  },

  {
    id: 'pain_trend_increasing',
    label: 'Pain Trend Increasing',
    evaluate({ patient, checkIn, answers, recentCheckIns }) {
      if (recentCheckIns.length < 2) return { triggered: false };
      const currentPain = answers.find(a => a.questionId === 'q2');
      if (!currentPain) return { triggered: false };
      const currentVal = Number(currentPain.answerValue);

      // Look at last 2 check-ins' q2 answers
      const sorted = [...recentCheckIns].sort((a, b) => new Date(a.date) - new Date(b.date));
      const painHistory = sorted.slice(-2).map(ci => {
        const ans = (ci.answers || []).find(a => a.questionId === 'q2');
        return ans ? Number(ans.answerValue) : null;
      }).filter(v => v !== null);

      if (painHistory.length >= 2 && painHistory.every((v, i) => i === 0 || v >= painHistory[i - 1]) && currentVal > painHistory[painHistory.length - 1]) {
        return {
          triggered: true,
          riskLevel: currentVal >= 7 ? 'high' : 'medium',
          reason: 'Pain score has increased over the last 2+ check-ins.',
          evidence: `Pain trend: ${[...painHistory, currentVal].join(' → ')}`,
          recommendedActionLabel: 'Review worsening symptoms',
        };
      }
      return { triggered: false };
    },
  },
];

export default RISK_RULES;
