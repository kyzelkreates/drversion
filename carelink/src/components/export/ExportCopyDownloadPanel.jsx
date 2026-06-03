import React, { useState } from 'react';
import { Card } from '../ui/Card.jsx';
import { downloadExportPackJson, downloadExportPackText, copyExportPackText, exportPackToText } from '../../utils/exportPackExport.js';

export function ExportCopyDownloadPanel({ exportPack, state }) {
  const [copied, setCopied] = useState(false);

  if (!exportPack) return null;

  function handleCopyText() {
    const text = exportPackToText(exportPack, state);
    copyExportPackText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }

  return (
    <Card variant="default">
      <div className="card-title">Export / Copy / Download</div>
      <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 10 }}>
        All exports are sanitised. Raw API keys and backend secrets are never included.
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-sm" onClick={() => downloadExportPackJson(exportPack)}>
          ⬇ Download JSON
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => downloadExportPackText(exportPack, state)}>
          ⬇ Download Text
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleCopyText}>
          {copied ? '✓ Copied' : '📋 Copy Text'}
        </button>
      </div>
    </Card>
  );
}
export default ExportCopyDownloadPanel;
