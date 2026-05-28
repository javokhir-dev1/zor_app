import { MdLeaderboard, MdPerson, MdStar, MdEvent, MdPhoneIphone } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { userApi } from '../api/endpoints';
import PageWrapper from '../components/layout/PageWrapper';
import { Loader } from '../components/ui/Loader';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { userApi.getProfile().then(r => { setProfile(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <Loader />;
  if (!profile) return <PageWrapper title="Profil"><p style={{ textAlign:'center', color:'var(--text-muted)', padding:'48px 0' }}>Ma'lumot topilmadi</p></PageWrapper>;

  const initial = (profile.full_name || '?')[0].toUpperCase();
  const regDate = new Date(profile.registered_at).toLocaleDateString('uz-UZ', { day:'numeric', month:'long', year:'numeric' });

  return (
    <PageWrapper>
      {/* Cover Banner + Avatar */}
      <div style={{ margin:'-16px -16px 0', padding:'32px 0 56px', background:'linear-gradient(135deg, rgba(108,92,231,0.25) 0%, rgba(162,155,254,0.08) 100%)', borderBottom:'1px solid rgba(108,92,231,0.2)', display:'flex', justifyContent:'center', position:'relative' }}>
        {/* Decorative orbs */}
        <div style={{ position:'absolute', top:'-30px', left:'10%', width:'100px', height:'100px', background:'var(--accent)', filter:'blur(60px)', opacity:0.2, borderRadius:'50%' }} />
        <div style={{ position:'absolute', bottom:'-20px', right:'15%', width:'80px', height:'80px', background:'rgba(162,155,254,0.5)', filter:'blur(50px)', opacity:0.15, borderRadius:'50%' }} />
        <div style={{ position:'absolute', bottom:'-48px', left:'50%', transform:'translateX(-50%)', padding:'5px', background:'var(--bg-primary)', borderRadius:'50%' }}>
          <div style={{ width:'88px', height:'88px', borderRadius:'50%', background:'var(--accent-gradient)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'36px', fontWeight:'700', boxShadow:'0 8px 32px rgba(108,92,231,0.4)', overflow:'hidden' }}>
            {user?.photo_url ? (
              <img src={user.photo_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            ) : (
              initial
            )}
          </div>
        </div>
      </div>
      <div style={{ textAlign:'center', marginTop:'56px', marginBottom:'28px', animation:'slideUp 0.4s ease' }}>
        <h2 style={{ fontSize:'24px', fontWeight:'800', letterSpacing:'-0.5px' }}>{profile.full_name}</h2>
        {profile.username && <p style={{ color:'var(--accent-light)', fontSize:'14px', fontWeight:'500', marginTop:'4px' }}>@{profile.username}</p>}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'24px', animation:'slideUp 0.4s ease 0.1s both' }}>
        {[
          { label:'Reyting', value:`#${profile.rank}`, icon:<MdLeaderboard />, color:'#1e90ff', bg:'rgba(30,144,255,0.1)' },
          { label:'Ball', value:profile.score, icon:<MdStar />, color:'#ffa502', bg:'rgba(255,165,2,0.1)' },
          { label:'A\'zo', value:regDate.split(' ')[0] + ' ' + regDate.split(' ')[1], icon:<MdEvent />, color:'#2ed573', bg:'rgba(46,213,115,0.1)' },
        ].map(s => (
          <div key={s.label} style={{ background:'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', borderRadius:'20px', padding:'16px 8px', textAlign:'center', border:'1px solid rgba(255,255,255,0.05)', boxShadow:'0 8px 16px rgba(0,0,0,0.1)', backdropFilter:'blur(10px)' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', margin:'0 auto 10px', border:`1px solid ${s.color}30` }}>{s.icon}</div>
            <div style={{ fontSize:'18px', fontWeight:'800', marginBottom:'2px' }}>{s.value}</div>
            <div style={{ fontSize:'12px', color:'var(--text-muted)', fontWeight:'500' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', borderRadius:'24px', padding:'20px', border:'1px solid rgba(255,255,255,0.05)', boxShadow:'0 8px 24px rgba(0,0,0,0.1)', animation:'slideUp 0.4s ease 0.2s both' }}>
        <h4 style={{ fontSize:'14px', color:'var(--text-secondary)', marginBottom:'16px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.5px' }}>Shaxsiy ma'lumotlar</h4>
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {[
            { label:'Telefon', value:profile.phone, icon:<MdPhoneIphone />, color:'#ff4757', bg:'rgba(255,71,87,0.1)' },
            { label:'Telegram ID', value:profile.telegram_id, icon:<span style={{fontSize:'16px'}}>🆔</span>, color:'#1e90ff', bg:'rgba(30,144,255,0.1)' },
            { label:'Ro\'yxatdan o\'tgan', value:regDate, icon:<MdEvent />, color:'#2ed573', bg:'rgba(46,213,115,0.1)' },
          ].map((item, idx) => (
            <div key={item.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom: idx===2 ? '0' : '12px', borderBottom: idx===2 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:item.bg, color:item.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', border:`1px solid ${item.color}30` }}>
                  {item.icon}
                </div>
                <span style={{ color:'var(--text-secondary)', fontSize:'14px', fontWeight:'500' }}>{item.label}</span>
              </div>
              <span style={{ fontSize:'14px', fontWeight:'600' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
