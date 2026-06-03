// 4P3X CareLink Dashboard™ — Medical Safety Text SSOT

export const SAFETY_TEXT = {
  patientNotice: `This app supports recovery tracking and communication with your care team. It does not diagnose conditions, replace medical advice, or provide emergency support. If you feel seriously unwell or believe you are having a medical emergency, contact emergency services or your healthcare provider immediately.`,

  clinicalNotice: `This dashboard is a monitoring and review support tool. It highlights submitted patient information and possible patterns for clinical review. It does not make diagnoses, prescribe treatment, replace clinical judgement, or guarantee medical accuracy.`,

  privacyNotice: `Patient information is sensitive. In local mode, data is stored on this device/browser. Use only on trusted devices. Supabase/cloud sync should only be enabled after authentication, access control, RLS policies, and data protection checks are configured.`,

  emergencyWarning: `If you or someone you know is experiencing a medical emergency, call 999 (UK), 911 (US), or your local emergency number immediately.`,

  disclaimerShort: `Support tool only. Not a substitute for clinical judgement.`,
};

export default SAFETY_TEXT;
