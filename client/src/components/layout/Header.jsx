export default function Header({ title, subtitle }) {
  return (
    <div style={{ padding:'var(--space-lg) var(--space-md) var(--space-md)', textAlign:'center' }}>
      <h1 style={{ fontSize:'22px', fontWeight:'700', background:'var(--accent-gradient)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{title}</h1>
      {subtitle && <p style={{ color:'var(--text-secondary)', fontSize:'13px', marginTop:'4px' }}>{subtitle}</p>}
    </div>
  );
}
