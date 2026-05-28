import { MdAssignment, MdStar, MdEdit, MdSave, MdAdd, MdClose, MdDelete, MdToggleOn, MdToggleOff, MdTaskAlt, MdRepeat, MdAutoAwesome } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Loader } from '../../components/ui/Loader';

const fadeIn = `
@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
`;

const typeConfig = {
  daily:     { label: 'Kunlik',       color: '#3b82f6', icon: <MdRepeat /> },
  weekly:    { label: 'Haftalik',     color: '#8b5cf6', icon: <MdRepeat /> },
  one_time:  { label: 'Bir martalik', color: '#f59e0b', icon: <MdTaskAlt /> },
  special:   { label: 'Maxsus',       color: '#ef4444', icon: <MdAutoAwesome /> },
};

export default function TasksAdminPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', type:'daily', reward_points:10 });

  const fetchTasks = () => {
    setLoading(true);
    adminApi.listSubmissions({ status:'' }).catch(()=>{});
    import('../../api/endpoints').then(m => m.taskApi.list()).then(r => setTasks(r.data.tasks)).finally(() => setLoading(false));
  };
  useEffect(fetchTasks, []);

  const reset = () => { setForm({ title:'', description:'', type:'daily', reward_points:10 }); setEditing(null); setShowForm(false); };

  const handleSubmit = async () => {
    if(!form.title) return alert('Sarlavha kerak');
    if(editing) { await adminApi.updateTask(editing, form); } else { await adminApi.createTask(form); }
    reset(); fetchTasks();
  };

  const handleDelete = async (id) => { if(confirm('O\'chirishni tasdiqlaysizmi?')) { await adminApi.deleteTask(id); fetchTasks(); } };
  const handleEdit = (t) => { setForm({ title:t.title, description:t.description||'', type:t.type, reward_points:t.reward_points }); setEditing(t.id); setShowForm(true); };
  const handleToggle = async (t) => { await adminApi.updateTask(t.id, { is_active: !t.is_active }); fetchTasks(); };

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
            background:'linear-gradient(135deg, #3b82f620, #3b82f608)',
            border:'1px solid #3b82f625',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#3b82f6', fontSize:'20px',
          }}>
            <MdAssignment />
          </div>
          <h2 style={{ fontSize:'22px', fontWeight:'800', margin:0, color:'#fff' }}>Topshiriqlar</h2>
        </div>
        <button
          onClick={() => { reset(); setShowForm(!showForm); }}
          style={{
            padding: '10px 20px',
            background: showForm ? 'rgba(239,68,68,0.15)' : 'var(--accent-gradient)',
            border: showForm ? '1px solid rgba(239,68,68,0.3)' : 'none',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s ease',
          }}
        >
          {showForm ? <><MdClose /> Yopish</> : <><MdAdd /> Yangi</>}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          marginBottom: '24px',
          animation: 'slideUp 0.3s ease both',
        }}>
          <div style={{ fontSize:'16px', fontWeight:'700', marginBottom:'16px', color:'#fff' }}>
            {editing ? '✏️ Topshiriqni tahrirlash' : '➕ Yangi topshiriq'}
          </div>
          <input
            value={form.title}
            onChange={e => setForm({...form, title:e.target.value})}
            placeholder="Sarlavha"
            style={{...inp, marginBottom:'12px'}}
          />
          <textarea
            value={form.description}
            onChange={e => setForm({...form, description:e.target.value})}
            placeholder="Tavsif"
            rows={3}
            style={{...inp, marginBottom:'12px', resize:'vertical'}}
          />
          <div style={{ display:'flex', gap:'12px', marginBottom:'16px' }}>
            <select
              value={form.type}
              onChange={e => setForm({...form, type:e.target.value})}
              style={{...inp, flex:1}}
            >
              <option value="daily">Kunlik</option>
              <option value="weekly">Haftalik</option>
              <option value="one_time">Bir martalik</option>
              <option value="special">Maxsus</option>
            </select>
            <input
              type="number"
              value={form.reward_points}
              onChange={e => setForm({...form, reward_points:parseInt(e.target.value)||0})}
              placeholder="Ball"
              style={{...inp, width:'120px', flex:'none'}}
            />
          </div>
          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--accent-gradient)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '15px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {editing ? <><MdSave /> Saqlash</> : <><MdAdd /> Yaratish</>}
          </button>
        </div>
      )}

      {/* Tasks List */}
      {loading ? <Loader /> : tasks.length === 0 ? (
        <div style={{
          textAlign:'center', padding:'48px 24px',
          background:'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          borderRadius:'20px', border:'1px solid rgba(255,255,255,0.05)',
        }}>
          <MdAssignment style={{ fontSize:'40px', color:'rgba(255,255,255,0.15)', marginBottom:'12px' }} />
          <p style={{ color:'rgba(255,255,255,0.4)', margin:0, fontSize:'15px' }}>Topshiriq yo'q</p>
        </div>
      ) : tasks.map((t, i) => {
        const cfg = typeConfig[t.type] || typeConfig.daily;
        return (
          <div
            key={t.id}
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              marginBottom: '12px',
              opacity: t.is_active ? 1 : 0.45,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animation: `slideUp 0.3s ease ${i * 0.05}s both`,
              transition: 'opacity 0.2s ease',
            }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'14px', flex:1, minWidth:0 }}>
              <div style={{
                width:'40px', height:'40px', borderRadius:'10px',
                background:`${cfg.color}15`,
                border:`1px solid ${cfg.color}25`,
                display:'flex', alignItems:'center', justifyContent:'center',
                color: cfg.color, fontSize:'18px', flexShrink:0,
              }}>
                {cfg.icon}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontWeight:'700', fontSize:'15px', color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {t.title}
                </div>
                <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)', marginTop:'3px', display:'flex', alignItems:'center', gap:'6px' }}>
                  <span style={{
                    padding:'2px 8px', borderRadius:'6px', fontSize:'11px', fontWeight:'600',
                    background:`${cfg.color}15`, color:cfg.color, border:`1px solid ${cfg.color}25`,
                  }}>
                    {cfg.label}
                  </span>
                  <span style={{ display:'flex', alignItems:'center', gap:'3px', color:'#f59e0b' }}>
                    <MdStar style={{ fontSize:'13px' }} /> {t.reward_points}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
              <button
                onClick={() => handleToggle(t)}
                style={{
                  width:'36px', height:'36px',
                  background: t.is_active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                  border: `1px solid ${t.is_active ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                  borderRadius: '10px',
                  color: t.is_active ? '#22c55e' : '#ef4444',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                {t.is_active ? <MdToggleOn /> : <MdToggleOff />}
              </button>
              <button
                onClick={() => handleEdit(t)}
                style={{
                  width:'36px', height:'36px',
                  background: 'rgba(59,130,246,0.12)',
                  border: '1px solid rgba(59,130,246,0.25)',
                  borderRadius: '10px',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                }}
              >
                <MdEdit />
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                style={{
                  width:'36px', height:'36px',
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: '10px',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                }}
              >
                <MdDelete />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
