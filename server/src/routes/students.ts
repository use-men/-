import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// 获取学生列表
router.get('/', async (req, res) => {
  const { class_id } = req.query;
  let sql = `SELECT s.*, c.name as class_name FROM students s
             LEFT JOIN classes c ON s.class_id = c.id`;
  const params: any[] = [];
  if (class_id) {
    sql += ' WHERE s.class_id = ?';
    params.push(class_id);
  }
  sql += ' ORDER BY s.id DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// 添加学生
router.post('/', async (req, res) => {
  const { name, student_no, class_id } = req.body;
  if (!name || !student_no) return res.status(400).json({ error: '姓名和学号不能为空' });
  const [result] = await pool.query(
    'INSERT INTO students (name, student_no, class_id) VALUES (?, ?, ?)',
    [name, student_no, class_id || null]
  );
  res.json({ id: (result as any).insertId, name, student_no, class_id });
});

// 更新学生
router.put('/:id', async (req, res) => {
  const { name, student_no, class_id } = req.body;
  const { id } = req.params;
  await pool.query(
    'UPDATE students SET name = ?, student_no = ?, class_id = ? WHERE id = ?',
    [name, student_no, class_id || null, id]
  );
  res.json({ id: Number(id), name, student_no, class_id });
});

// 删除学生
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

export default router;
