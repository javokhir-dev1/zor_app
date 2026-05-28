import { MdAssignment, MdCheckCircle } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { taskApi } from '../api/endpoints';
import PageWrapper from '../components/layout/PageWrapper';
import TaskCard from '../components/TaskCard';
import { Loader } from '../components/ui/Loader';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = () => { taskApi.list().then(r => { setTasks(r.data.tasks); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(fetchTasks, []);

  const handleSubmit = async (task) => {
    const text = prompt(`"${task.title}" topshirig'ini bajarish uchun javobingizni kiriting:`);
    if (!text) return;
    try {
      await taskApi.submit(task.id, { text });
      alert('✅ Javob yuborildi! Tekshirish kutilmoqda.');
      fetchTasks();
    } catch (e) { alert(e.response?.data?.error || 'Xatolik yuz berdi'); }
  };

  if (loading) return <Loader />;

  return (
    <PageWrapper title={<><MdAssignment style={{verticalAlign:'middle'}}/> Topshiriqlar</>} subtitle="Ball to'plang">
      {tasks.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text-muted)' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>📋</div>
          <p>Hozircha topshiriq yo'q</p>
        </div>
      ) : tasks.map(t => <TaskCard key={t.id} task={t} onSubmit={handleSubmit} />)}
    </PageWrapper>
  );
}
