import { MdLiveTv, MdSettings, MdRadio, MdCheckCircle, MdSave } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Loader } from '../../components/ui/Loader';

const fadeIn = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default function SettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tvUrl, setTvUrl] = useState('');
  const [radioUrl, setRadioUrl] = useState('');

  useEffect(() => {
    adminApi.getAllSettings().then(r => {
      const s = r.data.settings;
      setSettings(s);
      setTvUrl(s.find(x => x.key === 'live_tv_url')?.value || '');
      setRadioUrl(s.find(x => x.key === 'radio_url')?.value || '');
    }).finally(() => setLoading(false));
  }, []);

  const save = async (key, value) => {
    await adminApi.updateSetting(key, value);
    alert('Saqlandi!');
  };

  if (loading) return <Loader />;

  const settingCards = [
    {
      icon: MdLiveTv,
      color: '#f44336',
      title: 'Jonli efir URL',
      desc: 'YouTube yoki boshqa platformadagi jonli efir havolasi',
      value: tvUrl,
      onChange: setTvUrl,
      settingKey: 'live_tv_url',
      placeholder: 'https://youtube.com/live/...'
    },
    {
      icon: MdRadio,
      color: '#4fc3f7',
      title: 'Radio URL',
      desc: 'Online radio stream havolasi',
      value: radioUrl,
      onChange: setRadioUrl,
      settingKey: 'radio_url',
      placeholder: 'https://stream.radio.co/...'
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <style>{fadeIn}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #ab47bc, #7b1fa2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(171,71,188,0.3)'
        }}>
          <MdSettings size={26} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>Sozlamalar</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0 0' }}>
            Tizim sozlamalarini boshqarish
          </p>
        </div>
      </div>

      {/* Settings cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {settingCards.map((card, i) => {
          const IconComp = card.icon;
          return (
            <div key={card.settingKey} style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              padding: '24px',
              animation: `slideUp 0.3s ease ${i * 0.1}s both`
            }}>
              {/* Card header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: `${card.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <IconComp size={22} color={card.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#fff' }}>{card.title}</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '3px 0 0 0' }}>{card.desc}</p>
                </div>
              </div>

              {/* Input + Save */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
                <input
                  value={card.value}
                  onChange={e => card.onChange(e.target.value)}
                  placeholder={card.placeholder}
                  style={{
                    flex: 1, padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none'
                  }}
                />
                <button
                  onClick={() => save(card.settingKey, card.value)}
                  style={{
                    padding: '12px 24px', background: 'var(--accent-gradient)',
                    border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '14px', whiteSpace: 'nowrap',
                    boxShadow: '0 2px 10px rgba(79,195,247,0.3)'
                  }}
                >
                  <MdSave size={18} /> Saqlash
                </button>
              </div>

              {/* Current value indicator */}
              {card.value && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px',
                  padding: '8px 14px', borderRadius: '10px',
                  background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.15)'
                }}>
                  <MdCheckCircle size={14} color="#4caf50" />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    Joriy qiymat o'rnatilgan
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* All settings overview */}
      {settings.length > 0 && (
        <div style={{
          marginTop: '24px',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          padding: '24px',
          animation: 'slideUp 0.3s ease 0.2s both'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '16px', margin: '0 0 16px 0' }}>
            Barcha sozlamalar
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {settings.map((s, i) => (
              <div key={s.key} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.04)'
              }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>{s.key}</span>
                <span style={{
                  fontSize: '13px', color: '#fff', fontWeight: '500',
                  maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  textAlign: 'right'
                }}>
                  {s.value || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
