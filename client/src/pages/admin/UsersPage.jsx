import { MdPeople, MdStar, MdCheckCircle } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Loader } from '../../components/ui/Loader';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetch = (p = page, s = search) => {
    setLoading(true);
    adminApi.listUsers({ page:p, limit:20, search:s }).then(r => { setUsers(r.data.users); setPagination(r.data.pagination); }).catch(()=>{}).finally(() => setLoading(false));
  };
  useEffect(() => fetch(), []);

  const handleSearch = () => { setPage(1); fetch(1, search); };
  const handleRole = async (id, role) => { if(confirm(`Rolni '${role}' ga o'zgartirishni tasdiqlaysizmi?`)) { await adminApi.updateRole(id, role); fetch(); } };
  const handleBan = async (u) => { const act = u.is_banned ? 'blokdan chiqarish' : 'bloklash'; if(confirm(`${u.full_name} ni ${act}ni tasdiqlaysizmi?`)) { await adminApi.toggleBan(u.id, !u.is_banned); fetch(); } };
  const handleScore = async (id) => { const a = prompt('Ball miqdorini kiriting (+10 yoki -5):'); if(a) { await adminApi.updateScore(id, parseInt(a)); fetch(); } };

  return (
    <div style={{ animation:'fadeIn 0.3s ease' }}>
      <h2 style={{ fontSize:'18px', fontWeight:'700', marginBottom:'16px' }}><MdPeople /> Foydalanuvchilar</h2>
      <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()} placeholder="Qidirish (ism, tel, ID)..." style={{ flex:1, padding:'10px 14px', background:'var(--bg-card)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', color:'var(--text-primary)', fontSize:'14px', outline:'none' }} />
        <button onClick={handleSearch} style={{ padding:'10px 20px', background:'var(--accent)', border:'none', borderRadius:'var(--radius-md)', color:'#fff', fontWeight:'600', cursor:'pointer' }}>🔍</button>
      </div>

      {loading ? <Loader /> : users.length === 0 ? <p style={{color:'var(--text-muted)',textAlign:'center',padding:'32px'}}>Foydalanuvchi topilmadi</p> : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border-glass)' }}>
                {['Ism','Telefon','Rol','Ball','Ban','Amallar'].map(h => <th key={h} style={{ padding:'10px 8px', textAlign:'left', color:'var(--text-muted)', fontWeight:'500' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom:'1px solid var(--border-glass)', opacity: u.is_banned ? 0.5 : 1 }}>
                  <td style={{ padding:'10px 8px' }}>
                    <div style={{ fontWeight:'600' }}>{u.full_name}</div>
                    <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>@{u.username || '—'}</div>
                  </td>
                  <td style={{ padding:'10px 8px', color:'var(--text-secondary)' }}>{u.phone || '—'}</td>
                  <td style={{ padding:'10px 8px' }}>
                    <select value={u.role} onChange={e=>handleRole(u.id,e.target.value)} style={{ padding:'4px 8px', background:'var(--bg-card)', border:'1px solid var(--border-glass)', borderRadius:'6px', color:'var(--text-primary)', fontSize:'12px' }}>
                      <option value="user">User</option><option value="guard">Guard</option><option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding:'10px 8px' }}>
                    <button onClick={()=>handleScore(u.id)} style={{ background:'none', border:'none', color:'var(--gold)', cursor:'pointer', fontWeight:'700' }}><MdStar /> {u.score}</button>
                  </td>
                  <td style={{ padding:'10px 8px' }}>{u.is_banned ? '🚫' : <MdCheckCircle />}</td>
                  <td style={{ padding:'10px 8px' }}>
                    <button onClick={()=>handleBan(u)} style={{ padding:'4px 10px', background: u.is_banned ? 'var(--success)' : 'var(--danger)', border:'none', borderRadius:'6px', color:'#fff', fontSize:'11px', cursor:'pointer' }}>
                      {u.is_banned ? 'Ochish' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.total_pages > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'16px' }}>
          {Array.from({length:pagination.total_pages}, (_,i) => (
            <button key={i} onClick={()=>{setPage(i+1);fetch(i+1);}} style={{ padding:'6px 12px', background: page===i+1 ? 'var(--accent)' : 'var(--bg-card)', border:'1px solid var(--border-glass)', borderRadius:'6px', color:'#fff', cursor:'pointer', fontSize:'12px' }}>{i+1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
