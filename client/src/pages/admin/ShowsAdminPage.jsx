import { MdMovie, MdCheckCircle, MdCancel, MdEventSeat, MdEdit, MdSave, MdAdd, MdEvent, MdClose, MdConfirmationNumber, MdLocationOn, MdArrowBack, MdHourglassTop, MdPerson, MdDone } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Loader } from '../../components/ui/Loader';

const fadeIn = `
@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
`;

const ticketStatusConfig = {
  booked:    { color: '#f59e0b', label: 'Kutilmoqda',   icon: <MdHourglassTop /> },
  confirmed: { color: '#22c55e', label: 'Tasdiqlangan', icon: <MdCheckCircle /> },
  used:      { color: '#3b82f6', label: 'Ishlatilgan',  icon: <MdDone /> },
  cancelled: { color: '#ef4444', label: 'Bekor',        icon: <MdCancel /> },
};

export default function ShowsAdminPage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', show_date:'', location:'', total_seats:100 });

  const fetchShows = () => { setLoading(true); adminApi.listShows().then(r => setShows(r.data.shows)).finally(() => setLoading(false)); };
  useEffect(fetchShows, []);

  const reset = () => { setForm({ title:'', description:'', show_date:'', location:'', total_seats:100 }); setEditing(null); setShowForm(false); };

  const handleSubmit = async () => {
    if(!form.title || !form.show_date) return alert('Sarlavha va sana kerak');
    if(editing) { await adminApi.updateShow(editing, form); } else { await adminApi.createShow(form); }
    reset(); fetchShows();
  };

  const handleEdit = (s) => {
    setForm({ title:s.title, description:s.description||'', show_date: new Date(s.show_date).toISOString().slice(0,16), location:s.location||'', total_seats:s.total_seats });
    setEditing(s.id); setShowForm(true);
  };

  const handleTickets = async (showId, title) => {
    const r = await adminApi.listShowTickets(showId);
    setTickets(r.data.tickets); setSelectedShow(title);
  };

  const handleConfirm = async (ticketId) => {
    await adminApi.confirmTicket(ticketId);
    handleTickets(tickets[0]?.show_id || 0, selectedShow);
  };

  const inp = {
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <style>{fadeIn}</style>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{
            width:'42px', height:'42px', borderRadius:'12px',
            background:'linear-gradient(135deg, #ec489920, #ec489908)',
            border:'1px solid #ec489925',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#ec4899', fontSize:'20px',
          }}>
            <MdMovie />
          </div>
          <h2 style={{ fontSize:'22px', fontWeight:'800', margin:0, color:'#fff' }}>Tomoshalar</h2>
        </div>
        {!tickets && (
          <button
            onClick={() => { reset(); setShowForm(!showForm); }}
            style={{
              padding:'10px 20px',
              background: showForm ? 'rgba(239,68,68,0.15)' : 'var(--accent-gradient)',
              border: showForm ? '1px solid rgba(239,68,68,0.3)' : 'none',
              borderRadius:'12px', color:'#fff', fontWeight:'700',
              cursor:'pointer', fontSize:'13px',
              display:'flex', alignItems:'center', gap:'6px',
              transition:'all 0.2s ease',
            }}
          >
            {showForm ? <><MdClose /> Yopish</> : <><MdAdd /> Yangi</>}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && !tickets && (
        <div style={{
          background:'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          borderRadius:'20px', padding:'24px',
          border:'1px solid rgba(255,255,255,0.05)',
          boxShadow:'0 4px 16px rgba(0,0,0,0.1)',
          marginBottom:'24px',
          animation:'slideUp 0.3s ease both',
        }}>
          <div style={{ fontSize:'16px', fontWeight:'700', marginBottom:'16px', color:'#fff' }}>
            {editing ? '✏️ Tomoshani tahrirlash' : '➕ Yangi tomosha'}
          </div>
          <input value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="Sarlavha" style={{...inp, marginBottom:'12px'}} />
          <textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Tavsif" rows={3} style={{...inp, marginBottom:'12px', resize:'vertical'}} />
          <div style={{ display:'flex', gap:'12px', marginBottom:'12px' }}>
            <input type="datetime-local" value={form.show_date} onChange={e => setForm({...form, show_date:e.target.value})} style={{...inp, flex:1}} />
            <input value={form.location} onChange={e => setForm({...form, location:e.target.value})} placeholder="Manzil" style={{...inp, flex:1}} />
          </div>
          <input type="number" value={form.total_seats} onChange={e => setForm({...form, total_seats:parseInt(e.target.value)||0})} placeholder="Joylar soni" style={{...inp, marginBottom:'16px'}} />
          <button
            onClick={handleSubmit}
            style={{
              width:'100%', padding:'12px',
              background:'var(--accent-gradient)', border:'none',
              borderRadius:'12px', color:'#fff', fontWeight:'700',
              cursor:'pointer', fontSize:'15px',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
            }}
          >
            {editing ? <><MdSave /> Saqlash</> : <><MdAdd /> Yaratish</>}
          </button>
        </div>
      )}

      {/* Tickets Section */}
      {tickets ? (
        <div style={{ animation:'fadeIn 0.3s ease' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
            <button
              onClick={() => { setTickets(null); setSelectedShow(null); }}
              style={{
                width:'36px', height:'36px', borderRadius:'10px',
                background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
                color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'18px',
              }}
            >
              <MdArrowBack />
            </button>
            <div>
              <div style={{ fontSize:'16px', fontWeight:'700', color:'#fff' }}>{selectedShow}</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)' }}>
                <MdConfirmationNumber style={{ fontSize:'13px', verticalAlign:'middle' }} /> {tickets.length} chipta
              </div>
            </div>
          </div>

          {tickets.length === 0 ? (
            <div style={{
              textAlign:'center', padding:'48px 24px',
              background:'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              borderRadius:'20px', border:'1px solid rgba(255,255,255,0.05)',
            }}>
              <MdConfirmationNumber style={{ fontSize:'40px', color:'rgba(255,255,255,0.15)', marginBottom:'12px' }} />
              <p style={{ color:'rgba(255,255,255,0.4)', margin:0, fontSize:'15px' }}>Chiptalar topilmadi</p>
            </div>
          ) : tickets.map((tk, i) => {
            const tcfg = ticketStatusConfig[tk.status] || ticketStatusConfig.booked;
            return (
              <div
                key={tk.id}
                style={{
                  background:'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  borderRadius:'16px', padding:'16px 20px',
                  border:'1px solid rgba(255,255,255,0.05)',
                  boxShadow:'0 4px 16px rgba(0,0,0,0.1)',
                  marginBottom:'12px',
                  animation: `slideUp 0.3s ease ${i * 0.05}s both`,
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{
                    width:'36px', height:'36px', borderRadius:'8px',
                    background:`${tcfg.color}12`, border:`1px solid ${tcfg.color}25`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:tcfg.color, fontSize:'16px',
                  }}>
                    {tcfg.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight:'700', fontSize:'14px', color:'#fff', display:'flex', alignItems:'center', gap:'6px' }}>
                      <MdPerson style={{ fontSize:'15px', color:'rgba(255,255,255,0.4)' }} />
                      {tk.user_name || `User #${tk.user_id}`}
                    </div>
                    <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', marginTop:'2px', display:'flex', alignItems:'center', gap:'6px' }}>
                      <span style={{
                        padding:'2px 8px', borderRadius:'6px', fontSize:'11px', fontWeight:'600',
                        background:`${tcfg.color}15`, color:tcfg.color, border:`1px solid ${tcfg.color}25`,
                      }}>
                        {tcfg.label}
                      </span>
                      {tk.seat_number && <span>Joy: {tk.seat_number}</span>}
                    </div>
                  </div>
                </div>
                {tk.status === 'booked' && (
                  <button
                    onClick={() => handleConfirm(tk.id)}
                    style={{
                      padding:'8px 16px',
                      background:'rgba(34,197,94,0.12)',
                      border:'1px solid rgba(34,197,94,0.25)',
                      borderRadius:'10px', color:'#22c55e',
                      fontWeight:'700', cursor:'pointer', fontSize:'12px',
                      display:'flex', alignItems:'center', gap:'5px',
                    }}
                  >
                    <MdCheckCircle /> Tasdiqlash
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Shows List */
        <>
          {loading ? <Loader /> : shows.length === 0 ? (
            <div style={{
              textAlign:'center', padding:'48px 24px',
              background:'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              borderRadius:'20px', border:'1px solid rgba(255,255,255,0.05)',
            }}>
              <MdMovie style={{ fontSize:'40px', color:'rgba(255,255,255,0.15)', marginBottom:'12px' }} />
              <p style={{ color:'rgba(255,255,255,0.4)', margin:0, fontSize:'15px' }}>Tomoshalar topilmadi</p>
            </div>
          ) : shows.map((s, i) => (
            <div
              key={s.id}
              style={{
                background:'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                borderRadius:'16px', padding:'18px 20px',
                border:'1px solid rgba(255,255,255,0.05)',
                boxShadow:'0 4px 16px rgba(0,0,0,0.1)',
                marginBottom:'12px',
                animation: `slideUp 0.3s ease ${i * 0.05}s both`,
              }}
            >
              {/* Title Row */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', flex:1, minWidth:0 }}>
                  <div style={{
                    width:'40px', height:'40px', borderRadius:'10px',
                    background:'linear-gradient(135deg, #ec489918, #ec489908)',
                    border:'1px solid #ec489920',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'#ec4899', fontSize:'18px', flexShrink:0,
                  }}>
                    <MdMovie />
                  </div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontWeight:'700', fontSize:'15px', color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {s.title}
                    </div>
                    {s.description && (
                      <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', marginTop:'2px', lineHeight:'1.4' }}>
                        {s.description.length > 60 ? s.description.slice(0, 60) + '...' : s.description}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(s)}
                  style={{
                    width:'34px', height:'34px', borderRadius:'8px',
                    background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.25)',
                    color:'#3b82f6', cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'15px', flexShrink:0,
                  }}
                >
                  <MdEdit />
                </button>
              </div>

              {/* Info Row */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', marginBottom:'14px' }}>
                <div style={{
                  display:'flex', alignItems:'center', gap:'5px',
                  fontSize:'12px', color:'rgba(255,255,255,0.5)',
                }}>
                  <MdEvent style={{ color:'#8b5cf6', fontSize:'14px' }} />
                  {new Date(s.show_date).toLocaleString('uz-UZ', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                </div>
                {s.location && (
                  <div style={{
                    display:'flex', alignItems:'center', gap:'5px',
                    fontSize:'12px', color:'rgba(255,255,255,0.5)',
                  }}>
                    <MdLocationOn style={{ color:'#f59e0b', fontSize:'14px' }} />
                    {s.location}
                  </div>
                )}
                <div style={{
                  display:'flex', alignItems:'center', gap:'5px',
                  fontSize:'12px', color:'rgba(255,255,255,0.5)',
                }}>
                  <MdEventSeat style={{ color:'#22c55e', fontSize:'14px' }} />
                  {s.booked_seats || 0} / {s.total_seats}
                </div>
              </div>

              {/* Tickets Button */}
              <button
                onClick={() => handleTickets(s.id, s.title)}
                style={{
                  width:'100%', padding:'10px',
                  background:'rgba(236,72,153,0.08)',
                  border:'1px solid rgba(236,72,153,0.2)',
                  borderRadius:'12px', color:'#ec4899',
                  fontWeight:'700', cursor:'pointer', fontSize:'13px',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                }}
              >
                <MdConfirmationNumber /> Chiptalarni ko'rish
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
