// 4P3X CareLink Dashboard™ — Supabase Schema Plan
// Reference only — not executed in the app.
// When implementing Supabase:
//   1. RLS must be enabled on all tables.
//   2. Tables must be created before policies.
//   3. Functions must be created before triggers.
//   4. Indexes must be created after tables.
//   5. Policies must be created after RLS is enabled.
//   6. Patients must only access their own records.
//   7. Clinicians/care team members must only access assigned patients.
//   8. Service role keys must NEVER be exposed to frontend code.

export const SUPABASE_TABLES = [
  'clinicians', 'care_team_members', 'patients', 'clinician_patients',
  'daily_questions', 'check_ins', 'check_in_answers', 'symptom_reports',
  'recovery_updates', 'medication_notes', 'risk_flags', 'care_team_notes',
  'reports', 'sync_queue', 'app_settings',
];

export const SAMPLE_RLS_NOTES = `
-- patients table
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients see own records" ON patients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Clinicians see assigned patients" ON patients FOR SELECT USING (
  EXISTS (SELECT 1 FROM clinician_patients WHERE clinician_id = auth.uid() AND patient_id = patients.id)
);
`;

export default SUPABASE_TABLES;
