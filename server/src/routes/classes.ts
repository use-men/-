import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// 获取所有班级
router.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM classes ORDER BY id DESC');
  res.json(rows);
});

// 创建班级
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: '班级名称不能为空' });
  const [result] = await pool.query('INSERT INTO classes (name) VALUES (?)', [name]);
  res.json({ id: (result as any).insertId, name });
});

// 更新班级
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  await pool.query('UPDATE classes SET name = ? WHERE id = ?', [name, id]);
  res.json({ id: Number(id), name });
});

// 删除班级
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM classes WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

export default router;
