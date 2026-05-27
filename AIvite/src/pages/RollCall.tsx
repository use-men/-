import { useEffect, useState } from 'react';
import { API } from '../api';

interface Student { id: number; name: string; student_no: string; }
interface ClassItem { id: number; name: string; }
type Status = 'present' | 'absent' | 'late' | 'leave';

const statusLabels: Record<Status, string> = {
  present: '出席', absent: '缺席', late: '迟到', leave: '请假',
};
const statusColors: Record<Status, string> = {
  present: '#22c55e', absent: '#ef4444', late: '#f59e0b', leave: '#6b7280',
};

export default function RollCall() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [statuses, setStatuses] = useState<Record<number, Status>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`${API}/classes`).then((r) => r.json()).then(setClasses);
  }, []);

  useEffect(() => {
    if (!selectedClass) { setStudents([]); setStatuses({}); return; }
    fetch(`${API}/students?class_id=${selectedClass}`)
      .then((r) => r.json())
      .then((list: Student[]) => {
        setStudents(list);
        const init: Record<number, Status> = {};
        list.forEach((s) => { init[s.id] = 'present'; });
        setStatuses(init);
        setSubmitted(false);
      });
  }, [selectedClass]);

  const toggle = (id: number, status: Status) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !students.length) return;
    const today = new Date().toISOString().slice(0, 10);
    const records = students.map((s) => ({ student_id: s.id, status: statuses[s.id] || 'present' }));
    await fetch(`${API}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: selectedClass, date: today, records }),
    });
    setSubmitted(true);
  };

  return (
    <div>
      <h1>开始点名</h1>
      <div className="form-row">
        <label>选择班级：</label>
        <select value={selectedClass ?? ''} onChange={(e) => setSelectedClass(Number(e.target.value) || null)}>
          <option value="">请选择班级</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {students.length > 0 && (
        <>
          <div className="roll-call-grid">
            {students.map((s) => (
              <div key={s.id} className="roll-card" style={{ borderColor: statusColors[statuses[s.id]] }}>
                <div className="roll-name">{s.name}</div>
                <div className="roll-no">{s.student_no}</div>
                <div className="roll-buttons">
                  {(Object.keys(statusLabels) as Status[]).map((st) => (
                    <button
                      key={st}
                      className={`roll-btn ${statuses[s.id] === st ? 'active' : ''}`}
                      style={statuses[s.id] === st ? { backgroundColor: statusColors[st], color: '#fff' } : {}}
                      onClick={() => toggle(s.id, st)}
                    >
                      {statusLabels[st]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="submit-row">
            <button className="btn primary large" onClick={handleSubmit}>
              {submitted ? '已提交，点击重新提交' : '提交点名'}
            </button>
          </div>
        </>
      )}

      {selectedClass && students.length === 0 && <p className="empty-hint">该班级暂无学生，请先添加学生。</p>}
    </div>
  );
}
