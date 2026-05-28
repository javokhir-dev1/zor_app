import { MdStar, MdCheckCircle, MdCancel, MdEvent } from 'react-icons/md';
const typeBadge = { daily:'<MdEvent /> Kunlik', weekly:'📆 Haftalik', one_time:'<MdStar /> Bir martalik', special:'🌟 Maxsus' };
const statusStyles = { submitted: { bg:'var(--warning)', text:'⏳ Tekshirilmoqda' }, approved: { bg:'var(--success)', text:'<MdCheckCircle /> Tasdiqlangan' }, rejected: { bg:'var(--danger)', text:'<MdCancel /> Rad etilgan' } };

export default function TaskCard({ task, onSubmit }) {
  const st = task.user_status;
  const done = st && st.status !== 'pending';
  return (
    <div style={{ background:'var(--bg-card)', borderRadius:'var(--radius-md)', padding:'var(--space-md)', border:'1px solid var(--border-glass)', marginBottom:'12px', animation:'fadeIn 0.3s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
        <div>
          <h4 style={{ fontSize:'15px', fontWeight:'600' }}>{task.title}</h4>
          <span style={{ fontSize:'11px', color:'var(--text-muted)' }}>{typeBadge[task.type] || task.type}</span>
        </div>
        <span style={{ background:'var(--accent-gradient)', padding:'4px 10px', borderRadius:'var(--radius-full)', fontSize:'12px', fontWeight:'600', whiteSpace:'nowrap' }}><MdStar /> {task.reward_points}</span>
      </div>
      {task.description && <p style={{ fontSize:'13px', color:'var(--text-secondary)', marginBottom:'12px', lineHeight:'1.4' }}>{task.description}</p>}
      {done ? (
        <div style={{ padding:'8px 12px', borderRadius:'var(--radius-sm)', background: statusStyles[st.status]?.bg + '22', color: statusStyles[st.status]?.bg, fontSize:'13px', fontWeight:'500', textAlign:'center' }}>{statusStyles[st.status]?.text}</div>
      ) : (
        <button onClick={() => onSubmit(task)} style={{ width:'100%', padding:'10px', background:'var(--accent-gradient)', border:'none', borderRadius:'var(--radius-sm)', color:'#fff', fontWeight:'600', fontSize:'14px', cursor:'pointer' }}>Bajarish</button>
      )}
    </div>
  );
}
