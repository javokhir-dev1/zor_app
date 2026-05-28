import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MdDashboard, MdPeople, MdAssignment, MdLibraryBooks, MdMovie, MdSettings, MdEmail, MdLogout, MdArrowBack } from 'react-icons/md';

const navItems = [
  { path:'/admin', icon:<MdDashboard size={18} />, label:'Dashboard', end:true, color:'#6c5ce7' },
  { path:'/admin/users', icon:<MdPeople size={18} />, label:'Foydalanuvchilar', color:'#1e90ff' },
  { path:'/admin/tasks', icon:<MdAssignment size={18} />, label:'Topshiriqlar', color:'#2ed573' },
  { path:'/admin/submissions', icon:<MdLibraryBooks size={18} />, label:'Isbotlar', color:'#ffa502' },
  { path:'/admin/shows', icon:<MdMovie size={18} />, label:"Ko'rsatuvlar", color:'#9b59b6' },
  { path:'/admin/settings', icon:<MdSettings size={18} />, label:'Sozlamalar', color:'#636e72' },
  { path:'/admin/mailing', icon:<MdEmail size={18} />, label:'Mailing', color:'#ff4757' },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#0a0a1a', color:'#fff' }}>
      
      {/* Header */}
      <header style={{ 
        padding:'16px 20px', 
        background:'linear-gradient(135deg, rgba(108,92,231,0.12) 0%, rgba(162,155,254,0.04) 100%)', 
        borderBottom:'1px solid rgba(108,92,231,0.15)', 
        display:'flex', alignItems:'center', justifyContent:'space-between', 
        position:'sticky', top:0, zIndex:50,
        backdropFilter:'blur(20px)'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <a href="/" style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'32px', height:'32px', borderRadius:'8px', background:'rgba(255,255,255,0.06)', color:'var(--text-muted)', textDecoration:'none', fontSize:'18px' }}>
            <MdArrowBack />
          </a>
          <div>
            <h1 style={{ fontSize:'16px', fontWeight:'800', background:'linear-gradient(135deg, #a29bfe, #6c5ce7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:0, lineHeight:1.2 }}>Admin Panel</h1>
            <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', margin:0 }}>Zo'r TV boshqaruv</p>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'12px', fontWeight:'600', color:'rgba(255,255,255,0.8)' }}>{user?.full_name || 'Admin'}</div>
            <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)' }}>Administrator</div>
          </div>
          <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'linear-gradient(135deg, #6c5ce7, #a29bfe)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'700' }}>
            {(user?.full_name || 'A')[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ 
        display:'flex', gap:'6px', padding:'10px 16px', 
        overflowX:'auto', 
        background:'rgba(10,10,26,0.95)', 
        borderBottom:'1px solid rgba(255,255,255,0.04)',
        msOverflowStyle:'none', scrollbarWidth:'none',
      }}>
        {navItems.map(item => {
          const isActive = item.end 
            ? location.pathname === item.path 
            : location.pathname.startsWith(item.path);
          return (
            <NavLink key={item.path} to={item.path} end={item.end} style={{
              display:'flex', alignItems:'center', gap:'7px', 
              padding:'8px 14px', borderRadius:'12px',
              background: isActive 
                ? `linear-gradient(135deg, ${item.color}25, ${item.color}10)` 
                : 'transparent', 
              color: isActive ? item.color : 'rgba(255,255,255,0.45)',
              fontSize:'13px', fontWeight: isActive ? '700' : '500', 
              whiteSpace:'nowrap', textDecoration:'none',
              border: isActive ? `1px solid ${item.color}35` : '1px solid transparent',
              transition:'all 0.2s',
            }}>
              <span style={{ display:'flex' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Content */}
      <main style={{ flex:1, padding:'20px 16px', maxWidth:'960px', width:'100%', margin:'0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
