import { MdWarning, MdDashboard, MdPeople, MdPersonAdd, MdAssignment, MdLibraryBooks, MdMovie, MdEventSeat, MdTrendingUp } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';

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
        <div style={{ width:'24px', height:'24px', border:'3px solid rgba(255,255,255,0.1)', borderTop:'3px solid #6c5ce7', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        <span style={{ color:'rgba(255,255,255,0.5)' }}>Yuklanmoqda...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign:'center', padding:'48px' }}>
        <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:'rgba(255,71,87,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:'#ff4757', fontSize:'28px' }}><MdWarning /></div>
        <h3 style={{ marginBottom:'8px', fontWeight:'700' }}>Xatolik</h3>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'14px' }}>{error}</p>
      </div>
    );
  }

  if (!data) {
    return <p style={{ color:'rgba(255,255,255,0.4)', textAlign:'center', padding:'48px' }}>Ma'lumot yuklanmadi</p>;
  }

  const cards = [
    { icon:<MdPeople size={22} />, label:"Jami foydalanuvchilar", value:data.total_users, color:'#6c5ce7', bg:'rgba(108,92,231,0.1)' },
    { icon:<MdPersonAdd size={22} />, label:"Bugun qo'shilgan", value:data.today_users, color:'#1e90ff', bg:'rgba(30,144,255,0.1)' },
    { icon:<MdAssignment size={22} />, label:'Faol topshiriqlar', value:data.active_tasks, color:'#2ed573', bg:'rgba(46,213,115,0.1)' },
    { icon:<MdLibraryBooks size={22} />, label:'Kutilayotgan isbotlar', value:data.pending_submissions, color:'#ffa502', bg:'rgba(255,165,2,0.1)' },
    { icon:<MdMovie size={22} />, label:"Faol ko'rsatuvlar", value:data.active_shows, color:'#9b59b6', bg:'rgba(155,89,182,0.1)' },
    { icon:<MdEventSeat size={22} />, label:'Kutilayotgan chiptalar', value:data.pending_tickets, color:'#ff4757', bg:'rgba(255,71,87,0.1)' },
  ];

  return (
    <div style={{ animation:'fadeIn 0.3s ease' }}>
      {/* Title */}
      <div style={{ marginBottom:'20px' }}>
        <h2 style={{ fontSize:'22px', fontWeight:'800', display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
          <MdDashboard style={{ color:'#6c5ce7' }} /> Dashboard
        </h2>
        <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.4)' }}>Tizim statistikasi</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'12px', marginBottom:'24px' }}>
        {cards.map((c, i) => (
          <div key={c.label} style={{ 
            background:'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)', 
            borderRadius:'20px', 
            padding:'18px 16px', 
            border:'1px solid rgba(255,255,255,0.05)', 
            boxShadow:'0 4px 16px rgba(0,0,0,0.1)',
            animation:`slideUp 0.3s ease ${i * 0.05}s both`,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:c.bg, color:c.color, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${c.color}25` }}>
                {c.icon}
              </div>
            </div>
            <div style={{ fontSize:'28px', fontWeight:'900', color:c.color, lineHeight:1, marginBottom:'4px' }}>{c.value}</div>
            <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)', fontWeight:'500' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      {data.weekly_registrations?.length > 0 && (
        <div style={{ 
          background:'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)', 
          borderRadius:'24px', 
          padding:'24px 20px', 
          border:'1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          animation:'slideUp 0.3s ease 0.3s both',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(108,92,231,0.1)', color:'#6c5ce7', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(108,92,231,0.2)' }}>
                <MdTrendingUp size={20} />
              </div>
              <div>
                <h3 style={{ fontSize:'15px', fontWeight:'700', margin:0 }}>Haftalik ro'yxatdan o'tish</h3>
                <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', margin:0 }}>Oxirgi 7 kun</p>
              </div>
            </div>
            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.05)', padding:'4px 12px', borderRadius:'8px', fontWeight:'600' }}>7 kunlik</span>
          </div>

          <div style={{ display:'flex', alignItems:'flex-end', gap:'10px', height:'160px', paddingBottom:'8px' }}>
            {data.weekly_registrations.map((d, i) => {
              const count = parseInt(d.count) || 0;
              const max = Math.max(...data.weekly_registrations.map(x => parseInt(x.count) || 0));
              const h = max > 0 ? (count / max) * 120 : 4;
              const dateObj = new Date(d.date);
              const dayName = dateObj.toLocaleDateString('uz', { weekday:'short' });
              const dateNum = dateObj.getDate();
              const isMax = count === max && count > 0;

              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                  <div style={{ 
                    fontSize:'12px', fontWeight:'800', 
                    color: isMax ? '#6c5ce7' : count > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
                  }}>{count}</div>
                  
                  <div style={{ 
                    width:'100%', maxWidth:'42px', height:`${h}px`, 
                    background: isMax 
                      ? 'linear-gradient(180deg, #6c5ce7 0%, rgba(108,92,231,0.2) 100%)' 
                      : 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)',
                    borderRadius:'8px 8px 4px 4px', 
                    minHeight:'4px', 
                    transition:'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isMax ? '0 4px 16px rgba(108,92,231,0.3)' : 'none',
                  }} />
                  
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:'12px', color: isMax ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight:'600' }}>{dateNum}</div>
                    <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{dayName}</div>
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
