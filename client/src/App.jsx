import { MdWarning } from 'react-icons/md';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Loader } from './components/ui/Loader';
import BottomNav from './components/layout/BottomNav';
import { Component } from 'react';

// Error Boundary
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('[ErrorBoundary]', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding:'24px', color:'#e17055', background:'#0a0a1a', minHeight:'100vh', fontFamily:'monospace' }}>
          <h2><MdWarning /> React xatolik</h2>
          <pre style={{ fontSize:'12px', background:'#1a1a2e', padding:'12px', borderRadius:'8px', overflow:'auto', marginTop:'12px', color:'#ddd', whiteSpace:'pre-wrap' }}>
            {this.state.error?.message}{'\n'}{this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// User Pages
import HomePage from './pages/HomePage';
import LiveTVPage from './pages/LiveTVPage';
import RadioPage from './pages/RadioPage';
import TasksPage from './pages/TasksPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ShowsPage from './pages/ShowsPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import TasksAdminPage from './pages/admin/TasksAdminPage';
import SubmissionsPage from './pages/admin/SubmissionsPage';
import ShowsAdminPage from './pages/admin/ShowsAdminPage';
import SettingsPage from './pages/admin/SettingsPage';
import MailingPage from './pages/admin/MailingPage';

// Guard Page
import GuardPage from './pages/guard/GuardPage';



function AppContent() {
  const { loading, error, user, isAuthenticated, retry } = useAuth();

  if (loading) return <Loader />;

  if (error) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', padding:'24px', textAlign:'center', background:'#0a0a1a', color:'#fff' }}>
        <div style={{ fontSize:'48px', marginBottom:'16px' }}><MdWarning /></div>
        <h2 style={{ marginBottom:'8px' }}>Xatolik yuz berdi</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', marginBottom:'24px', maxWidth:'300px' }}>{error}</p>
        <button onClick={retry} style={{ padding:'12px 32px', background:'linear-gradient(135deg, #6c5ce7, #a29bfe)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'16px', fontWeight:'600', cursor:'pointer' }}>Qaytadan urinish</button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', padding:'24px', textAlign:'center', background:'#0a0a1a', color:'#fff' }}>
        <div style={{ fontSize:'48px', marginBottom:'16px' }}>🔒</div>
        <h2 style={{ marginBottom:'8px' }}>Avtorizatsiya kerak</h2>
        <p style={{ color:'rgba(255,255,255,0.6)' }}>Iltimos, bot orqali ro'yxatdan o'ting.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<><HomePage /><BottomNav /></>} />
          <Route path="/live-tv" element={<><LiveTVPage /><BottomNav /></>} />
          <Route path="/radio" element={<><RadioPage /><BottomNav /></>} />
          <Route path="/tasks" element={<><TasksPage /><BottomNav /></>} />
          <Route path="/leaderboard" element={<><LeaderboardPage /><BottomNav /></>} />
          <Route path="/shows" element={<><ShowsPage /><BottomNav /></>} />
          <Route path="/profile" element={<><ProfilePage /><BottomNav /></>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="tasks" element={<TasksAdminPage />} />
            <Route path="submissions" element={<SubmissionsPage />} />
            <Route path="shows" element={<ShowsAdminPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="mailing" element={<MailingPage />} />
          </Route>

          {/* Guard Route */}
          <Route path="/guard" element={<GuardPage />} />

          {/* 404 */}
          <Route path="*" element={
            <div style={{ padding:'48px', textAlign:'center', color:'#fff', background:'#0a0a1a', minHeight:'100vh' }}>
              <h2>404 — Sahifa topilmadi</h2>
              <p style={{ color:'rgba(255,255,255,0.5)', marginTop:'8px' }}>URL: {window.location.pathname}</p>
            </div>
          } />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
