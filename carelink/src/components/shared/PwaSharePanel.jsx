// 4P3X CareLink Dashboard™ — PWA Install + Share Panel
// Handles: Install prompt, WhatsApp, SMS/iMessage, NFC, Bluetooth, WiFi Direct, Telegram, QR Code

import React, { useState, useEffect, useRef } from 'react';

const APP_URL = typeof window !== 'undefined' ? window.location.origin : 'https://your-app.vercel.app';
const APP_NAME = '4P3X CareLink';
const SHARE_MSG = `Join me on ${APP_NAME} — your recovery tracking app. Open it here: ${APP_URL}`;

// ─── QR Code generator (pure JS, no library needed) ──────────────────
// Uses Google Charts API as a safe CDN fallback
function QRImage({ url, size = 200 }) {
  const encoded = encodeURIComponent(url);
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=0a0a0a&color=f5c842&margin=2`;
  return (
    <img
      src={src}
      alt="QR Code"
      width={size}
      height={size}
      style={{ borderRadius: '12px', border: '2px solid rgba(245,200,66,0.4)', display: 'block' }}
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  );
}

// ─── Share channel definitions ────────────────────────────────────────
function getShareChannels(url, msg) {
  return [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      emoji: '💬',
      color: '#25D366',
      available: true,
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank'),
    },
    {
      id: 'telegram',
      label: 'Telegram',
      emoji: '✈️',
      color: '#2AABEE',
      available: true,
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(APP_NAME + ' — Recovery Tracking App')}`, '_blank'),
    },
    {
      id: 'sms',
      label: 'SMS / iMessage',
      emoji: '📱',
      color: '#34C759',
      available: true,
      action: () => window.open(`sms:?&body=${encodeURIComponent(msg)}`, '_self'),
    },
    {
      id: 'nfc',
      label: 'NFC Tap',
      emoji: '📡',
      color: '#f5c842',
      available: 'NDEFWriter' in window || 'NDEFReader' in window,
      action: null, // handled separately
      special: 'nfc',
    },
    {
      id: 'bluetooth',
      label: 'Bluetooth',
      emoji: '🔵',
      color: '#007AFF',
      available: 'bluetooth' in navigator,
      action: null,
      special: 'bluetooth',
    },
    {
      id: 'wifidirect',
      label: 'WiFi Direct',
      emoji: '📶',
      color: '#b060ff',
      available: true,
      action: null,
      special: 'wifidirect',
    },
    {
      id: 'copy',
      label: 'Copy Link',
      emoji: '🔗',
      color: '#a0a0a0',
      available: true,
      action: null,
      special: 'copy',
    },
  ];
}

// ─── NFC Share ────────────────────────────────────────────────────────
async function shareViaNfc(url, setStatus) {
  if (!('NDEFReader' in window)) {
    setStatus({ id: 'nfc', msg: 'NFC not supported on this device/browser. Try Chrome on Android.', ok: false });
    return;
  }
  try {
    setStatus({ id: 'nfc', msg: '📡 Tap another NFC-enabled device now…', ok: null });
    const writer = new window.NDEFReader();
    await writer.write({ records: [{ recordType: 'url', data: url }] });
    setStatus({ id: 'nfc', msg: '✓ NFC tag written — tap to share!', ok: true });
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      setStatus({ id: 'nfc', msg: 'NFC permission denied. Enable NFC in device settings.', ok: false });
    } else {
      setStatus({ id: 'nfc', msg: `NFC error: ${err.message}`, ok: false });
    }
  }
}

// ─── Bluetooth Share ──────────────────────────────────────────────────
async function shareViaBluetooth(url, setStatus) {
  if (!('bluetooth' in navigator)) {
    setStatus({ id: 'bluetooth', msg: 'Web Bluetooth not supported. Use Chrome on Android/desktop.', ok: false });
    return;
  }
  try {
    setStatus({ id: 'bluetooth', msg: '🔵 Scanning for Bluetooth devices…', ok: null });
    // Web Bluetooth can't directly "send a URL" — we open the native share sheet which may use BT
    // Best available: use Web Share API with bluetooth fallback hint
    if (navigator.share) {
      await navigator.share({ title: APP_NAME, text: SHARE_MSG, url });
      setStatus({ id: 'bluetooth', msg: '✓ Share sheet opened — choose Bluetooth from the list.', ok: true });
    } else {
      setStatus({ id: 'bluetooth', msg: 'Open your device Bluetooth settings and use "Send via Bluetooth". Link copied to clipboard.', ok: false });
      await navigator.clipboard.writeText(url).catch(() => {});
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      setStatus({ id: 'bluetooth', msg: `Bluetooth share: ${err.message}`, ok: false });
    } else {
      setStatus({ id: 'bluetooth', msg: '', ok: null });
    }
  }
}

