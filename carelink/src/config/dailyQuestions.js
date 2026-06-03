// 4P3X CareLink Dashboard™ — Daily Check-In Questions Config
// Do NOT hardcode these inside UI components. Always import from here.

export const DAILY_QUESTIONS = [
  {
    id: 'q1',
    order: 1,
    questionText: 'How are you feeling today compared with yesterday?',
    answerType: 'scale',
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { 1: 'Much worse', 2: 'Worse', 3: 'Same', 4: 'Better', 5: 'Much better' },
    severityInvert: true, // lower = higher severity
  },
  {
    id: 'q2',
    order: 2,
    questionText: 'What is your current pain level from 0 to 10?',
    answerType: 'scale',
    scaleMin: 0,
    scaleMax: 10,
    scaleLabels: { 0: 'No pain', 5: 'Moderate', 10: 'Worst possible' },
    severityInvert: false,
  },
  {
    id: 'q3',
    order: 3,
    questionText: 'Have any symptoms become worse today?',
    answerType: 'yes_no',
    yesIsSevere: true,
  },
  {
    id: 'q4',
    order: 4,
    questionText: 'Have you noticed any new symptoms?',
    answerType: 'yes_no',
    yesIsSevere: true,
  },
  {
    id: 'q5',
    order: 5,
    questionText: 'Are you experiencing dizziness, breathlessness, chest pain, severe weakness, or anything that feels urgent?',
    answerType: 'urgent_concern',
    options: [
      { value: 'none', label: 'None of these', severity: 0 },
      { value: 'dizziness', label: 'Dizziness', severity: 3 },
      { value: 'breathlessness', label: 'Breathlessness', severity: 4 },
      { value: 'chest_pain', label: 'Chest pain', severity: 5 },
      { value: 'severe_weakness', label: 'Severe weakness', severity: 4 },
      { value: 'other_urgent', label: 'Something else that feels urgent', severity: 4 },
    ],
  },
  {
    id: 'q6',
    order: 6,
    questionText: 'Did you take your medication as instructed?',
    answerType: 'yes_no',
    yesIsSevere: false,
  },
  {
    id: 'q7',
    order: 7,
    questionText: 'Have you had any side effects or concerns with medication?',
    answerType: 'yes_no',
    yesIsSevere: true,
  },
  {
    id: 'q8',
    order: 8,
    questionText: 'How well did you sleep last night?',
    answerType: 'scale',
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { 1: 'Very poorly', 2: 'Poorly', 3: 'Okay', 4: 'Well', 5: 'Very well' },
    severityInvert: true,
  },
  {
    id: 'q9',
    order: 9,
    questionText: 'Are you eating, drinking, and moving as expected for your recovery?',
    answerType: 'status_selector',
    options: [
      { value: 'yes_all', label: 'Yes, all of these', severity: 0 },
      { value: 'mostly', label: 'Mostly yes', severity: 1 },
      { value: 'eating_poor', label: 'Eating poorly', severity: 2 },
      { value: 'drinking_poor', label: 'Drinking poorly', severity: 2 },
      { value: 'moving_poor', label: 'Moving less than expected', severity: 2 },
      { value: 'none', label: 'No — struggling with these', severity: 3 },
    ],
  },
  {
    id: 'q10',
    order: 10,
    questionText: 'Is there anything you want your doctor or care team to know today?',
    answerType: 'free_text',
    placeholder: 'Type anything you want to share with your care team…',
    severityScore: 0,
  },
];

export default DAILY_QUESTIONS;
