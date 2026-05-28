import { useEffect } from 'react';

export function Loader() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-primary)', gap:'16px' }}>
      <div style={{ width:'40px', height:'40px', border:'3px solid var(--border-glass)', borderTop:'3px solid var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:'var(--text-secondary)', fontSize:'14px' }}>Yuklanmoqda...</p>
    </div>
  );
}

export function InlineLoader({ size = 16 }) {
  return <div style={{ width:size, height:size, border:'2px solid rgba(255,255,255,0.2)', borderTop:'2px solid #fff', borderRadius:'50%', animation:'spin 0.6s linear infinite', display:'inline-block' }} />;
}

export function Skeleton({ width = '100%', height = '20px', radius = '8px' }) {
  return <div style={{ width, height, borderRadius:radius, background:'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />;
}

export default Loader;
