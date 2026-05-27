import { useEffect, useState } from 'react';
import { API } from '../api';

interface Student {
  id: number;
  name: string;
  student_no: string;
  class_id: number | null;
  class_name: string | null;
}
interface ClassItem { id: number; name: string; }

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [filterClass, setFilterClass] = useState('');
  const [form, setForm] = useState({ name: '', student_no: '', class_id: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadStudents = () => {
    const url = filterClass ? `${API}/students?class_id=${filterClass}` : `${API}/students`;
    fetch(url).then((r) => r.json()).then(setStudents);
  };
  const loadClasses = () => fetch(`${API}/classes`).then((r) => r.json()).then(setClasses);

  useEffect(() => { loadClasses(); }, []);
  useEffect(() => { loadStudents(); }, [filterClass]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.student_no.trim()) return;
    const body = { ...form, class_id: form.class_id ? Number(form.class_id) : null };
    if (editingId) {
      await fetch(`${API}/students/${editingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      setEditingId(null);
    } else {
      await fetch(`${API}/students`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
    }
    setForm({ name: '', student_no: '', class_id: '' });
    loadStudents();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除该学生？')) return;
    await fetch(`${API}/students/${id}`, { method: 'DELETE' });
    loadStudents();
  };

  const handleEdit = (s: Student) => {
    setForm({ name: s.name, student_no: s.student_no, class_id: s.class_id ? String(s.class_id) : '' });
    setEditingId(s.id);
  };

  return (
    <div>
      <h1>学生管理</h1>
      <div className="form-row">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="姓名" />
        <input value={form.student_no} onChange={(e) => setForm({ ...form, student_no: e.target.value })} placeholder="学号" />
        <select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}>
          <option value="">未分班</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn primary" onClick={handleSubmit}>{editingId ? '更新' : '添加'}</button>
        {editingId && <button className="btn" onClick={() => { setEditingId(null); setForm({ name: '', student_no: '', class_id: '' }); }}>取消</button>}
      </div>

      <div className="filter-row">
        <label>按班级筛选：</label>
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="">全部</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr><th>ID</th><th>姓名</th><th>学号</th><th>班级</th><th>操作</th></tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.student_no}</td>
              <td>{s.class_name || '未分班'}</td>
              <td>
                <button className="btn small" onClick={() => handleEdit(s)}>编辑</button>
                <button className="btn small danger" onClick={() => handleDelete(s.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
