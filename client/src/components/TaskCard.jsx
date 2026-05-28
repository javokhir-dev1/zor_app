import { MdStar, MdCheckCircle, MdCancel, MdHourglassTop, MdEvent } from 'react-icons/md';

const typeConfig = {
  daily:    { label:'Kunlik',        color:'#2ed573' },
  weekly:   { label:'Haftalik',      color:'#1e90ff' },
  one_time: { label:'Bir martalik',  color:'#ffa502' },
  special:  { label:'Maxsus',        color:'#9b59b6' },
};

const statusConfig = {
  submitted: { icon:<MdHourglassTop />, label:'Tekshirilmoqda', color:'#f59e0b', bg:'rgba(245,158,11,0.12)' },
  approved:  { icon:<MdCheckCircle />,  label:'Tasdiqlangan',   color:'#22c55e', bg:'rgba(34,197,94,0.12)' },
  rejected:  { icon:<MdCancel />,       label:'Rad etilgan',    color:'#ef4444', bg:'rgba(239,68,68,0.12)' },
};

export default function TaskCard({ task, onSubmit }) {
  const st = task.user_status;
  const done = st && st.status !== 'pending';
  const type = typeConfig[task.type] || { label: task.type, color: '#999' };

  return (
    <div style={{
      background:'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      borderRadius:'20px', padding:'18px',
      border:'1px solid rgba(255,255,255,0.05)',
      boxShadow:'0 4px 16px rgba(0,0,0,0.1)',
      marginBottom:'12px', animation:'fadeIn 0.3s ease',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <h4 style={{ fontSize:'15px', fontWeight:'700', margin:0 }}>{task.title}</h4>
          <span style={{
            display:'inline-flex', alignItems:'center', gap:'4px',
            fontSize:'11px', fontWeight:'600', marginTop:'6px',
            padding:'3px 8px', borderRadius:'6px',
            background:`${type.color}15`, color:type.color,
            border:`1px solid ${type.color}25`,
          }}>
            <MdEvent size={12} /> {type.label}
          </span>
        </div>
        <span style={{
          background:'var(--accent-gradient)', padding:'5px 12px',
          borderRadius:'10px', fontSize:'12px', fontWeight:'700',
          whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'4px',
        }}><MdStar /> {task.reward_points}</span>
      </div>

      {task.description && <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.5)', marginBottom:'14px', lineHeight:'1.5', margin:'0 0 14px' }}>{task.description}</p>}

      {done ? (
        <div style={{
          padding:'10px 14px', borderRadius:'14px',
          background: statusConfig[st.status]?.bg || 'rgba(255,255,255,0.05)',
          border: `1px solid ${statusConfig[st.status]?.color || '#999'}25`,
          display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
          color: statusConfig[st.status]?.color || '#999',
          fontSize:'13px', fontWeight:'600',
        }}>
          {statusConfig[st.status]?.icon} {statusConfig[st.status]?.label}
        </div>
      ) : (
        <button
          onClick={() => onSubmit(task)}
          style={{
            width:'100%', padding:'12px',
            background:'var(--accent-gradient)', border:'none',
            borderRadius:'14px', color:'#fff', fontWeight:'700',
            fontSize:'14px', cursor:'pointer',
            transition:'transform 0.2s',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Bajarish
        </button>
      )}
    </div>
  );
}
