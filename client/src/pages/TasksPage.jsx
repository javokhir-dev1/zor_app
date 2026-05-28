import { MdAssignment } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { taskApi } from '../api/endpoints';
import PageWrapper from '../components/layout/PageWrapper';
import TaskCard from '../components/TaskCard';
import SubmitTaskModal from '../components/SubmitTaskModal';
import { Loader } from '../components/ui/Loader';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = () => { taskApi.list().then(r => { setTasks(r.data.tasks); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(fetchTasks, []);

  const handleSubmit = async (taskId, formData) => {
    await taskApi.submit(taskId, formData);
    setSelectedTask(null);
    alert('✅ Javob yuborildi! Tekshirish kutilmoqda.');
    fetchTasks();
  };

  if (loading) return <Loader />;

  return (
    <PageWrapper title={<><MdAssignment style={{verticalAlign:'middle'}}/> Topshiriqlar</>} subtitle="Ball to'plang">
      {tasks.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text-muted)' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}><MdAssignment /></div>
          <p>Hozircha topshiriq yo'q</p>
        </div>
      ) : tasks.map(t => <TaskCard key={t.id} task={t} onSubmit={() => setSelectedTask(t)} />)}

      {selectedTask && (
        <SubmitTaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSubmitted={handleSubmit}
        />
      )}
    </PageWrapper>
  );
}