// ─── WiFi Direct ──────────────────────────────────────────────────────
function shareViaWifiDirect(url, setStatus) {
  // Web API doesn't expose WiFi Direct directly — best UX: open native share sheet
  if (navigator.share) {
    navigator.share({ title: APP_NAME, text: SHARE_MSG, url })
      .then(() => setStatus({ id: 'wifidirect', msg: '✓ Share sheet opened — choose Nearby Share / WiFi Direct.', ok: true }))
      .catch((e) => {
        if (e.name !== 'AbortError') setStatus({ id: 'wifidirect', msg: 'Native share not available. Use QR code instead.', ok: false });
      });
  } else {
    setStatus({ id: 'wifidirect', msg: 'WiFi Direct sharing uses Android "Nearby Share". Open your device sharing menu and share: ' + url, ok: false });
  }
}

// ─── Copy Link ────────────────────────────────────────────────────────
async function copyLink(url, setStatus) {
  try {
    await navigator.clipboard.writeText(url);
    setStatus({ id: 'copy', msg: '✓ Link copied!', ok: true });
    setTimeout(() => setStatus({ id: '', msg: '', ok: null }), 2500);
  } catch {
    setStatus({ id: 'copy', msg: 'Could not copy — select manually: ' + url, ok: false });
  }
}

