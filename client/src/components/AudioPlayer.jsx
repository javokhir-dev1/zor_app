import { MdRadio, MdPause } from 'react-icons/md';
import { useState, useRef } from 'react';

export default function AudioPlayer({ url }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play().catch(() => {}); }
    setPlaying(!playing);
  };

  return (
    <div style={{ background:'var(--bg-card)', borderRadius:'var(--radius-lg)', padding:'var(--space-xl)', textAlign:'center', border:'1px solid var(--border-glass)', backdropFilter:'blur(10px)' }}>
      <audio ref={audioRef} src={url} preload="none" />
      <div style={{ fontSize:'32px', marginBottom:'12px' }}><MdRadio /></div>
      <h3 style={{ marginBottom:'4px' }}>Zo'r Radio</h3>
      <p style={{ color:'var(--text-muted)', fontSize:'13px', marginBottom:'24px' }}>{playing ? '🔴 Jonli efirda' : 'Tinglash uchun bosing'}</p>
      <button onClick={toggle} style={{ width:'72px', height:'72px', borderRadius:'50%', border:'none', background:'var(--accent-gradient)', color:'#fff', fontSize:'28px', cursor:'pointer', boxShadow: playing ? 'var(--shadow-glow)' : 'var(--shadow-md)', transition:'all 0.3s', animation: playing ? 'pulse 2s infinite' : 'none' }}>
        {playing ? <MdPause /> : '▶'}
      </button>
    </div>
  );
}
