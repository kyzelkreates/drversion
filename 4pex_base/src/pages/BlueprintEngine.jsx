// 4P3X Blueprint Engine — RUN 2

import React, { useState, useEffect } from 'react';
import {
  getState, subscribe,
  createBlueprintFromPreset, deleteBlueprint, duplicateBlueprint,
  setActiveBlueprint, exportBlueprint, importBlueprint,
} from '../state/storage.js';
import blueprintPresets from '../config/blueprintPresets.js';
import BlueprintCard from '../components/blueprints/BlueprintCard.jsx';
import { safeStringifyJson } from '../utils/safeJson.js';

export function BlueprintEngine({ onNavigate }) {
  const [appState, setAppState]     = useState(() => getState());
  const [selectedPreset, setSelectedPreset] = useState('learningPlatform');
  const [message, setMessage]       = useState(null);
  const [importJson, setImportJson] = useState('');
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [exportJson, setExportJson] = useState('');
  const [exportBpId, setExportBpId] = useState(null);

  useEffect(() => {
    const unsub = subscribe((s) => setAppState({ ...s }));
    return unsub;
  }, []);

  const items   = appState.blueprints?.items || [];
  const activeId = appState.blueprints?.activeBlueprintId;

  function flash(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  }

  function handleCreate() {
    const result = createBlueprintFromPreset(selectedPreset);
    if (result.ok) {
      flash('success', `Blueprint created: "${result.blueprint.name}"`);
      setExportJson('');
    } else {
      flash('error', result.error);
    }
  }

  function handleSelect(id) {
    setActiveBlueprint(id);
    flash('success', 'Active blueprint updated.');
  }

  function handleEdit(id) {
    setActiveBlueprint(id);
    onNavigate('/blueprint-detail');
  }

  function handleDuplicate(id) {
    const result = duplicateBlueprint(id);
    result.ok ? flash('success', 'Blueprint duplicated.') : flash('error', result.error);
  }

  function handleDeleteRequest(id) {
    setDeleteTarget(id);
  }

  function handleDeleteConfirm() {
    const result = deleteBlueprint(deleteTarget);
    setDeleteTarget(null);
    result.ok ? flash('success', 'Blueprint deleted.') : flash('error', result.error);
  }

  function handleExport(id) {
    const result = exportBlueprint(id);
    if (result.ok) {
      setExportJson(result.json);
      setExportBpId(id);
      flash('success', 'Blueprint exported. Raw API keys are masked.');
    } else {
      flash('error', result.error);
    }
  }

  function handleImport() {
    if (!importJson.trim()) { flash('error', 'Import field is empty.'); return; }
    const result = importBlueprint(importJson);
    if (result.ok) {
      flash('success', `Blueprint imported: "${result.blueprint.name}"`);
      setImportJson('');
    } else {
      flash('error', result.error);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Product Blueprint Engine</div>
        <div className="page-subtitle">
          Define what this reusable base should become. Blueprints are plans — no product variants are built here.
        </div>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        <strong>RUN 2 — Blueprint Engine:</strong> Create, edit, validate, and export product blueprints.
        This does NOT build the final products. Product features are built in future runs.
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 14 }}>
          {message.text}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="alert alert-warn" style={{ marginBottom: 14 }}>
          <strong>Delete blueprint?</strong> This cannot be undone.{' '}
          <button className="btn btn-danger btn-sm" style={{ marginLeft: 8 }} onClick={handleDeleteConfirm}>Confirm Delete</button>{' '}
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 6 }} onClick={() => setDeleteTarget(null)}>Cancel</button>
        </div>
      )}

      {/* Create */}
      <div className="card card-gold" style={{ marginBottom: 20 }}>
        <div className="section-header">Create Blueprint from Preset</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="form-label">Select Preset</label>
            <select className="form-input" value={selectedPreset} onChange={(e) => setSelectedPreset(e.target.value)}>
              {blueprintPresets.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            Create Blueprint
          </button>
        </div>
      </div>

      {/* Blueprint list */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-header">
          Blueprints ({items.length})
          {items.length > 0 && (
            <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>
              Active: {activeId ? (items.find((b) => b.id === activeId)?.name || 'none') : 'none'}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>No blueprints yet</div>
            <div style={{ fontSize: 12 }}>Select a preset above and click Create Blueprint to get started.</div>
          </div>
        ) : (
          <div className="grid-2">
            {items.map((bp) => (
              <div key={bp.id}>
                <BlueprintCard
                  blueprint={bp}
                  isActive={bp.id === activeId}
                  onSelect={handleSelect}
                  onEdit={handleEdit}
                />
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDuplicate(bp.id)}>Duplicate</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleExport(bp.id)}>Export</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRequest(bp.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export result */}
      {exportJson && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-header">Exported Blueprint JSON (raw API keys masked)</div>
          <textarea
            className="form-textarea"
            value={exportJson}
            readOnly
            rows={8}
            onClick={(e) => e.target.select()}
          />
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => { setExportJson(''); setExportBpId(null); }}>
            Clear
          </button>
        </div>
      )}

      {/* Import */}
      <div className="card">
        <div className="section-header">Import Blueprint</div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
          Paste a valid 4P3X blueprint JSON. Invalid or forbidden-key blueprints are rejected.
        </p>
        <textarea
          className="form-textarea"
          placeholder='{"name": "My Product", "productType": "lms", …}'
          value={importJson}
          rows={5}
          onChange={(e) => setImportJson(e.target.value)}
        />
        <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={handleImport}>
          Import Blueprint
        </button>
      </div>
    </div>
  );
}

export default BlueprintEngine;
