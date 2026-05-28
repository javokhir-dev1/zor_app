import { MdMovie, MdCheckCircle, MdCancel, MdEventSeat, MdEdit, MdSave, MdAdd, MdEvent } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Loader } from '../../components/ui/Loader';

export default function ShowsAdminPage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', show_date:'', location:'', total_seats:100 });

  const fetch = () => { setLoading(true); adminApi.listShows().then(r => setShows(r.data.shows)).finally(() => setLoading(false)); };
  useEffect(fetch, []);

  const reset = () => { setForm({ title:'',description:'',show_date:'',location:'',total_seats:100 }); setEditing(null); setShowForm(false); };
  const handleSubmit = async () => {
    if(!form.title || !form.show_date) return alert('Sarlavha va sana kerak');
    if(editing) { await adminApi.updateShow(editing, form); } else { await adminApi.createShow(form); }
    reset(); fetch();
  };
  const handleEdit = (s) => { setForm({ title:s.title, description:s.description||'', show_date: new Date(s.show_date).toISOString().slice(0,16), location:s.location||'', total_seats:s.total_seats }); setEditing(s.id); setShowForm(true); };
  const handleTickets = async (showId, title) => { const r = await adminApi.listShowTickets(showId); setTickets(r.data.tickets); setSelectedShow(title); };
  const handleConfirm = async (ticketId) => { await adminApi.confirmTicket(ticketId); handleTickets(tickets[0]?.show_id || 0, selectedShow); };

  const inp = { padding:'10px', background:'var(--bg-card)', border:'1px solid var(--border-glass)', borderRadius:'8px', color:'var(--text-primary)', fontSize:'14px', outline:'none', width:'100%' };
  const tsts = { booked:'📋 Kutilmoqda', confirmed:'<MdCheckCircle /> Tasdiqlangan', used:'<MdEventSeat /> Ishlatilgan', cancelled:'<MdCancel /> Bekor' };

  return (
    <div style={{ animation:'fadeIn 0.3s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <h2 style={{ fontSize:'18px', fontWeight:'700' }}><MdMovie /> Ko'rsatuvlar</h2>
        <button onClick={()=>{reset();setShowForm(!showForm);setTickets(null);}} style={{ padding:'8px 16px', background:'var(--accent-gradient)', border:'none', borderRadius:'var(--radius-md)', color:'#fff', fontWeight:'600', cursor:'pointer', fontSize:'13px' }}>{showForm ? '✕ Yopish' : '+ Yangi'}</button>
      </div>

      {showForm && (
        <div style={{ background:'var(--bg-card)', borderRadius:'var(--radius-md)', padding:'16px', border:'1px solid var(--border-glass)', marginBottom:'16px' }}>
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Ko'rsatuv nomi" style={{...inp, marginBottom:'8px'}} />
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Tavsif" rows={2} style={{...inp, marginBottom:'8px', resize:'vertical'}} />
          <div style={{ display:'flex', gap:'8px', marginBottom:'8px' }}>
            <input type="datetime-local" value={form.show_date} onChange={e=>setForm({...form,show_date:e.target.value})} style={{...inp, flex:1}} />
            <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Manzil" style={{...inp, flex:1}} />
          </div>
          <input type="number" value={form.total_seats} onChange={e=>setForm({...form,total_seats:parseInt(e.target.value)||0})} placeholder="Joylar soni" style={{...inp, marginBottom:'12px'}} />
          <button onClick={handleSubmit} style={{ width:'100%', padding:'10px', background:'var(--accent-gradient)', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'600', cursor:'pointer' }}>{editing ? '<MdSave /> Saqlash' : '<MdAdd /> Yaratish'}</button>
        </div>
      )}

      {tickets !== null && (
        <div style={{ background:'var(--bg-card)', borderRadius:'var(--radius-md)', padding:'16px', border:'1px solid var(--border-glass)', marginBottom:'16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
            <h3 style={{ fontSize:'15px', fontWeight:'600' }}><MdEventSeat /> {selectedShow} — Chiptalar</h3>
            <button onClick={()=>setTickets(null)} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' }}>✕</button>
          </div>
          {tickets.length === 0 ? <p style={{color:'var(--text-muted)',fontSize:'13px'}}>Chipta yo'q</p> : tickets.map(t => (
            <div key={t.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border-glass)', fontSize:'13px' }}>
              <div><span style={{ fontWeight:'600' }}>{t.full_name}</span> <span style={{ color:'var(--text-muted)' }}>({t.phone})</span></div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <span>{tsts[t.status]}</span>
                {t.status === 'booked' && <button onClick={()=>handleConfirm(t.id)} style={{ padding:'4px 10px', background:'var(--success)', border:'none', borderRadius:'6px', color:'#fff', fontSize:'11px', cursor:'pointer' }}>Tasdiqlash</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? <Loader /> : shows.length === 0 ? <p style={{color:'var(--text-muted)',textAlign:'center',padding:'32px'}}>Ko'rsatuv yo'q</p> : shows.map(s => (
        <div key={s.id} style={{ background:'var(--bg-card)', borderRadius:'var(--radius-md)', padding:'14px', border:'1px solid var(--border-glass)', marginBottom:'10px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontWeight:'600', fontSize:'14px' }}>{s.title}</div>
            <div style={{ fontSize:'12px', color:'var(--text-muted)' }}><MdEvent /> {new Date(s.show_date).toLocaleDateString('uz')} • <MdEventSeat /> {s.available_seats}/{s.total_seats}</div>
          </div>
          <div style={{ display:'flex', gap:'6px' }}>
            <button onClick={()=>handleTickets(s.id, s.title)} style={{ padding:'4px 10px', background:'var(--info)', border:'none', borderRadius:'6px', color:'#fff', fontSize:'11px', cursor:'pointer' }}><MdEventSeat /> Chiptalar</button>
            <button onClick={()=>handleEdit(s)} style={{ padding:'4px 8px', background:'none', border:'1px solid var(--border-glass)', borderRadius:'6px', color:'var(--info)', cursor:'pointer', fontSize:'12px' }}><MdEdit /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