// ─── PWA Install Button ───────────────────────────────────────────────
function InstallButton() {
  const [prompt, setPrompt]       = useState(null);
  const [installed, setInstalled] = useState(false);
  const [status, setStatus]       = useState('');

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);

    // Detect if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true);
    window.addEventListener('appinstalled', () => { setInstalled(true); setPrompt(null); });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      setStatus('✓ Installing…');
      setPrompt(null);
    }
  }

  if (installed) {
    return (
      <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '20px' }}>✅</span>
        <div>
          <p style={{ color: 'var(--green-bright)', fontWeight: 700, margin: 0, fontSize: '14px' }}>App Installed</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>4P3X CareLink is installed on this device</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      {prompt ? (
        <button onClick={handleInstall} style={{
          width: '100%', padding: '16px', borderRadius: '14px', border: '2px solid var(--border-gold)',
          background: 'linear-gradient(135deg, rgba(245,200,66,0.15), rgba(245,200,66,0.05))',
          color: 'var(--gold-bright)', fontWeight: 800, fontSize: '15px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '22px' }}>📲</span>
          Install Patient Recovery App
          <span style={{ fontSize: '11px', fontWeight: 500, opacity: 0.7 }}>Add to Home Screen</span>
        </button>
      ) : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px 18px' }}>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600, margin: '0 0 6px', fontSize: '14px' }}>📲 Install on This Device</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>
            On <strong style={{ color: 'var(--text-secondary)' }}>Android/Chrome</strong>: tap the menu (⋮) → "Add to Home Screen"
            <br />On <strong style={{ color: 'var(--text-secondary)' }}>iPhone/Safari</strong>: tap Share (⬆️) → "Add to Home Screen"
            <br />On <strong style={{ color: 'var(--text-secondary)' }}>Desktop</strong>: click the install icon (⊕) in the address bar
          </p>
          {status && <p style={{ color: 'var(--green-mid)', fontSize: '12px', marginTop: '8px' }}>{status}</p>}
        </div>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────
export function PwaSharePanel({ onClose }) {
  const [actionStatus, setActionStatus] = useState({ id: '', msg: '', ok: null });
  const [showQr, setShowQr]             = useState(false);
  const url = APP_URL;
  const channels = getShareChannels(url, SHARE_MSG);

  function handleChannel(ch) {
    if (ch.action) { ch.action(); return; }
    switch (ch.special) {
      case 'nfc':       shareViaNfc(url, setActionStatus); break;
      case 'bluetooth': shareViaBluetooth(url, setActionStatus); break;
      case 'wifidirect': shareViaWifiDirect(url, setActionStatus); break;
      case 'copy':      copyLink(url, setActionStatus); break;
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: '0 0 0 0',
    }}>
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: '24px 24px 0 0',
        width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto',
        padding: '24px 20px 40px', border: '1px solid var(--border-card)',
        borderBottom: 'none',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ color: 'var(--gold-bright)', fontSize: '17px', fontWeight: 800, margin: 0 }}>Install & Share</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '2px 0 0' }}>4P3X CareLink — Patient Recovery App</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '50%', width: '32px', height: '32px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Install button */}
        <InstallButton />

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-card)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>SHARE WITH PATIENTS</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-card)' }} />
        </div>

        {/* Share grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {channels.filter(c => c.id !== 'copy').map(ch => (
            <button
              key={ch.id}
              onClick={() => handleChannel(ch)}
              title={ch.available === false ? 'Not available on this device' : ch.label}
              style={{
                background: actionStatus.id === ch.id && actionStatus.ok === null && actionStatus.msg
                  ? 'rgba(245,200,66,0.1)'
                  : 'var(--bg-card)',
                border: `1px solid ${actionStatus.id === ch.id ? ch.color + '66' : 'var(--border-card)'}`,
                borderRadius: '14px', padding: '12px 6px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                cursor: ch.available === false ? 'not-allowed' : 'pointer',
                opacity: ch.available === false ? 0.4 : 1,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '24px' }}>{ch.emoji}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '10px', fontWeight: 600, textAlign: 'center', lineHeight: '1.2' }}>{ch.label}</span>
            </button>
          ))}

          {/* QR Code toggle */}
          <button
            onClick={() => setShowQr(v => !v)}
            style={{
              background: showQr ? 'rgba(245,200,66,0.1)' : 'var(--bg-card)',
              border: `1px solid ${showQr ? 'var(--border-gold)' : 'var(--border-card)'}`,
              borderRadius: '14px', padding: '12px 6px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '24px' }}>🔲</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '10px', fontWeight: 600, textAlign: 'center', lineHeight: '1.2' }}>QR Code</span>
          </button>
        </div>

        {/* Copy link */}
        <button
          onClick={() => copyLink(url, setActionStatus)}
          style={{
            width: '100%', padding: '11px', borderRadius: '10px',
            background: 'var(--bg-card)', border: '1px solid var(--border-card)',
            color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '14px',
          }}
        >
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>
            {url}
          </span>
          <span style={{ color: actionStatus.id === 'copy' && actionStatus.ok ? 'var(--green-bright)' : 'var(--gold-bright)', fontWeight: 700, fontSize: '11px', marginLeft: '8px', flexShrink: 0 }}>
            {actionStatus.id === 'copy' && actionStatus.ok ? '✓ Copied!' : 'Copy'}
          </span>
        </button>

        {/* Status message */}
        {actionStatus.msg && (
          <div style={{
            background: actionStatus.ok === false ? 'rgba(255,68,85,0.08)' : actionStatus.ok === true ? 'rgba(0,255,136,0.08)' : 'rgba(245,200,66,0.08)',
            border: `1px solid ${actionStatus.ok === false ? 'rgba(255,68,85,0.3)' : actionStatus.ok === true ? 'rgba(0,255,136,0.3)' : 'var(--border-gold)'}`,
            borderRadius: '10px', padding: '10px 14px', marginBottom: '14px',
          }}>
            <p style={{ color: actionStatus.ok === false ? '#ff4455' : actionStatus.ok === true ? 'var(--green-bright)' : 'var(--gold-bright)', fontSize: '12px', margin: 0 }}>
              {actionStatus.msg}
            </p>
          </div>
        )}

        {/* QR Code panel */}
        {showQr && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, margin: 0 }}>Scan to open on any device</p>
            <QRImage url={url} size={180} />
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0, textAlign: 'center' }}>
              Point a phone camera at this code to open the app — no app store needed
            </p>
          </div>
        )}

        {/* Footer note */}
        <p style={{ color: 'var(--text-muted)', fontSize: '10px', textAlign: 'center', marginTop: '16px', lineHeight: '1.5' }}>
          Patients can install this as a home screen app on any device — no app store required.
          <br />Works offline after first load.
        </p>
      </div>
    </div>
  );
}

export default PwaSharePanel;
