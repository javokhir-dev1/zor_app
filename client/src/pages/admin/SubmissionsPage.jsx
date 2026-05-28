import { MdPerson, MdLibraryBooks, MdStar, MdCheckCircle, MdCancel } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Loader } from '../../components/ui/Loader';

export default function SubmissionsPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('submitted');

  const fetch = (s = filter) => { setLoading(true); adminApi.listSubmissions({ status:s, limit:50 }).then(r => setSubs(r.data.submissions)).catch(()=>{}).finally(() => setLoading(false)); };
  useEffect(fetch, []);

  const handleReview = async (id, status) => {
    const label = status === 'approved' ? 'tasdiqlash' : 'rad etish';
    if(!confirm(`Isbotni ${label}ni tasdiqlaysizmi?`)) return;
    await adminApi.reviewSubmission(id, status); fetch();
  };

  const sts = { submitted: {color:'var(--warning)',label:'⏳ Kutilmoqda'}, approved: {color:'var(--success)',label:'<MdCheckCircle /> Tasdiqlangan'}, rejected: {color:'var(--danger)',label:'<MdCancel /> Rad etilgan'} };

  return (
    <div style={{ animation:'fadeIn 0.3s ease' }}>
      <h2 style={{ fontSize:'18px', fontWeight:'700', marginBottom:'16px' }}><MdLibraryBooks /> Isbotlar</h2>
      <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
        {['submitted','approved','rejected'].map(s => (
          <button key={s} onClick={()=>{setFilter(s);fetch(s);}} style={{ padding:'8px 14px', background: filter===s ? 'var(--accent)' : 'var(--bg-card)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-full)', color:'#fff', fontSize:'12px', cursor:'pointer' }}>{sts[s].label}</button>
        ))}
      </div>

      {loading ? <Loader /> : subs.length === 0 ? <p style={{color:'var(--text-muted)',textAlign:'center',padding:'32px'}}>Isbot topilmadi</p> : subs.map(s => (
        <div key={s.id} style={{ background:'var(--bg-card)', borderRadius:'var(--radius-md)', padding:'14px', border:'1px solid var(--border-glass)', marginBottom:'10px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
            <div>
              <div style={{ fontWeight:'600', fontSize:'14px' }}>{s.task_title}</div>
              <div style={{ fontSize:'12px', color:'var(--text-muted)' }}><MdPerson /> {s.user_name} • <MdStar /> {s.reward_points} ball</div>
            </div>
            <span style={{ fontSize:'11px', color:sts[s.status]?.color }}>{sts[s.status]?.label}</span>
          </div>
          {s.proof && <div style={{ padding:'8px', background:'var(--bg-primary)', borderRadius:'8px', fontSize:'13px', color:'var(--text-secondary)', marginBottom:'8px', wordBreak:'break-all' }}>📎 {typeof s.proof === 'string' ? JSON.parse(s.proof)?.text || s.proof : s.proof?.text || JSON.stringify(s.proof)}</div>}
          {s.status === 'submitted' && (
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={()=>handleReview(s.id,'approved')} style={{ flex:1, padding:'8px', background:'var(--success)', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'600', cursor:'pointer', fontSize:'13px' }}><MdCheckCircle /> Tasdiqlash</button>
              <button onClick={()=>handleReview(s.id,'rejected')} style={{ flex:1, padding:'8px', background:'var(--danger)', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'600', cursor:'pointer', fontSize:'13px' }}><MdCancel /> Rad etish</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
