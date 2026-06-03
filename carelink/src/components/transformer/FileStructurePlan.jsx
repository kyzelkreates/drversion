// 4P3X — FileStructurePlan — RUN 4
import React, { useState } from 'react';

export default function FileStructurePlan({ fileStructurePlan }) {
  const [showAll, setShowAll] = useState(false);
  if (!fileStructurePlan) return <div style={styles.empty}>No file structure plan generated yet.</div>;

  const { folders = [], files = [] } = fileStructurePlan;
  const doNotTouch = files.filter(f => f.doNotTouch);
  const canCreate  = files.filter(f => f.allowedToCreate);
  const canModify  = files.filter(f => f.allowedToModify && !f.doNotTouch);
  const display    = showAll ? files : files.slice(0, 12);

  return (
    <div style={styles.wrap}>
      <h4 style={styles.heading}>📁 File & Folder Structure Plan</h4>
      <p style={styles.note}>Plan only — no files are created. Protected files are marked do-not-touch.</p>

      <div style={styles.stats}>
        <span style={styles.statChip}>📂 {folders.length} folders</span>
        <span style={styles.statChip}>📄 {files.length} files</span>
        <span style={{ ...styles.statChip, color: '#22c55e' }}>✅ {canCreate.length} create</span>
        <span style={{ ...styles.statChip, color: '#60a5fa' }}>✏️ {canModify.length} modify</span>
        <span style={{ ...styles.statChip, color: '#f59e0b' }}>🔒 {doNotTouch.length} protected</span>
      </div>

      <div style={styles.section}>
        <strong style={styles.sectionLabel}>Planned Folders</strong>
        <div style={styles.folderList}>
          {folders.map((f, i) => <span key={i} style={styles.folder}>{f}</span>)}
        </div>
      </div>

      <div style={styles.section}>
        <strong style={styles.sectionLabel}>Planned Files</strong>
        <div style={styles.fileList}>
          {display.map((f, i) => {
            const color = f.doNotTouch ? '#f59e0b' : f.allowedToCreate ? '#22c55e' : '#60a5fa';
            const label = f.doNotTouch ? '🔒 PROTECTED' : f.allowedToCreate ? '✅ CREATE' : '✏️ MODIFY';
            return (
              <div key={i} style={{ ...styles.fileRow, borderLeft: `3px solid ${color}` }}>
                <div style={styles.filePath}>{f.path}</div>
                <div style={styles.fileMeta}>
                  <span style={{ color }}>{label}</span>
                  <span style={styles.run}>Run: {f.runToBuild}</span>
                </div>
                <div style={styles.filePurpose}>{f.purpose}</div>
              </div>
            );
          })}
        </div>
        {files.length > 12 && (
          <button onClick={() => setShowAll(v => !v)} style={styles.showBtn}>
            {showAll ? `▲ Show fewer` : `▼ Show all ${files.length} files`}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap:         { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading:      { color: '#d4a843', fontSize: 15, fontWeight: 700, margin: '0 0 6px' },
  note:         { color: '#9ca3af', fontSize: 12, margin: '0 0 14px' },
  empty:        { color: '#6b7280', fontSize: 13, padding: 16 },
  stats:        { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  statChip:     { background: '#1a1a1a', borderRadius: 10, padding: '3px 10px', fontSize: 12, color: '#9ca3af' },
  section:      { marginBottom: 16 },
  sectionLabel: { color: '#9ca3af', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 },
  folderList:   { display: 'flex', flexWrap: 'wrap', gap: 6 },
  folder:       { background: '#1a1a1a', color: '#60a5fa', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontFamily: 'monospace' },
  fileList:     { display: 'flex', flexDirection: 'column', gap: 6 },
  fileRow:      { background: '#1a1a1a', borderRadius: 6, padding: '8px 12px' },
  filePath:     { color: '#e5e7eb', fontSize: 12, fontFamily: 'monospace', marginBottom: 4 },
  fileMeta:     { display: 'flex', gap: 10, marginBottom: 4 },
  run:          { color: '#6b7280', fontSize: 11 },
  filePurpose:  { color: '#9ca3af', fontSize: 11 },
  showBtn:      { background: '#222', color: '#9ca3af', border: '1px solid #333', borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer', marginTop: 8 },
};
