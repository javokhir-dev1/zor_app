import { MdEmail, MdPeople, MdLeaderboard, MdCheckCircle, MdSend, MdGroup } from 'react-icons/md';
import { useState } from 'react';
import { adminApi } from '../../api/admin';

const fadeIn = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default function MailingPage() {
  const [message, setMessage] = useState('');
  const [segment, setSegment] = useState('all');
  const [topLimit, setTopLimit] = useState(100);
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return alert('Xabar matni kerak');
    if (!confirm(`Xabarni ${segment === 'all' ? 'barcha foydalanuvchilarga' : `top ${topLimit} ta foydalanuvchiga`} yuborishni tasdiqlaysizmi?`)) return;
    setSending(true);
    try {
      const r = await adminApi.sendMailing({ message, segment, top_limit: topLimit });
      setResult(r.data);
    } catch (e) { alert(e.response?.data?.error || 'Xatolik'); }
    finally { setSending(false); }
  };

  const segments = [
    { key: 'all', label: 'Barcha', icon: MdPeople, color: '#4fc3f7' },
    { key: 'top', label: 'Top foydalanuvchilar', icon: MdLeaderboard, color: '#ffc107' }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <style>{fadeIn}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #66bb6a, #2e7d32)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(102,187,106,0.3)'
        }}>
          <MdEmail size={26} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>Mailing</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0 0' }}>
            Foydalanuvchilarga xabar yuborish
          </p>
        </div>
      </div>

      {/* Main card */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        padding: '24px',
        animation: 'slideUp 0.3s ease 0.05s both'
      }}>

        {/* Message textarea */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', display: 'block' }}>
            Xabar matni
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Xabar matnini kiriting..."
            rows={5}
            style={{
              width: '100%', padding: '14px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none',
              resize: 'vertical', lineHeight: '1.6',
              fontFamily: 'inherit', boxSizing: 'border-box'
            }}
          />
          <div style={{ textAlign: 'right', marginTop: '6px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{message.length} belgi</span>
          </div>
        </div>

        {/* Segment selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginBottom: '10px', display: 'block' }}>
            Qabul qiluvchilar
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {segments.map(s => {
              const active = segment === s.key;
              const IconComp = s.icon;
              return (
                <button
                  key={s.key}
                  onClick={() => setSegment(s.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px',
                    background: active ? `${s.color}20` : 'transparent',
                    border: `1px solid ${active ? `${s.color}35` : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px',
                    color: active ? s.color : 'rgba(255,255,255,0.5)',
                    fontWeight: active ? '700' : '500', fontSize: '13px',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  <IconComp size={18} /> {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Top limit input (shown when segment = top) */}
        {segment === 'top' && (
          <div style={{
            marginBottom: '20px', padding: '16px',
            background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.12)',
            borderRadius: '14px',
            animation: 'slideUp 0.2s ease both'
          }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#ffc107', marginBottom: '8px', display: 'block' }}>
              Top nechta foydalanuvchi?
            </label>
            <input
              type="number"
              value={topLimit}
              onChange={e => setTopLimit(parseInt(e.target.value) || 0)}
              min={1}
              style={{
                width: '120px', padding: '10px 14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none'
              }}
            />
          </div>
        )}

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={sending}
          style={{
            width: '100%', padding: '14px',
            background: sending ? 'rgba(255,255,255,0.08)' : 'var(--accent-gradient)',
            border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700',
            fontSize: '15px', cursor: sending ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: sending ? 'none' : '0 4px 16px rgba(79,195,247,0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          {sending ? (
            <>
              <span style={{
                width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', display: 'inline-block'
              }} />
              Yuborilmoqda...
            </>
          ) : (
            <>
              <MdSend size={20} /> Xabarni yuborish
            </>
          )}
        </button>
      </div>

      {/* Result card */}
      {result && (
        <div style={{
          marginTop: '20px',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          padding: '24px',
          animation: 'slideUp 0.3s ease both'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(76,175,80,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <MdCheckCircle size={22} color="#4caf50" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#fff' }}>Natija</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '3px 0 0 0' }}>Xabar muvaffaqiyatli yuborildi</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {[
              { label: 'Yuborildi', value: result.sent ?? '—', color: '#4caf50', icon: MdCheckCircle },
              { label: 'Muvaffaqiyatsiz', value: result.failed ?? '0', color: '#f44336', icon: MdEmail },
              { label: 'Jami', value: result.total ?? '—', color: '#4fc3f7', icon: MdGroup }
            ].map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div key={i} style={{
                  padding: '16px', borderRadius: '14px',
                  background: `${stat.color}08`,
                  border: `1px solid ${stat.color}15`,
                  textAlign: 'center'
                }}>
                  <StatIcon size={20} color={stat.color} style={{ marginBottom: '6px' }} />
                  <div style={{ fontSize: '22px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Spin animation for loader */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
