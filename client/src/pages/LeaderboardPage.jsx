import { MdLeaderboard } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { userApi } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';
import PageWrapper from '../components/layout/PageWrapper';
import LeaderRow from '../components/LeaderRow';
import { Loader } from '../components/ui/Loader';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { userApi.getLeaderboard().then(r => { setLeaders(r.data.leaderboard); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <Loader />;

  return (
    <PageWrapper title={<><MdLeaderboard style={{verticalAlign:'middle'}}/> Reyting</>} subtitle="Top-100 fan-klub a'zolari">
      {leaders.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text-muted)' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}><MdLeaderboard /></div>
          <p>Reyting hali shakllanmagan</p>
        </div>
      ) : leaders.map(l => <LeaderRow key={l.id} {...l} isCurrentUser={l.id === user?.id} />)}
    </PageWrapper>
  );
}
