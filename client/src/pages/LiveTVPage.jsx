import { MdLiveTv, MdWifiOff } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { settingsApi } from '../api/endpoints';
import PageWrapper from '../components/layout/PageWrapper';
import LivePlayer from '../components/LivePlayer';
import { Loader } from '../components/ui/Loader';

export default function LiveTVPage() {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsApi.getStreamUrls().then(r => { setUrl(r.data.live_tv_url); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <PageWrapper title={<><MdLiveTv style={{verticalAlign:'middle'}}/> Jonli efir</>} subtitle="Zo'r TV to'g'ridan-to'g'ri">
      {url ? <LivePlayer url={url} /> : (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text-muted)' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}><MdWifiOff /></div>
          <p>Efir hozirda mavjud emas</p>
        </div>
      )}
    </PageWrapper>
  );
}
