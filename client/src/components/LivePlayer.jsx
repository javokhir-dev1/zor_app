import { MdRefresh } from 'react-icons/md';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { MdPlayArrow, MdPause, MdVolumeUp, MdVolumeOff, MdFullscreen, MdFullscreenExit, MdWifiOff } from 'react-icons/md';

/**
 * LivePlayer — HLS video pleyer komponenti
 * Safari uchun native HLS, boshqa brauzerlar uchun hls.js ishlatadi
 */
const LivePlayer = ({ url, poster }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const wrapperRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimeout = useRef(null);

  // HLS oqimini boshlash
  const initPlayer = useCallback(() => {
    if (!url || !videoRef.current) return;

    setLoading(true);
    setError(null);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const video = videoRef.current;
    
    // Play voqeasini kuzatish (custom tugma uchun)
    video.onplay = () => setPlaying(true);
    video.onpause = () => setPlaying(false);
    video.onvolumechange = () => setMuted(video.muted);

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(() => setPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError('Jonli efirga ulanib bo\'lmadi');
          setLoading(false);
          hls.destroy();
        }
      });
      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        setLoading(false);
        video.play().catch(() => setPlaying(false));
      });
      video.addEventListener('error', () => {
        setError('Jonli efirga ulanib bo\'lmadi');
        setLoading(false);
      });
    } else {
      setError('Brauzeringiz HLS formatini qo\'llab-quvvatlamaydi');
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    initPlayer();
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [initPlayer]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    // Telegram fullscreen events
    const onTgFullscreen = () => {
      const isFull = !!tg?.isFullscreen;
      setIsFullscreen(isFull);
      setCssFullscreen(isFull); // Video wrapper ham kengayishi kerak
    };
    if (tg) {
      tg.onEvent?.('fullscreenChanged', onTgFullscreen);
      tg.onEvent?.('fullscreenFailed', () => {
        // Telegram native failed — CSS fullscreen only
        setCssFullscreen(true);
        setIsFullscreen(true);
      });
    }

    // Browser fullscreen events
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) setCssFullscreen(false);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (tg) {
        tg.offEvent?.('fullscreenChanged', onTgFullscreen);
      }
    };
  }, []);

  const [cssFullscreen, setCssFullscreen] = useState(false);

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    const tg = window.Telegram?.WebApp;

    if (isFullscreen) {
      // Exit fullscreen
      setCssFullscreen(false);
      setIsFullscreen(false);
      if (tg?.exitFullscreen) {
        tg.exitFullscreen();
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    } else {
      // Enter fullscreen — CSS always applies, + Telegram/Browser API if available
      setCssFullscreen(true);
      setIsFullscreen(true);
      if (tg?.requestFullscreen) {
        tg.requestFullscreen();
      } else if (wrapperRef.current?.requestFullscreen) {
        wrapperRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  const handleRetry = () => initPlayer();

  const togglePlay = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(()=>{});
    } else {
      video.pause();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  const wrapperStyle = cssFullscreen ? {
    ...styles.wrapper,
    position: 'fixed',
    inset: 0,
    zIndex: 99999,
    borderRadius: 0,
    aspectRatio: 'unset',
    width: '100vw',
    height: '100vh',
  } : styles.wrapper;

  return (
    <div 
      ref={wrapperRef}
      style={wrapperStyle} 
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        style={styles.video}
        onClick={togglePlay}
      />

      {loading && !error && (
        <div style={styles.overlay}>
          <div style={styles.spinner} />
          <p style={styles.overlayText}>Jonli efir yuklanmoqda...</p>
        </div>
      )}

      {error && (
        <div style={styles.overlay}>
          <div style={styles.errorIcon}><MdWifiOff size={48} /></div>
          <p style={styles.errorText}>{error}</p>
          <button onClick={handleRetry} style={styles.retryBtn}><MdRefresh /> Qayta urinish</button>
        </div>
      )}

      {/* Custom Controls */}
      {!loading && !error && (
        <div style={{
          ...styles.controlsContainer,
          opacity: showControls || !playing ? 1 : 0,
          pointerEvents: showControls || !playing ? 'auto' : 'none'
        }}>
          {/* Top LIVE badge */}
          <div style={styles.topControls}>
            <div style={styles.liveBadge}>
              <span style={styles.liveDot} /> JONLI EFIR
            </div>
          </div>
          
          {/* Bottom Controls */}
          <div style={styles.bottomControls}>
            <button onClick={togglePlay} style={styles.controlBtn}>
              {playing ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
            </button>
            <button onClick={toggleMute} style={styles.controlBtn}>
              {muted ? <MdVolumeOff size={22} /> : <MdVolumeUp size={22} />}
            </button>
            <div style={{ flex: 1 }} />
            <button onClick={toggleFullscreen} style={styles.controlBtn}>
              {isFullscreen ? <MdFullscreenExit size={24} /> : <MdFullscreen size={24} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    background: '#000',
    aspectRatio: '16 / 9',
  },
  video: {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(8px)',
    zIndex: 2,
    gap: '12px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,255,255,0.15)',
    borderTop: '3px solid var(--accent, #6C5CE7)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  overlayText: { color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 },
  errorIcon: { fontSize: '48px', marginBottom: '8px' },
  errorText: { color: 'rgba(255,255,255,0.8)', fontSize: '15px', margin: 0, textAlign: 'center', padding: '0 20px' },
  retryBtn: { marginTop: '8px', padding: '10px 24px', background: 'var(--accent, #6C5CE7)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  
  // Custom Controls Styles
  controlsContainer: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.8) 100%)',
    transition: 'opacity 0.3s ease',
    zIndex: 1,
  },
  topControls: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  liveBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,59,48,0.9)',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    boxShadow: '0 2px 8px rgba(255,59,48,0.4)',
  },
  liveDot: {
    width: '6px',
    height: '6px',
    background: '#fff',
    borderRadius: '50%',
    animation: 'pulse 1.5s infinite',
  },
  bottomControls: {
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  controlBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'background 0.2s, transform 0.1s',
    fontSize: '16px',
  },
};

// Global animatsiyalar
if (typeof document !== 'undefined' && !document.getElementById('live-player-keyframes')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'live-player-keyframes';
  styleEl.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
  `;
  document.head.appendChild(styleEl);
}

export default LivePlayer;
