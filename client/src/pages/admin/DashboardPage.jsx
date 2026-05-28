import { MdWarning } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { MdDashboard, MdPeople, MdPersonAdd, MdAssignment, MdLibraryBooks, MdMovie, MdEventSeat, MdTrendingUp } from 'react-icons/md';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi.getDashboard()
      .then(r => setData(r.data))
      .catch(e => {
        console.error('[Dashboard] API xatolik:', e);
        setError(e.response?.data?.error || e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'64px', gap:'12px' }}>
        <div style={{ width:'24px', height:'24px', border:'3px solid var(--border-glass)', borderTop:'3px solid var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        <span style={{ color:'var(--text-secondary)' }}>Yuklanmoqda...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign:'center', padding:'48px', color:'var(--danger)' }}>
        <div style={{ fontSize:'40px', marginBottom:'12px' }}><MdWarning /></div>
        <h3 style={{ marginBottom:'8px' }}>Xatolik</h3>
        <p style={{ color:'var(--text-secondary)', fontSize:'14px' }}>{error}</p>
      </div>
    );
  }

  if (!data) {
    return <p style={{ color:'var(--text-muted)', textAlign:'center', padding:'48px' }}>Ma'lumot yuklanmadi</p>;
  }

  const cards = [
    { icon:<MdPeople />, label:"Jami foydalanuvchilar", value:data.total_users, color:'var(--accent)' },
    { icon:<MdPersonAdd />, label:"Bugun qo'shilgan", value:data.today_users, color:'var(--info)' },
    { icon:<MdAssignment />, label:'Faol topshiriqlar', value:data.active_tasks, color:'var(--success)' },
    { icon:<MdLibraryBooks />, label:'Kutilayotgan isbotlar', value:data.pending_submissions, color:'var(--warning)' },
    { icon:<MdMovie />, label:"Faol ko'rsatuvlar", value:data.active_shows, color:'var(--accent-light)' },
    { icon:<MdEventSeat />, label:'Kutilayotgan chiptalar', value:data.pending_tickets, color:'var(--danger)' },
  ];

  return (
    <div style={{ animation:'fadeIn 0.3s ease' }}>
      <h2 style={{ fontSize:'18px', fontWeight:'700', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}><MdDashboard /> Dashboard</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'12px', marginBottom:'24px' }}>
        {cards.map(c => (
          <div key={c.label} style={{ background:'var(--bg-card)', borderRadius:'var(--radius-md)', padding:'16px', border:'1px solid var(--border-glass)', borderLeft:`3px solid ${c.color}` }}>
            <div style={{ fontSize:'24px', marginBottom:'4px' }}>{c.icon}</div>
            <div style={{ fontSize:'28px', fontWeight:'800', color:c.color }}>{c.value}</div>
            <div style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'2px' }}>{c.label}</div>
          </div>
        ))}
      </div>
      {data.weekly_registrations?.length > 0 && (
        <div style={{ 
          background:'var(--bg-card)', 
          borderRadius:'var(--radius-lg)', 
          padding:'24px', 
          border:'1px solid var(--border-glass)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
            <h3 style={{ fontSize:'16px', fontWeight:'600', color:'var(--text-primary)', display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ fontSize:'20px', display:'flex' }}><MdTrendingUp /></span> Haftalik ro'yxatdan o'tish
            </h3>
            <span style={{ fontSize:'12px', color:'var(--text-muted)', background:'rgba(255,255,255,0.05)', padding:'4px 12px', borderRadius:'12px' }}>7 kunlik</span>
          </div>

          <div style={{ display:'flex', alignItems:'flex-end', gap:'12px', height:'180px', paddingBottom:'8px' }}>
            {data.weekly_registrations.map((d, i) => {
              const count = parseInt(d.count) || 0;
              const max = Math.max(...data.weekly_registrations.map(x => parseInt(x.count) || 0));
              const h = max > 0 ? (count / max) * 140 : 4;
              const dateObj = new Date(d.date);
              const dayName = dateObj.toLocaleDateString('uz', { weekday:'short' });
              const dateNum = dateObj.getDate();

              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
                  <div style={{ 
                    fontSize:'13px', 
                    fontWeight:'800', 
                    color: count > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                    background: count === max && count > 0 ? 'var(--accent-gradient)' : 'transparent',
                    WebkitBackgroundClip: count === max && count > 0 ? 'text' : 'border-box',
                    WebkitTextFillColor: count === max && count > 0 ? 'transparent' : 'inherit',
                  }}>{count}</div>
                  
                  <div style={{ 
                    width: '100%',
                    maxWidth: '48px',
                    height:`${h}px`, 
                    background: count === max && count > 0 
                      ? 'linear-gradient(180deg, rgba(108, 92, 231, 0.6) 0%, rgba(108, 92, 231, 0.05) 100%)' 
                      : 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)',
                    borderTop: count === max && count > 0 ? '2px solid var(--accent)' : '2px solid rgba(255,255,255,0.2)',
                    borderRadius:'6px 6px 0 0', 
                    minHeight:'4px', 
                    transition:'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                     {count === max && count > 0 && <div style={{ position:'absolute', top:0, left:0, right:0, height:'20px', background:'var(--accent)', filter:'blur(10px)', opacity:0.5 }} />}
                  </div>
                  
                  <div style={{ textAlign:'center', display:'flex', flexDirection:'column', gap:'2px' }}>
                    <span style={{ fontSize:'12px', color:'var(--text-primary)', fontWeight:'600' }}>{dateNum}</span>
                    <span style={{ fontSize:'10px', color:'var(--text-muted)', textTransform:'capitalize' }}>{dayName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
