import { MdLiveTv, MdAssignment, MdLeaderboard, MdMovie, MdRadio, MdStar } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageWrapper from '../components/layout/PageWrapper';

const actions = [
  { path:'/live-tv', icon:<MdLiveTv />, title:'Jonli efir', desc:'To\'g\'ridan-to\'g\'ri efir', color:'#ff4757', bg:'rgba(255,71,87,0.15)' },
  { path:'/radio', icon:<MdRadio />, title:'Radio', desc:'Zo\'r Radio', color:'#ffa502', bg:'rgba(255,165,2,0.15)' },
  { path:'/tasks', icon:<MdAssignment />, title:'Topshiriqlar', desc:'Ball to\'plang', color:'#2ed573', bg:'rgba(46,213,115,0.15)' },
  { path:'/leaderboard', icon:<MdLeaderboard />, title:'Reyting', desc:'Top-100 ro\'yxat', color:'#1e90ff', bg:'rgba(30,144,255,0.15)' },
  { path:'/shows', icon:<MdMovie />, title:'Ko\'rsatuvlar', desc:'Chipta oling', color:'#9b59b6', bg:'rgba(155,89,182,0.15)' },
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div style={{ padding:'var(--space-lg) 0', animation:'fadeIn 0.4s ease' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
          <div>
            <h2 style={{ fontSize:'24px', fontWeight:'800', letterSpacing:'-0.5px', marginBottom:'4px' }}>Salom, {user?.full_name?.split(' ')[0]}! 👋</h2>
            <p style={{ color:'var(--text-secondary)', fontSize:'14px' }}>Zo'r TV Fan Club'ga xush kelibsiz</p>
          </div>
          <div onClick={() => navigate('/profile')} style={{ cursor:'pointer', width:'48px', height:'48px', borderRadius:'50%', background:'var(--accent-gradient)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'700', boxShadow:'var(--shadow-glow)', overflow:'hidden', transition:'transform 0.2s' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            {user?.photo_url ? (
              <img src={user.photo_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            ) : (
              (user?.full_name || '?')[0].toUpperCase()
            )}
          </div>
        </div>

        {/* Premium Score Card */}
        <div style={{ 
          position:'relative',
          overflow:'hidden',
          background:'linear-gradient(135deg, rgba(108,92,231,0.15) 0%, rgba(162,155,254,0.05) 100%)',
          border:'1px solid rgba(108,92,231,0.3)',
          borderRadius:'24px',
          padding:'28px 24px',
          boxShadow:'0 16px 40px rgba(0,0,0,0.2)',
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between'
        }}>
          {/* Subtle glowing orb in background */}
          <div style={{ position:'absolute', top:'-50%', left:'-10%', width:'150px', height:'150px', background:'var(--accent)', filter:'blur(50px)', opacity:0.3, borderRadius:'50%' }} />
          
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ color:'var(--accent-light)', fontSize:'12px', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px', fontWeight:'700', opacity:0.9 }}>Sizning balingiz</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:'8px' }}>
              <span style={{ fontSize:'48px', fontWeight:'900', lineHeight:'1', background:'var(--accent-gradient)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:'drop-shadow(0 4px 8px rgba(108,92,231,0.3))' }}>
                {user?.score || 0}
              </span>
              <span style={{ color:'var(--accent-light)', fontSize:'16px', fontWeight:'600' }}>ball</span>
            </div>
          </div>
          
          <div style={{ position:'relative', zIndex:1, width:'64px', height:'64px', background:'rgba(108,92,231,0.2)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent-light)', transform:'rotate(8deg)', boxShadow:'inset 0 4px 20px rgba(255,255,255,0.05)' }}>
            <MdStar size={40} style={{ filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', paddingBottom:'24px' }}>
        {actions.map((a, i) => (
          <button 
            key={a.path} 
            onClick={() => navigate(a.path)} 
            style={{ 
              display:'flex', 
              flexDirection: i === 0 ? 'row' : 'column', 
              alignItems: i === 0 ? 'center' : 'flex-start', 
              padding:'16px', 
              background:'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', 
              border:'1px solid rgba(255,255,255,0.08)', 
              borderRadius:'24px', 
              cursor:'pointer', 
              textAlign:'left', 
              color:'var(--text-primary)', 
              boxShadow:'0 8px 24px rgba(0,0,0,0.15)', 
              backdropFilter:'blur(10px)',
              transition:'transform 0.2s', 
              animation:`slideUp 0.4s ease ${i * 0.1}s both`,
              gridColumn: i === 0 ? 'span 2' : 'span 1'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ width: i===0?'56px':'48px', height: i===0?'56px':'48px', borderRadius:'16px', background:a.bg, color:a.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize: i===0?'32px':'24px', marginBottom: i===0?'0':'12px', marginRight: i===0?'16px':'0', border:`1px solid ${a.color}40`, boxShadow:`0 4px 12px ${a.bg}` }}>
              {a.icon}
            </div>
            <div style={{ flex: i===0?1:'none' }}>
              <div style={{ fontSize: i===0?'18px':'15px', fontWeight:'700', marginBottom:'4px' }}>{a.title}</div>
              <div style={{ fontSize:'12px', color:'var(--text-muted)', lineHeight:'1.3' }}>{a.desc}</div>
            </div>
            {i === 0 && <span style={{ color:'var(--text-muted)', fontSize:'24px', opacity:0.5 }}>›</span>}
          </button>
        ))}
      </div>
    </PageWrapper>
  );
}
