import { MdPerson, MdLibraryBooks, MdStar, MdCheckCircle, MdCancel, MdHourglassTop, MdFactCheck, MdImage } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Loader } from '../../components/ui/Loader';

const fadeIn = `
@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
`;

const statusConfig = {
  submitted: { color: '#f59e0b', label: 'Kutilmoqda',    icon: <MdHourglassTop /> },
  approved:  { color: '#22c55e', label: 'Tasdiqlangan',  icon: <MdCheckCircle /> },
  rejected:  { color: '#ef4444', label: 'Rad etilgan',   icon: <MdCancel /> },
};

const filters = [
  { key: 'submitted', label: 'Kutilmoqda',   color: '#f59e0b' },
  { key: 'approved',  label: 'Tasdiqlangan', color: '#22c55e' },
  { key: 'rejected',  label: 'Rad etilgan',  color: '#ef4444' },
];

export default function SubmissionsPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('submitted');

  const fetchSubs = (s = filter) => {
    setLoading(true);
    adminApi.listSubmissions({ status: s, limit: 50 })
      .then(r => setSubs(r.data.submissions))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(fetchSubs, []);

  const handleFilter = (s) => { setFilter(s); fetchSubs(s); };

  const handleReview = async (id, status) => {
    const label = status === 'approved' ? 'tasdiqlash' : 'rad etish';
    if(!confirm(`Isbotni ${label}ni tasdiqlaysizmi?`)) return;
    await adminApi.reviewSubmission(id, status);
    fetchSubs();
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <style>{fadeIn}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px' }}>
        <div style={{
          width:'42px', height:'42px', borderRadius:'12px',
          background:'linear-gradient(135deg, #8b5cf620, #8b5cf608)',
          border:'1px solid #8b5cf625',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#8b5cf6', fontSize:'20px',
        }}>
          <MdFactCheck />
        </div>
        <h2 style={{ fontSize:'22px', fontWeight:'800', margin:0, color:'#fff' }}>Isbotlar</h2>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display:'flex', gap:'8px', marginBottom:'24px',
        background:'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        borderRadius:'16px', padding:'6px',
        border:'1px solid rgba(255,255,255,0.05)',
      }}>
        {filters.map(f => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => handleFilter(f.key)}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: active ? `${f.color}20` : 'transparent',
                border: active ? `1px solid ${f.color}35` : '1px solid transparent',
                borderRadius: '12px',
                color: active ? f.color : 'rgba(255,255,255,0.45)',
                fontWeight: active ? '700' : '500',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s ease',
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Submissions List */}
      {loading ? <Loader /> : subs.length === 0 ? (
        <div style={{
          textAlign:'center', padding:'48px 24px',
          background:'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          borderRadius:'20px', border:'1px solid rgba(255,255,255,0.05)',
        }}>
          <MdLibraryBooks style={{ fontSize:'40px', color:'rgba(255,255,255,0.15)', marginBottom:'12px' }} />
          <p style={{ color:'rgba(255,255,255,0.4)', margin:0, fontSize:'15px' }}>Isbotlar topilmadi</p>
        </div>
      ) : subs.map((s, i) => {
        const cfg = statusConfig[s.status] || statusConfig.submitted;
        return (
          <div
            key={s.id}
            style={{
              background:'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              borderRadius:'16px',
              padding:'18px 20px',
              border:'1px solid rgba(255,255,255,0.05)',
              boxShadow:'0 4px 16px rgba(0,0,0,0.1)',
              marginBottom:'12px',
              animation: `slideUp 0.3s ease ${i * 0.05}s both`,
            }}
          >
            {/* Top Row: User + Status */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{
                  width:'32px', height:'32px', borderRadius:'8px',
                  background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.25)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#8b5cf6', fontSize:'16px',
                }}>
                  <MdPerson />
                </div>
                <div>
                  <div style={{ fontWeight:'700', fontSize:'14px', color:'#fff' }}>
                    {s.user_name || `User #${s.user_id}`}
                  </div>
                  {s.task_title && (
                    <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', marginTop:'1px' }}>
                      {s.task_title}
                    </div>
                  )}
                </div>
              </div>
              <div style={{
                display:'flex', alignItems:'center', gap:'6px',
                padding:'4px 10px', borderRadius:'8px',
                background:`${cfg.color}12`, border:`1px solid ${cfg.color}25`,
                color: cfg.color, fontSize:'12px', fontWeight:'600',
              }}>
                <span style={{ fontSize:'14px', display:'flex' }}>{cfg.icon}</span>
                {cfg.label}
              </div>
            </div>

            {/* Proof Content */}
            {(() => {
              let proofData = null;
              try {
                proofData = typeof s.proof === 'string' ? JSON.parse(s.proof) : s.proof;
              } catch { proofData = null; }
              const proofText = proofData?.text || s.proof_text || '';
              const proofImages = proofData?.images || [];
              return (
                <>
                  {proofText && (
                    <div style={{
                      padding:'12px 14px', borderRadius:'12px',
                      background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)',
                      fontSize:'13px', color:'rgba(255,255,255,0.7)', lineHeight:'1.5',
                      marginBottom:'12px',
                    }}>
                      {proofText}
                    </div>
                  )}
                  {proofImages.length > 0 && (
                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'12px' }}>
                      {proofImages.map((img, idx) => (
                        <a key={idx} href={img} target="_blank" rel="noreferrer" style={{ display:'block', width:'72px', height:'72px', borderRadius:'10px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)' }}>
                          <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        </a>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}

            {/* Points + Date Row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: s.status === 'submitted' ? '14px' : '0' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'4px', color:'#f59e0b', fontSize:'13px', fontWeight:'600' }}>
                <MdStar style={{ fontSize:'15px' }} /> {s.reward_points || s.task_reward || '—'} ball
              </div>
              {s.created_at && (
                <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.3)' }}>
                  {new Date(s.created_at).toLocaleDateString('uz-UZ')}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {s.status === 'submitted' && (
              <div style={{ display:'flex', gap:'10px' }}>
                <button
                  onClick={() => handleReview(s.id, 'approved')}
                  style={{
                    flex:1, padding:'10px',
                    background:'rgba(34,197,94,0.12)',
                    border:'1px solid rgba(34,197,94,0.25)',
                    borderRadius:'12px', color:'#22c55e',
                    fontWeight:'700', cursor:'pointer', fontSize:'13px',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                  }}
                >
                  <MdCheckCircle /> Tasdiqlash
                </button>
                <button
                  onClick={() => handleReview(s.id, 'rejected')}
                  style={{
                    flex:1, padding:'10px',
                    background:'rgba(239,68,68,0.12)',
                    border:'1px solid rgba(239,68,68,0.25)',
                    borderRadius:'12px', color:'#ef4444',
                    fontWeight:'700', cursor:'pointer', fontSize:'13px',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                  }}
                >
                  <MdCancel /> Rad etish
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
