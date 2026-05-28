import { MdMovie, MdCheckCircle } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { showApi } from '../api/endpoints';
import PageWrapper from '../components/layout/PageWrapper';
import ShowCard from '../components/ShowCard';
import { Loader } from '../components/ui/Loader';

export default function ShowsPage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShows = () => { showApi.list().then(r => { setShows(r.data.shows); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(fetchShows, []);

  const handleBook = async (show) => {
    if (!confirm(`"${show.title}" ko'rsatuviga joy band qilmoqchimisiz?`)) return;
    try {
      await showApi.book(show.id);
      alert('✅ Joy band qilindi! Admin tasdiqlashini kuting.');
      fetchShows();
    } catch (e) { alert(e.response?.data?.error || 'Xatolik yuz berdi'); }
  };

  if (loading) return <Loader />;

  return (
    <PageWrapper title={<><MdMovie style={{verticalAlign:'middle'}}/> Ko'rsatuvlar</>} subtitle="Studio tadbirlariga yoziling">
      {shows.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text-muted)' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}><MdMovie /></div>
          <p>Hozircha ko'rsatuv yo'q</p>
        </div>
      ) : shows.map(s => <ShowCard key={s.id} show={s} onBook={handleBook} />)}
    </PageWrapper>
  );
}
