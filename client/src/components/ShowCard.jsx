import { MdCheckCircle, MdCancel, MdEventSeat, MdEvent, MdQrCode2, MdClose, MdHourglassTop, MdLocationOn } from 'react-icons/md';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

const statusConfig = {
  booked:    { label:'Kutilmoqda',     icon:<MdHourglassTop />, color:'#ffa502', bg:'rgba(255,165,2,0.12)' },
  confirmed: { label:'Tasdiqlangan',   icon:<MdCheckCircle />,  color:'#2ed573', bg:'rgba(46,213,115,0.12)' },
  cancelled: { label:'Bekor qilingan', icon:<MdCancel />,       color:'#ff4757', bg:'rgba(255,71,87,0.12)' },
  used:      { label:'Ishlatilgan',    icon:<MdEventSeat />,    color:'#1e90ff', bg:'rgba(30,144,255,0.12)' },
};

export default function ShowCard({ show, onBook }) {
  const [showQR, setShowQR] = useState(false);
  const d = new Date(show.show_date);
  const date = d.toLocaleDateString('uz-UZ', { day:'numeric', month:'long', year:'numeric' });
  const time = d.toLocaleTimeString('uz-UZ', { hour:'2-digit', minute:'2-digit' });
  const pct = ((show.total_seats - show.available_seats) / show.total_seats) * 100;
  const ticket = show.user_ticket;
  const cfg = ticket ? statusConfig[ticket.status] : null;

  return (
    <>
      <div style={{ background:'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', borderRadius:'20px', padding:'18px', border:'1px solid rgba(255,255,255,0.06)', marginBottom:'14px', animation:'fadeIn 0.3s ease', boxShadow:'0 8px 24px rgba(0,0,0,0.12)' }}>
        <h4 style={{ fontSize:'16px', fontWeight:'700', marginBottom:'8px' }}>{show.title}</h4>
        {show.description && <p style={{ fontSize:'13px', color:'var(--text-secondary)', marginBottom:'10px', lineHeight:'1.4' }}>{show.description}</p>}
        
        <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', fontSize:'12px', color:'var(--text-muted)', marginBottom:'14px' }}>
          <span style={{ display:'flex', alignItems:'center', gap:'4px' }}><MdEvent style={{ color:'var(--accent-light)' }} /> {date} {time}</span>
          {show.location && <span style={{ display:'flex', alignItems:'center', gap:'4px' }}><MdLocationOn style={{ color:'var(--accent-light)' }} /> {show.location}</span>}
        </div>

        {/* Seats progress */}
        <div style={{ marginBottom:'14px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'var(--text-secondary)', marginBottom:'4px' }}>
            <span>Joylar</span><span style={{ fontWeight:'600' }}>{show.available_seats}/{show.total_seats}</span>
          </div>
          <div style={{ height:'6px', background:'rgba(255,255,255,0.06)', borderRadius:'3px', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:'var(--accent-gradient)', borderRadius:'3px', transition:'width 0.5s' }} />
          </div>
        </div>

        {/* Ticket status / Book button */}
        {ticket ? (
          <div>
            <div style={{ padding:'10px 14px', borderRadius:'14px', background:cfg.bg, border:`1px solid ${cfg.color}25`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', color:cfg.color, fontSize:'14px', fontWeight:'600' }}>
                <span style={{ fontSize:'18px' }}>{cfg.icon}</span>
                {cfg.label}
              </div>
              {ticket.status === 'confirmed' && (
                <button onClick={() => setShowQR(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', background:cfg.color, border:'none', borderRadius:'10px', color:'#fff', fontWeight:'700', fontSize:'13px', cursor:'pointer', transition:'transform 0.2s' }}>
                  <MdQrCode2 size={18} /> QR Kod
                </button>
              )}
            </div>
            {ticket.status === 'booked' && (
              <p style={{ fontSize:'11px', color:'var(--text-muted)', textAlign:'center', marginTop:'8px' }}>Admin tasdiqlashini kuting</p>
            )}
          </div>
        ) : show.available_seats > 0 ? (
          <button 
            onClick={() => onBook(show)} 
            style={{ width:'100%', padding:'12px', background:'var(--accent-gradient)', border:'none', borderRadius:'14px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer', transition:'transform 0.2s' }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Joy band qilish
          </button>
        ) : (
          <div style={{ padding:'10px', textAlign:'center', color:'var(--danger)', fontSize:'13px', fontWeight:'600', background:'rgba(255,71,87,0.08)', borderRadius:'14px' }}>Joy qolmagan</div>
        )}
      </div>

      {/* QR Code Fullscreen Modal */}
      {showQR && ticket?.qr_code && (
        <div 
          onClick={() => setShowQR(false)} 
          style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(20px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px', animation:'fadeIn 0.2s ease' }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:'28px', padding:'32px 28px', maxWidth:'340px', width:'100%', textAlign:'center', animation:'scaleIn 0.3s ease' }}>
            <QRCodeSVG 
              value={ticket.qr_code} 
              size={220} 
              level="H"
              style={{ width:'100%', height:'auto', maxWidth:'220px' }}
            />
            <h3 style={{ color:'#1a1a2e', fontSize:'18px', fontWeight:'800', marginTop:'20px' }}>{show.title}</h3>
            <p style={{ color:'#666', fontSize:'13px', marginTop:'6px' }}>
              {date} • {time}
            </p>
            <div style={{ marginTop:'16px', padding:'8px 16px', background:'rgba(46,213,115,0.1)', borderRadius:'10px', display:'inline-flex', alignItems:'center', gap:'6px', color:'#2ed573', fontSize:'13px', fontWeight:'600' }}>
              <MdCheckCircle /> Tasdiqlangan chipta
            </div>
          </div>
          <button 
            onClick={() => setShowQR(false)} 
            style={{ marginTop:'20px', width:'56px', height:'56px', borderRadius:'50%', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', fontSize:'24px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
          >
            <MdClose />
          </button>
        </div>
      )}
    </>
  );
}
