import { MdCheckCircle, MdCancel, MdEventSeat, MdEvent } from 'react-icons/md';
const sts = { booked:'📋 Kutilmoqda', confirmed:'<MdCheckCircle /> Tasdiqlangan', cancelled:'<MdCancel /> Bekor qilingan', used:'<MdEventSeat /> Ishlatilgan' };

export default function ShowCard({ show, onBook }) {
  const d = new Date(show.show_date);
  const date = d.toLocaleDateString('uz-UZ', { day:'numeric', month:'long', year:'numeric' });
  const time = d.toLocaleTimeString('uz-UZ', { hour:'2-digit', minute:'2-digit' });
  const pct = ((show.total_seats - show.available_seats) / show.total_seats) * 100;

  return (
    <div style={{ background:'var(--bg-card)', borderRadius:'var(--radius-md)', padding:'var(--space-md)', border:'1px solid var(--border-glass)', marginBottom:'12px', animation:'fadeIn 0.3s ease' }}>
      <h4 style={{ fontSize:'15px', fontWeight:'600', marginBottom:'8px' }}>{show.title}</h4>
      {show.description && <p style={{ fontSize:'13px', color:'var(--text-secondary)', marginBottom:'8px' }}>{show.description}</p>}
      <div style={{ display:'flex', gap:'16px', fontSize:'12px', color:'var(--text-muted)', marginBottom:'12px' }}>
        <span><MdEvent /> {date} {time}</span>
        {show.location && <span>📍 {show.location}</span>}
      </div>
      <div style={{ marginBottom:'12px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'var(--text-secondary)', marginBottom:'4px' }}>
          <span>Joylar</span><span>{show.available_seats}/{show.total_seats}</span>
        </div>
        <div style={{ height:'6px', background:'var(--bg-card-hover)', borderRadius:'3px', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'var(--accent-gradient)', borderRadius:'3px', transition:'width 0.5s' }} />
        </div>
      </div>
      {show.user_ticket ? (
        <div style={{ padding:'8px', borderRadius:'var(--radius-sm)', background:'rgba(0,184,148,0.15)', color:'var(--success)', textAlign:'center', fontSize:'13px' }}>{sts[show.user_ticket.status]}</div>
      ) : show.available_seats > 0 ? (
        <button onClick={() => onBook(show)} style={{ width:'100%', padding:'10px', background:'var(--accent-gradient)', border:'none', borderRadius:'var(--radius-sm)', color:'#fff', fontWeight:'600', fontSize:'14px', cursor:'pointer' }}>Joy band qilish</button>
      ) : (
        <div style={{ padding:'8px', textAlign:'center', color:'var(--danger)', fontSize:'13px' }}>Joy qolmagan</div>
      )}
    </div>
  );
}
