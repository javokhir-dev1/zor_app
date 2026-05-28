import { MdPerson, MdMovie, MdCheckCircle, MdCancel, MdEvent, MdPhoneIphone, MdCameraAlt, MdRefresh } from 'react-icons/md';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { guardApi } from '../../api/admin';

export default function GuardPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const scannerRef = useRef(null);
  const scannerContainerId = 'qr-reader';

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) { // SCANNING
          await scannerRef.current.stop();
        }
      } catch (e) { /* ignore */ }
    }
  }, []);

  const verifyCode = useCallback(async (code) => {
    if (!code || loading) return;
    setLoading(true);
    setResult(null);
    await stopScanner();
    try {
      const r = await guardApi.verifyQR(code);
      setResult({ success: true, data: r.data });
    } catch (e) {
      setResult({ success: false, error: e.response?.data?.error || 'Xatolik yuz berdi' });
    } finally {
      setLoading(false);
    }
  }, [loading, stopScanner]);

  const startScanner = useCallback(async () => {
    setResult(null);
    setCameraReady(false);

    await new Promise(r => setTimeout(r, 300));

    const container = document.getElementById(scannerContainerId);
    if (!container) return;

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(scannerContainerId);
    }

    try {
      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
        (decodedText) => {
          verifyCode(decodedText);
        },
        () => {}
      );
      setCameraReady(true);
    } catch (err) {
      console.error('Camera error:', err);
      setResult({ success: false, error: 'Kameraga ruxsat berilmadi yoki kamera topilmadi.' });
    }
  }, [verifyCode]);

  useEffect(() => {
    if (!result) {
      startScanner();
    }
    return () => { stopScanner(); };
  }, [result, startScanner, stopScanner]);

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-primary)', display:'flex', flexDirection:'column', alignItems:'center', padding:'24px', paddingTop:'48px' }}>
      
      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:'28px' }}>
        <div style={{ width:'64px', height:'64px', borderRadius:'18px', background:'linear-gradient(135deg, rgba(108,92,231,0.2), rgba(162,155,254,0.1))', border:'1px solid rgba(108,92,231,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:'28px', color:'var(--accent-light)' }}>
          <MdCameraAlt />
        </div>
        <h1 style={{ fontSize:'24px', fontWeight:'800', background:'var(--accent-gradient)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>QR Skaner</h1>
        <p style={{ color:'var(--text-muted)', fontSize:'14px', marginTop:'6px' }}>Chipta QR-kodini skanerlang</p>
      </div>

      <div style={{ width:'100%', maxWidth:'400px' }}>

        {/* Camera Scanner */}
        {!result && !loading && (
          <div style={{ borderRadius:'24px', overflow:'hidden', border:'2px solid rgba(108,92,231,0.3)', boxShadow:'0 16px 40px rgba(0,0,0,0.3)', position:'relative' }}>
            <div id={scannerContainerId} style={{ width:'100%' }} />
            {!cameraReady && (
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(10,10,26,0.9)', flexDirection:'column', gap:'12px' }}>
                <div style={{ width:'32px', height:'32px', border:'3px solid var(--accent-light)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                <span style={{ color:'var(--text-muted)', fontSize:'14px' }}>Kamera yuklanmoqda...</span>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:'center', padding:'40px 0' }}>
            <div style={{ width:'40px', height:'40px', border:'3px solid var(--accent-light)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
            <p style={{ color:'var(--text-muted)', fontSize:'14px' }}>Tekshirilmoqda...</p>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div style={{ animation:'scaleIn 0.3s ease' }}>
            {result.success ? (
              <div style={{ background:'linear-gradient(145deg, rgba(46,213,115,0.12), rgba(46,213,115,0.04))', borderRadius:'24px', padding:'28px 20px', border:'1px solid rgba(46,213,115,0.3)', textAlign:'center' }}>
                <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'rgba(46,213,115,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:'#2ed573', fontSize:'40px' }}>
                  <MdCheckCircle />
                </div>
                <h3 style={{ color:'#2ed573', fontSize:'20px', fontWeight:'800', marginBottom:'20px' }}>Kirish ruxsat etildi!</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px', textAlign:'left' }}>
                  {[
                    { icon:<MdPerson />, label:'Ism', value:result.data.user?.full_name, color:'#1e90ff' },
                    { icon:<MdPhoneIphone />, label:'Telefon', value:result.data.user?.phone, color:'#ff4757' },
                    { icon:<MdMovie />, label:'Ko\'rsatuv', value:result.data.show?.title, color:'#9b59b6' },
                    { icon:<MdEvent />, label:'Sana', value: result.data.show?.show_date && new Date(result.data.show.show_date).toLocaleString('uz'), color:'#2ed573' },
                  ].map(item => (
                    <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px', background:'rgba(255,255,255,0.05)', borderRadius:'12px' }}>
                      <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:`${item.color}18`, color:item.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{item.label}</div>
                        <div style={{ fontSize:'14px', fontWeight:'600' }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background:'linear-gradient(145deg, rgba(255,71,87,0.12), rgba(255,71,87,0.04))', borderRadius:'24px', padding:'28px 20px', border:'1px solid rgba(255,71,87,0.3)', textAlign:'center' }}>
                <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'rgba(255,71,87,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:'#ff4757', fontSize:'40px' }}>
                  <MdCancel />
                </div>
                <h3 style={{ color:'#ff4757', fontSize:'20px', fontWeight:'800', marginBottom:'8px' }}>Kirish rad etildi</h3>
                <p style={{ color:'var(--text-secondary)', fontSize:'14px' }}>{result.error}</p>
              </div>
            )}

            <button 
              onClick={handleReset} 
              style={{ width:'100%', marginTop:'16px', padding:'14px', background:'var(--accent-gradient)', border:'none', borderRadius:'16px', color:'#fff', fontWeight:'700', fontSize:'15px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}
            >
              <MdRefresh size={20} /> Keyingi chipta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
