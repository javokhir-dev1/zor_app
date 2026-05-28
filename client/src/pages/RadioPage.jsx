import { MdRadio, MdVolumeOff } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { settingsApi } from '../api/endpoints';
import PageWrapper from '../components/layout/PageWrapper';
import AudioPlayer from '../components/AudioPlayer';
import { Loader } from '../components/ui/Loader';

export default function RadioPage() {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsApi.getStreamUrls().then(r => { setUrl(r.data.radio_url); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <PageWrapper title={<><MdRadio style={{verticalAlign:'middle'}}/> Radio</>} subtitle="Zo'r Radio jonli efir">
      {url ? <AudioPlayer url={url} /> : (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text-muted)' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}><MdVolumeOff /></div>
          <p>Radio hozirda mavjud emas</p>
        </div>
      )}
    </PageWrapper>
  );
}
