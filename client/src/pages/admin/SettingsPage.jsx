import { MdLiveTv, MdSettings, MdRadio, MdCheckCircle, MdSave } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Loader } from '../../components/ui/Loader';

export default function SettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tvUrl, setTvUrl] = useState('');
  const [radioUrl, setRadioUrl] = useState('');

  useEffect(() => {
    adminApi.getAllSettings().then(r => {
      const s = r.data.settings;
      setSettings(s);
      setTvUrl(s.find(x=>x.key==='live_tv_url')?.value || '');
      setRadioUrl(s.find(x=>x.key==='radio_url')?.value || '');
    }).finally(() => setLoading(false));
  }, []);

  const save = async (key, value) => {
    await adminApi.updateSetting(key, value);
    alert('<MdCheckCircle /> Saqlandi!');
  };

  const inp = { padding:'10px', background:'var(--bg-card)', border:'1px solid var(--border-glass)', borderRadius:'8px', color:'var(--text-primary)', fontSize:'14px', outline:'none', width:'100%' };

  if (loading) return <Loader />;

  return (
    <div style={{ animation:'fadeIn 0.3s ease' }}>
      <h2 style={{ fontSize:'18px', fontWeight:'700', marginBottom:'16px' }}><MdSettings /> Sozlamalar</h2>

      <div style={{ background:'var(--bg-card)', borderRadius:'var(--radius-md)', padding:'16px', border:'1px solid var(--border-glass)', marginBottom:'16px' }}>
        <h3 style={{ fontSize:'14px', color:'var(--text-secondary)', marginBottom:'12px' }}><MdLiveTv /> Jonli efir URL</h3>
        <input value={tvUrl} onChange={e=>setTvUrl(e.target.value)} placeholder="https://stream.example.com/live/tv.m3u8" style={{...inp, marginBottom:'8px'}} />
        <button onClick={()=>save('live_tv_url', tvUrl)} style={{ padding:'8px 16px', background:'var(--accent-gradient)', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'600', cursor:'pointer', fontSize:'13px' }}><MdSave /> Saqlash</button>
      </div>

      <div style={{ background:'var(--bg-card)', borderRadius:'var(--radius-md)', padding:'16px', border:'1px solid var(--border-glass)', marginBottom:'16px' }}>
        <h3 style={{ fontSize:'14px', color:'var(--text-secondary)', marginBottom:'12px' }}><MdRadio /> Radio URL</h3>
        <input value={radioUrl} onChange={e=>setRadioUrl(e.target.value)} placeholder="https://stream.example.com/radio.mp3" style={{...inp, marginBottom:'8px'}} />
        <button onClick={()=>save('radio_url', radioUrl)} style={{ padding:'8px 16px', background:'var(--accent-gradient)', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'600', cursor:'pointer', fontSize:'13px' }}><MdSave /> Saqlash</button>
      </div>
    </div>
  );
}
