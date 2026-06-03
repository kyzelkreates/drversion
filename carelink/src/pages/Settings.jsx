// 4P3X Settings page — RUN 1

import React, { useState, useEffect } from 'react';
import { getState, subscribe, exportState, importState, resetState } from '../state/storage.js';
import { getApiConfigGuardStatus } from '../config/apiConfig.js';
import appConfig from '../config/appConfig.js';
import { safeStringifyJson } from '../utils/safeJson.js';
import { formatDisplay } from '../utils/date.js';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';

export function Settings() {
  const [appState, setAppState] = useState(() => getState());
  const [exportJson, setExportJson] = useState('');
  const [importJson, setImportJson] = useState('');
  const [message, setMessage] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const unsub = subscribe((s) => setAppState({ ...s }));
    return unsub;
  }, []);

  const guardStatus = getApiConfigGuardStatus();

  function handleExport() {
    const safe = exportState();
    const { ok, value, error } = safeStringifyJson(safe, 2);
    if (ok) {
      setExportJson(value);
      setMessage({ type: 'success', text: 'State exported. Raw API keys are masked.' });
    } else {
      setMessage({ type: 'error', text: error });
    }
  }

  function handleImport() {
    if (!importJson.trim()) {
      setMessage({ type: 'error', text: 'Import field is empty.' });
      return;
    }
    const result = importState(importJson);
    if (result.ok) {
      setMessage({ type: 'success', text: 'State imported successfully.' });
      setImportJson('');
    } else {
      setMessage({ type: 'error', text: 'Import failed: ' + result.error });
    }
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      setMessage({ type: 'warn', text: 'Click Reset again to confirm. This will wipe all local state and restore defaults.' });
      return;
    }
    resetState();
    setConfirmReset(false);
    setExportJson('');
    setImportJson('');
    setMessage({ type: 'success', text: 'State reset to initial defaults.' });
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Settings</div>
        <div className="page-subtitle">
          App identity, local-first status, API guard, and state management tools.
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : message.type === 'warn' ? 'warn' : 'error'}`}
          style={{ marginBottom: 16 }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* App Identity */}
        <Card>
          <div className="card-title">App Identity</div>
          {[
            ['Name',       appConfig.name],
            ['Tagline',    appConfig.tagline],
            ['Powered By', appConfig.poweredBy],
            ['Created By', appConfig.createdBy],
            ['Ecosystem',  appConfig.ecosystem],
            ['Version',    appState.app?.version],
            ['Build Mode', appConfig.buildMode],
            ['Status',     appConfig.productStatus],
            ['Run',        `Run ${appConfig.run}`],
          ].map(([k, v]) => (
            <div key={k} className="row-between" style={{ padding: '5px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-word' }}>{v}</span>
            </div>
          ))}
        </Card>

        {/* System status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card variant="green">
            <div className="card-title">Local-First Status</div>
            <div className="row-between" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Mode</span>
              <Badge variant="active">local-first</Badge>
            </div>
            <div className="row-between" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Storage key</span>
              <code style={{ fontSize: 11, color: 'var(--text-muted)' }}>4p3x_reusable_base_state_v1</code>
            </div>
            <div className="row-between">
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Last updated</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDisplay(appState.audit?.updatedAt)}</span>
            </div>
          </Card>

          <Card>
            <div className="card-title">API Config Guard™</div>
            <div className="row-between" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Guard Active</span>
              <Badge variant={guardStatus.guardActive ? 'active' : 'error'}>
                {guardStatus.guardActive ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="row-between" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Backend Required</span>
              <Badge variant="neutral">{guardStatus.backendRequired ? 'Yes' : 'No'}</Badge>
            </div>
            <div className="row-between">
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Supabase</span>
              <Badge variant="neutral">Not connected</Badge>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
              {guardStatus.note}
            </div>
          </Card>
        </div>
      </div>

      {/* Export */}
      <Card style={{ marginBottom: 16 }}>
        <div className="section-header">Export State</div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
          Export current local state as JSON. Raw API keys are automatically masked — they will not appear in the export.
        </p>
        <button className="btn btn-secondary btn-sm" onClick={handleExport} style={{ marginBottom: 12 }}>
          Export State
        </button>
        {exportJson && (
          <textarea
            className="form-textarea"
            value={exportJson}
            readOnly
            rows={10}
            onClick={(e) => e.target.select()}
          />
        )}
      </Card>

      {/* Import */}
      <Card style={{ marginBottom: 16 }}>
        <div className="section-header">Import State</div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
          Paste a valid 4P3X state JSON below. Invalid, malformed, or forbidden-key state will be rejected.
        </p>
        <textarea
          className="form-textarea"
          placeholder='{"app": {"name": "…"}, …}'
          value={importJson}
          rows={6}
          onChange={(e) => setImportJson(e.target.value)}
        />
        <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={handleImport}>
          Import State
        </button>
      </Card>

      {/* Reset */}
      <Card>
        <div className="section-header">Reset Local State</div>
        <div className="alert alert-warn" style={{ marginBottom: 12 }}>
          Resetting will erase all saved preferences, variant selections, AI config, and module state.
          This cannot be undone without a valid export backup.
        </div>
        <button
          className={`btn btn-danger btn-sm`}
          onClick={handleReset}
        >
          {confirmReset ? '⚠ Confirm Reset' : 'Reset State'}
        </button>
        {confirmReset && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: 10 }}
            onClick={() => { setConfirmReset(false); setMessage(null); }}
          >
            Cancel
          </button>
        )}
      </Card>
    </div>
  );
}

export default Settings;
