import { useLocation, useNavigate } from 'react-router-dom';
import { MdHome, MdLiveTv, MdAssignment, MdLeaderboard, MdPerson } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';

const tabs = [
  { path: '/', icon: <MdHome size={22} />, label: 'Asosiy' },
  { path: '/live-tv', icon: <MdLiveTv size={22} />, label: 'Efir' },
  { path: '/tasks', icon: <MdAssignment size={22} />, label: 'Vazifalar' },
  { path: '/leaderboard', icon: <MdLeaderboard size={22} />, label: 'Reyting' },
  { path: '/profile', icon: <MdPerson size={22} />, label: 'Profil' },
];

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:100, background:'rgba(10,10,26,0.85)', backdropFilter:'blur(20px)', borderTop:'1px solid var(--border-glass)', paddingBottom:'var(--safe-bottom)' }}>
      <div style={{ display:'flex', justifyContent:'space-around', maxWidth:'480px', margin:'0 auto', padding:'8px 0 4px' }}>
        {tabs.map(tab => {
          const active = location.pathname === tab.path;
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', background:'none', border:'none', cursor:'pointer', padding:'4px 12px', transition:'transform 0.2s', transform: active ? 'scale(1.1)' : 'scale(1)' }}>
              <span style={{ fontSize:'20px', color: active ? 'var(--accent-light)' : 'var(--text-muted)', filter: active ? 'none' : 'grayscale(0.5) opacity(0.6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {tab.path === '/profile' && user?.photo_url ? (
                  <img src={user.photo_url} alt="Profile" style={{ width:'22px', height:'22px', borderRadius:'50%', objectFit:'cover', border: active ? '2px solid var(--accent-light)' : '1px solid var(--border-glass)' }} />
                ) : (
                  tab.icon
                )}
              </span>
              <span style={{ fontSize:'10px', fontWeight: active ? '600' : '400', color: active ? 'var(--accent-light)' : 'var(--text-muted)' }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
