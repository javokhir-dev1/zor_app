import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', animation:'fadeIn 0.2s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:'480px', maxHeight:'85vh', background:'var(--bg-secondary)', borderRadius:'var(--radius-xl) var(--radius-xl) 0 0', padding:'var(--space-lg)', animation:'slideUp 0.3s ease', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--space-md)' }}>
          <h3 style={{ fontSize:'18px', fontWeight:'600' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'var(--bg-card)', border:'none', color:'var(--text-secondary)', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer', fontSize:'16px' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
