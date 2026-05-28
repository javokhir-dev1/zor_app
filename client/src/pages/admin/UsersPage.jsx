import { MdPeople, MdStar, MdCheckCircle, MdBlock, MdSearch, MdPerson, MdPhone, MdShield, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Loader } from '../../components/ui/Loader';

const fadeIn = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetch = (p = page, s = search) => {
    setLoading(true);
    adminApi.listUsers({ page: p, limit: 20, search: s }).then(r => { setUsers(r.data.users); setPagination(r.data.pagination); }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => fetch(), []);

  const handleSearch = () => { setPage(1); fetch(1, search); };
  const handleRole = async (id, role) => { if (confirm(`Rolni '${role}' ga o'zgartirishni tasdiqlaysizmi?`)) { await adminApi.updateRole(id, role); fetch(); } };
  const handleBan = async (u) => { const act = u.is_banned ? 'blokdan chiqarish' : 'bloklash'; if (confirm(`${u.full_name} ni ${act}ni tasdiqlaysizmi?`)) { await adminApi.toggleBan(u.id, !u.is_banned); fetch(); } };
  const handleScore = async (id) => { const a = prompt('Ball miqdorini kiriting (+10 yoki -5):'); if (a) { await adminApi.updateScore(id, parseInt(a)); fetch(); } };

  const roleBadge = (role) => {
    const colors = { admin: '#f44336', guard: '#ff9800', user: '#4fc3f7' };
    const c = colors[role] || '#4fc3f7';
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700',
        background: `${c}20`, color: c, border: `1px solid ${c}35`, textTransform: 'uppercase'
      }}>
        <MdShield size={12} /> {role}
      </span>
    );
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <style>{fadeIn}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #4fc3f7, #0288d1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(79,195,247,0.3)'
        }}>
          <MdPeople size={26} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>Foydalanuvchilar</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0 0' }}>
            {pagination.total ? `Jami: ${pagination.total} ta` : 'Boshqarish'}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div style={{
        display: 'flex', gap: '10px', marginBottom: '24px',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
        padding: '6px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <MdSearch size={20} style={{ position: 'absolute', left: '14px', color: 'rgba(255,255,255,0.35)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Qidirish (ism, tel, ID)..."
            style={{
              width: '100%', padding: '12px 14px 12px 42px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none'
            }}
          />
        </div>
        <button onClick={handleSearch} style={{
          padding: '12px 24px', background: 'var(--accent-gradient)',
          border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px'
        }}>
          <MdSearch size={18} /> Qidirish
        </button>
      </div>

      {/* Users list */}
      {loading ? <Loader /> : users.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '48px 20px',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <MdPeople size={48} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: '12px' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: 0 }}>Foydalanuvchi topilmadi</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {users.map((u, i) => (
            <div key={u.id} style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              padding: '16px 20px',
              opacity: u.is_banned ? 0.55 : 1,
              animation: `slideUp 0.3s ease ${i * 0.05}s both`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>

                {/* User info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 200px', minWidth: 0 }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: u.is_banned ? 'rgba(244,67,54,0.15)' : 'rgba(79,195,247,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <MdPerson size={22} color={u.is_banned ? '#f44336' : '#4fc3f7'} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {u.full_name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      @{u.username || '—'}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '0 0 auto' }}>
                  <MdPhone size={14} color="rgba(255,255,255,0.3)" />
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{u.phone || '—'}</span>
                </div>

                {/* Role badge + select */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 0 auto' }}>
                  {roleBadge(u.role)}
                  <select
                    value={u.role}
                    onChange={e => handleRole(u.id, e.target.value)}
                    style={{
                      padding: '5px 8px', background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                      color: '#fff', fontSize: '12px', outline: 'none', cursor: 'pointer'
                    }}
                  >
                    <option value="user">User</option>
                    <option value="guard">Guard</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Score */}
                <button onClick={() => handleScore(u.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.2)',
                  borderRadius: '10px', padding: '6px 14px', cursor: 'pointer', flex: '0 0 auto'
                }}>
                  <MdStar size={16} color="#ffc107" />
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#ffc107' }}>{u.score}</span>
                </button>

                {/* Status + Ban */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 0 auto' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: u.is_banned ? 'rgba(244,67,54,0.15)' : 'rgba(76,175,80,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {u.is_banned ? <MdBlock size={16} color="#f44336" /> : <MdCheckCircle size={16} color="#4caf50" />}
                  </div>
                  <button onClick={() => handleBan(u)} style={{
                    padding: '7px 16px',
                    background: u.is_banned
                      ? 'linear-gradient(135deg, #4caf50, #2e7d32)'
                      : 'linear-gradient(135deg, #f44336, #c62828)',
                    border: 'none', borderRadius: '10px', color: '#fff',
                    fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                    boxShadow: u.is_banned ? '0 2px 8px rgba(76,175,80,0.3)' : '0 2px 8px rgba(244,67,54,0.3)'
                  }}>
                    {u.is_banned ? 'Ochish' : 'Ban'}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '24px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => { if (page > 1) { setPage(page - 1); fetch(page - 1); } }}
            disabled={page <= 1}
            style={{
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px', color: page <= 1 ? 'rgba(255,255,255,0.2)' : '#fff',
              cursor: page <= 1 ? 'default' : 'pointer', fontSize: '14px'
            }}
          >
            <MdChevronLeft size={20} />
          </button>
          {Array.from({ length: pagination.total_pages }, (_, i) => (
            <button key={i} onClick={() => { setPage(i + 1); fetch(i + 1); }} style={{
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: page === i + 1
                ? 'var(--accent-gradient)'
                : 'rgba(255,255,255,0.04)',
              border: page === i + 1
                ? 'none'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: page === i + 1 ? '700' : '400',
              boxShadow: page === i + 1 ? '0 2px 10px rgba(79,195,247,0.3)' : 'none'
            }}>
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => { if (page < pagination.total_pages) { setPage(page + 1); fetch(page + 1); } }}
            disabled={page >= pagination.total_pages}
            style={{
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px', color: page >= pagination.total_pages ? 'rgba(255,255,255,0.2)' : '#fff',
              cursor: page >= pagination.total_pages ? 'default' : 'pointer', fontSize: '14px'
            }}
          >
            <MdChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
