import { MdAssignment, MdStar, MdEdit, MdSave, MdAdd } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Loader } from '../../components/ui/Loader';

export default function TasksAdminPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', type:'daily', reward_points:10 });

  const fetch = () => { setLoading(true); adminApi.listSubmissions({ status:'' }).catch(()=>{}); /* get tasks from user API as admin also sees all */
    import('../../api/endpoints').then(m => m.taskApi.list()).then(r => setTasks(r.data.tasks)).finally(() => setLoading(false)); };
  useEffect(fetch, []);

  const reset = () => { setForm({ title:'',description:'',type:'daily',reward_points:10 }); setEditing(null); setShowForm(false); };
  const handleSubmit = async () => {
    if(!form.title) return alert('Sarlavha kerak');
    if(editing) { await adminApi.updateTask(editing, form); } else { await adminApi.createTask(form); }
    reset(); fetch();
  };
  const handleDelete = async (id) => { if(confirm('O\'chirishni tasdiqlaysizmi?')) { await adminApi.deleteTask(id); fetch(); } };
  const handleEdit = (t) => { setForm({ title:t.title, description:t.description||'', type:t.type, reward_points:t.reward_points }); setEditing(t.id); setShowForm(true); };
  const handleToggle = async (t) => { await adminApi.updateTask(t.id, { is_active: !t.is_active }); fetch(); };

  const inp = { padding:'10px', background:'var(--bg-card)', border:'1px solid var(--border-glass)', borderRadius:'8px', color:'var(--text-primary)', fontSize:'14px', outline:'none', width:'100%' };

  return (
    <div style={{ animation:'fadeIn 0.3s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <h2 style={{ fontSize:'18px', fontWeight:'700' }}><MdAssignment /> Topshiriqlar</h2>
        <button onClick={()=>{reset();setShowForm(!showForm);}} style={{ padding:'8px 16px', background:'var(--accent-gradient)', border:'none', borderRadius:'var(--radius-md)', color:'#fff', fontWeight:'600', cursor:'pointer', fontSize:'13px' }}>
          {showForm ? '✕ Yopish' : '+ Yangi'}
        </button>
      </div>

      {showForm && (
        <div style={{ background:'var(--bg-card)', borderRadius:'var(--radius-md)', padding:'16px', border:'1px solid var(--border-glass)', marginBottom:'16px' }}>
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Sarlavha" style={{...inp, marginBottom:'8px'}} />
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Tavsif" rows={3} style={{...inp, marginBottom:'8px', resize:'vertical'}} />
          <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
            <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{...inp, flex:1}}>
              <option value="daily">Kunlik</option><option value="weekly">Haftalik</option><option value="one_time">Bir martalik</option><option value="special">Maxsus</option>
            </select>
            <input type="number" value={form.reward_points} onChange={e=>setForm({...form,reward_points:parseInt(e.target.value)||0})} placeholder="Ball" style={{...inp, width:'100px'}} />
          </div>
          <button onClick={handleSubmit} style={{ width:'100%', padding:'10px', background:'var(--accent-gradient)', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'600', cursor:'pointer' }}>{editing ? '<MdSave /> Saqlash' : '<MdAdd /> Yaratish'}</button>
        </div>
      )}

      {loading ? <Loader /> : tasks.length === 0 ? <p style={{color:'var(--text-muted)',textAlign:'center',padding:'32px'}}>Topshiriq yo'q</p> : tasks.map(t => (
        <div key={t.id} style={{ background:'var(--bg-card)', borderRadius:'var(--radius-md)', padding:'14px', border:'1px solid var(--border-glass)', marginBottom:'10px', opacity: t.is_active ? 1 : 0.5, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:'600', fontSize:'14px' }}>{t.title}</div>
            <div style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'2px' }}>{t.type} • <MdStar /> {t.reward_points} ball</div>
          </div>
          <div style={{ display:'flex', gap:'6px' }}>
            <button onClick={()=>handleToggle(t)} style={{ padding:'4px 8px', background:'none', border:'1px solid var(--border-glass)', borderRadius:'6px', color:'var(--text-secondary)', cursor:'pointer', fontSize:'12px' }}>{t.is_active ? '🟢' : '🔴'}</button>
            <button onClick={()=>handleEdit(t)} style={{ padding:'4px 8px', background:'none', border:'1px solid var(--border-glass)', borderRadius:'6px', color:'var(--info)', cursor:'pointer', fontSize:'12px' }}><MdEdit /></button>
            <button onClick={()=>handleDelete(t.id)} style={{ padding:'4px 8px', background:'none', border:'1px solid var(--border-glass)', borderRadius:'6px', color:'var(--danger)', cursor:'pointer', fontSize:'12px' }}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}
