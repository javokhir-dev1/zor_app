import { MdLeaderboard, MdPeople, MdEmail, MdCheckCircle } from 'react-icons/md';
import { useState } from 'react';
import { adminApi } from '../../api/admin';

export default function MailingPage() {
  const [message, setMessage] = useState('');
  const [segment, setSegment] = useState('all');
  const [topLimit, setTopLimit] = useState(100);
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if(!message.trim()) return alert('Xabar matni kerak');
    if(!confirm(`Xabarni ${segment === 'all' ? 'barcha foydalanuvchilarga' : `top ${topLimit} ta foydalanuvchiga`} yuborishni tasdiqlaysizmi?`)) return;
    setSending(true);
    try {
      const r = await adminApi.sendMailing({ message, segment, top_limit: topLimit });
      setResult(r.data);
    } catch(e) { alert(e.response?.data?.error || 'Xatolik'); }
    finally { setSending(false); }
  };

  return (
    <div style={{ animation:'fadeIn 0.3s ease' }}>
      <h2 style={{ fontSize:'18px', fontWeight:'700', marginBottom:'16px' }}><MdEmail /> Mailing</h2>
      <div style={{ background:'var(--bg-card)', borderRadius:'var(--radius-md)', padding:'16px', border:'1px solid var(--border-glass)' }}>
        <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Xabar matni..." rows={5} style={{ width:'100%', padding:'10px', background:'var(--bg-primary)', border:'1px solid var(--border-glass)', borderRadius:'8px', color:'var(--text-primary)', fontSize:'14px', outline:'none', resize:'vertical', marginBottom:'12px' }} />
        <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
          <button onClick={()=>setSegment('all')} style={{ flex:1, padding:'10px', background: segment==='all' ? 'var(--accent)' : 'var(--bg-card)', border:'1px solid var(--border-glass)', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight: segment==='all' ? '600' : '400' }}><MdPeople /> Hammaga</button>
          <button onClick={()=>setSegment('top')} style={{ flex:1, padding:'10px', background: segment==='top' ? 'var(--accent)' : 'var(--bg-card)', border:'1px solid var(--border-glass)', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight: segment==='top' ? '600' : '400' }}><MdLeaderboard /> Top foydalanuvchilar</button>
        </div>
        {segment === 'top' && <input type="number" value={topLimit} onChange={e=>setTopLimit(parseInt(e.target.value)||100)} placeholder="Top nechta?" style={{ width:'100%', padding:'10px', background:'var(--bg-card)', border:'1px solid var(--border-glass)', borderRadius:'8px', color:'var(--text-primary)', fontSize:'14px', outline:'none', marginBottom:'12px' }} />}
        <button onClick={handleSend} disabled={sending} style={{ width:'100%', padding:'12px', background: sending ? 'var(--bg-card)' : 'var(--accent-gradient)', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'700', cursor: sending ? 'wait' : 'pointer', fontSize:'15px' }}>
          {sending ? '📤 Yuborilmoqda...' : '<MdEmail /> Yuborish'}
        </button>
        {result && (
          <div style={{ marginTop:'12px', padding:'12px', background:'rgba(0,184,148,0.15)', borderRadius:'8px', fontSize:'13px', color:'var(--success)' }}>
            <MdCheckCircle /> {result.total_recipients} ta foydalanuvchiga yuborish boshlandi ({result.segment})
          </div>
        )}
      </div>
    </div>
  );
}
