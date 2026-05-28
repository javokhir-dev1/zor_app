import { MdPerson, MdMovie, MdCheckCircle, MdCancel, MdEvent, MdPhoneIphone } from 'react-icons/md';
import { useState, useRef, useEffect } from 'react';
import { guardApi } from '../../api/admin';

export default function GuardPage() {
  const [qrCode, setQrCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleVerify = async () => {
    const code = qrCode.trim();
    if (!code) return;
    setLoading(true); setResult(null);
    try {
      const r = await guardApi.verifyQR(code);
      setResult({ success: true, data: r.data });
    } catch (e) {
      setResult({ success: false, error: e.response?.data?.error || 'Xatolik yuz berdi' });
    } finally { setLoading(false); setQrCode(''); inputRef.current?.focus(); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-primary)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ textAlign:'center', marginBottom:'32px' }}>
        <div style={{ fontSize:'64px', marginBottom:'12px' }}>📷</div>
        <h1 style={{ fontSize:'22px', fontWeight:'700', background:'var(--accent-gradient)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>QR Skaner</h1>
        <p style={{ color:'var(--text-muted)', fontSize:'14px', marginTop:'4px' }}>Chipta QR-kodini kiriting</p>
      </div>

      <div style={{ width:'100%', maxWidth:'400px' }}>
        <input ref={inputRef} value={qrCode} onChange={e=>setQrCode(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleVerify()} placeholder="QR-kod (UUID)..." style={{ width:'100%', padding:'14px 16px', background:'var(--bg-card)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', color:'var(--text-primary)', fontSize:'16px', outline:'none', textAlign:'center', marginBottom:'12px' }} />
        <button onClick={handleVerify} disabled={loading} style={{ width:'100%', padding:'14px', background:'var(--accent-gradient)', border:'none', borderRadius:'var(--radius-md)', color:'#fff', fontWeight:'700', fontSize:'16px', cursor: loading ? 'wait' : 'pointer' }}>
          {loading ? '⏳ Tekshirilmoqda...' : '🔍 Tekshirish'}
        </button>

        {result && (
          <div style={{ marginTop:'20px', padding:'20px', borderRadius:'var(--radius-md)', background: result.success ? 'rgba(0,184,148,0.12)' : 'rgba(225,112,85,0.12)', border: `1px solid ${result.success ? 'var(--success)' : 'var(--danger)'}`, animation:'scaleIn 0.3s ease' }}>
            {result.success ? (
              <>
                <div style={{ textAlign:'center', fontSize:'48px', marginBottom:'12px' }}><MdCheckCircle /></div>
                <h3 style={{ textAlign:'center', color:'var(--success)', marginBottom:'12px' }}>Kirish ruxsat etildi!</h3>
                <div style={{ fontSize:'14px' }}>
                  <div style={{ padding:'6px 0', borderBottom:'1px solid var(--border-glass)' }}><MdPerson /> <strong>{result.data.user?.full_name}</strong></div>
                  <div style={{ padding:'6px 0', borderBottom:'1px solid var(--border-glass)' }}><MdPhoneIphone /> {result.data.user?.phone}</div>
                  <div style={{ padding:'6px 0', borderBottom:'1px solid var(--border-glass)' }}><MdMovie /> {result.data.show?.title}</div>
                  <div style={{ padding:'6px 0' }}><MdEvent /> {result.data.show?.show_date && new Date(result.data.show.show_date).toLocaleString('uz')}</div>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign:'center', fontSize:'48px', marginBottom:'12px' }}><MdCancel /></div>
                <h3 style={{ textAlign:'center', color:'var(--danger)', marginBottom:'4px' }}>Kirish rad etildi</h3>
                <p style={{ textAlign:'center', color:'var(--text-secondary)', fontSize:'14px' }}>{result.error}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
