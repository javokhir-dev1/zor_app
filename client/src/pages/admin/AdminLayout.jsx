import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MdDashboard, MdPeople, MdAssignment, MdLibraryBooks, MdMovie, MdSettings, MdEmail, MdStars } from 'react-icons/md';

const navItems = [
  { path:'/admin', icon:<MdDashboard />, label:'Dashboard', end:true },
  { path:'/admin/users', icon:<MdPeople />, label:'Foydalanuvchilar' },
  { path:'/admin/tasks', icon:<MdAssignment />, label:'Topshiriqlar' },
  { path:'/admin/submissions', icon:<MdLibraryBooks />, label:'Isbotlar' },
  { path:'/admin/shows', icon:<MdMovie />, label:"Ko'rsatuvlar" },
  { path:'/admin/settings', icon:<MdSettings />, label:'Sozlamalar' },
  { path:'/admin/mailing', icon:<MdEmail />, label:'Mailing' },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#0a0a1a', color:'#ffffff' }}>
      {/* Top header */}
      <header style={{ padding:'12px 16px', background:'#12122a', borderBottom:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 }}>
        <h1 style={{ fontSize:'16px', fontWeight:'700', color:'#a29bfe' }}><MdSettings /> Admin Panel</h1>
        <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.5)' }}><MdStars /> {user?.full_name || 'Admin'}</span>
      </header>


      {/* Horizontal nav */}
      <nav style={{ display:'flex', gap:'4px', padding:'8px 12px', overflowX:'auto', background:'#12122a', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} end={item.end} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'20px',
            background: isActive ? '#6c5ce7' : 'rgba(255,255,255,0.05)', color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
            fontSize:'13px', fontWeight: isActive ? '600' : '400', whiteSpace:'nowrap', textDecoration:'none',
            border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)', transition:'all 0.2s',
          })}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Content */}
      <main style={{ flex:1, padding:'16px', maxWidth:'960px', width:'100%', margin:'0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
