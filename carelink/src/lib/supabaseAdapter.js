// 4P3X CareLink Dashboard™ — Supabase Adapter (disabled by default)
// Safe placeholder. Will not crash in local mode.
// Enable only after configuring Supabase with RLS, authentication, and data protection.

import { getSettings, updateSettings } from './carelinkDb.js';

export function isSupabaseConfigured() {
  const s = getSettings();
  return (
    s.backendMode === 'supabase' &&
    Boolean(s.supabaseUrl) &&
    Boolean(s.supabaseAnonKey)
  );
}

export function getBackendStatus() {
  const s = getSettings();
  return {
    mode:          s.backendMode || 'local',
    configured:    isSupabaseConfigured(),
    syncEnabled:   s.syncEnabled || false,
    lastSyncAt:    s.lastSyncAt || null,
    syncStatus:    s.syncStatus || 'idle',
    supabaseUrl:   s.supabaseUrl ? '[configured]' : '[not set]',
    keyConfigured: Boolean(s.supabaseAnonKey),
  };
}

export async function testSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: 'Supabase is not configured. Operating in local mode.' };
  }
  return { ok: false, message: 'Supabase client not yet installed. Add @supabase/supabase-js to package.json.' };
}

export async function connectSupabase(url, anonKey) {
  if (!url || !anonKey) {
    return { ok: false, message: 'Both supabaseUrl and supabaseAnonKey are required.' };
  }
  updateSettings({ supabaseUrl: url, supabaseAnonKey: anonKey, backendMode: 'supabase', syncStatus: 'ready' });
  return { ok: true, message: 'Supabase config saved. Test connection before enabling sync.' };
}

export async function syncLocalToSupabase() {
  if (!isSupabaseConfigured()) return { ok: false, message: 'Supabase not configured.' };
  return { ok: false, message: 'Sync not yet implemented. Install @supabase/supabase-js and implement sync logic.' };
}

export async function syncSupabaseToLocal() {
  if (!isSupabaseConfigured()) return { ok: false, message: 'Supabase not configured.' };
  return { ok: false, message: 'Sync not yet implemented.' };
}

export function setLocalMode() {
  updateSettings({ backendMode: 'local', syncEnabled: false, syncStatus: 'idle' });
  return { ok: true, message: 'Switched to local mode.' };
}
