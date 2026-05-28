import Header from './Header';

export default function PageWrapper({ children, title, subtitle }) {
  return (
    <div style={{ maxWidth:'480px', margin:'0 auto', padding:'0 var(--space-md) var(--space-md)', minHeight:'100vh', animation:'fadeIn 0.3s ease' }}>
      {title && <Header title={title} subtitle={subtitle} />}
      {children}
    </div>
  );
}
