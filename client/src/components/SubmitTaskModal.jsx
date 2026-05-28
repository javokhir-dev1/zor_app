import { MdClose, MdAddPhotoAlternate, MdSend, MdDelete } from 'react-icons/md';
import { useState, useRef } from 'react';

export default function SubmitTaskModal({ task, onClose, onSubmitted }) {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]); // { file, preview }[]
  const [sending, setSending] = useState(false);
  const fileRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - images.length;
    const toAdd = files.slice(0, remaining).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...toAdd]);
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async () => {
    if (!text.trim() && images.length === 0) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('text', text.trim());
      images.forEach(img => formData.append('images', img.file));
      await onSubmitted(task.id, formData);
    } catch (e) {
      alert(e.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          maxWidth: '500px', width: '100%', margin: '0 auto',
          padding: '0 16px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <button onClick={onClose} style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MdClose />
          </button>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' }}>Topshiriq bajarish</h3>
          <div style={{ width: '40px' }} />
        </div>

        {/* Task Info */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(108,92,231,0.15), rgba(108,92,231,0.05))',
          borderRadius: '16px', padding: '16px',
          border: '1px solid rgba(108,92,231,0.2)', marginBottom: '16px',
        }}>
          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{task.title}</h4>
          {task.description && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4', margin: 0 }}>{task.description}</p>}
          <div style={{ fontSize: '12px', color: '#ffa502', fontWeight: '600', marginTop: '8px' }}>⭐ {task.reward_points} ball</div>
        </div>

        {/* Text Input */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Javobingizni yozing..."
          rows={4}
          style={{
            width: '100%', padding: '14px 16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', color: '#fff', fontSize: '14px',
            outline: 'none', resize: 'vertical', marginBottom: '12px',
            lineHeight: '1.5', boxSizing: 'border-box',
          }}
        />

        {/* Image Previews */}
        {images.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={img.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => removeImage(i)}
                  style={{
                    position: 'absolute', top: '4px', right: '4px',
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: 'rgba(255,71,87,0.9)', border: 'none',
                    color: '#fff', fontSize: '14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <MdDelete size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingBottom: '24px' }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={images.length >= 5}
            style={{
              width: '52px', height: '52px', borderRadius: '16px',
              background: images.length >= 5 ? 'rgba(255,255,255,0.05)' : 'rgba(108,92,231,0.15)',
              border: '1px solid rgba(108,92,231,0.25)',
              color: images.length >= 5 ? 'rgba(255,255,255,0.2)' : '#a29bfe',
              fontSize: '22px', cursor: images.length >= 5 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <MdAddPhotoAlternate />
          </button>
          <button
            onClick={handleSubmit}
            disabled={sending || (!text.trim() && images.length === 0)}
            style={{
              flex: 1, height: '52px', borderRadius: '16px',
              background: sending || (!text.trim() && images.length === 0) ? 'rgba(255,255,255,0.08)' : 'var(--accent-gradient)',
              border: 'none', color: '#fff', fontWeight: '700', fontSize: '15px',
              cursor: sending ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: (!text.trim() && images.length === 0) ? 0.4 : 1,
            }}
          >
            {sending ? (
              <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Yuborilmoqda...</>
            ) : (
              <><MdSend /> Yuborish {images.length > 0 && `(${images.length} rasm)`}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
