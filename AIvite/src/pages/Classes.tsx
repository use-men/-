import { useEffect, useState } from 'react';
import { API } from '../api';

interface ClassItem {
  id: number;
  name: string;
}

export default function Classes() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = () => fetch(`${API}/classes`).then((r) => r.json()).then(setClasses);
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    if (editingId) {
      await fetch(`${API}/classes/${editingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }),
      });
      setEditingId(null);
    } else {
      await fetch(`${API}/classes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }),
      });
    }
    setName('');
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除该班级？')) return;
    await fetch(`${API}/classes/${id}`, { method: 'DELETE' });
    load();
  };

  const handleEdit = (cls: ClassItem) => {
    setName(cls.name);
    setEditingId(cls.id);
  };

  return (
    <div>
      <h1>班级管理</h1>
      <div className="form-row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="输入班级名称" />
        <button className="btn primary" onClick={handleSubmit}>{editingId ? '更新' : '添加'}</button>
        {editingId && <button className="btn" onClick={() => { setEditingId(null); setName(''); }}>取消</button>}
      </div>
      <table className="data-table">
        <thead>
          <tr><th>ID</th><th>班级名称</th><th>操作</th></tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <td>{cls.id}</td>
              <td>{cls.name}</td>
              <td>
                <button className="btn small" onClick={() => handleEdit(cls)}>编辑</button>
                <button className="btn small danger" onClick={() => handleDelete(cls.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
