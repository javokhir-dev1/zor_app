import { MdStar } from 'react-icons/md';
const medals = { 1:'🥇', 2:'🥈', 3:'🥉' };

export default function LeaderRow({ rank, full_name, username, score, isCurrentUser }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px var(--space-md)', background: isCurrentUser ? 'rgba(108,92,231,0.15)' : 'var(--bg-card)', borderRadius:'var(--radius-md)', border: isCurrentUser ? '1px solid var(--accent)' : '1px solid transparent', marginBottom:'8px', animation:'fadeIn 0.3s ease' }}>
      <div style={{ width:'36px', textAlign:'center', fontSize: rank <= 3 ? '22px' : '14px', fontWeight:'700', color: rank <= 3 ? 'inherit' : 'var(--text-muted)' }}>{medals[rank] || rank}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'14px', fontWeight:'600', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{full_name}</div>
        {username && <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>@{username}</div>}
      </div>
      <div style={{ fontSize:'14px', fontWeight:'700', color:'var(--gold)' }}><MdStar /> {score}</div>
    </div>
  );
}
