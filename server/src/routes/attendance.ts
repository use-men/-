import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// 获取点名记录
router.get('/', async (req, res) => {
  const { class_id, date } = req.query;
  let sql = `SELECT a.*, s.name as student_name, s.student_no, c.name as class_name
             FROM attendance a
             JOIN students s ON a.student_id = s.id
             JOIN classes c ON a.class_id = c.id`;
  const conditions: string[] = [];
  const params: any[] = [];
  if (class_id) { conditions.push('a.class_id = ?'); params.push(class_id); }
  if (date) { conditions.push('a.date = ?'); params.push(date); }
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY a.id DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// 批量提交点名
router.post('/', async (req, res) => {
  const { class_id, date, records } = req.body;
  if (!class_id || !records?.length) return res.status(400).json({ error: '参数不完整' });
  const d = date || new Date().toISOString().slice(0, 10);
  for (const r of records) {
    await pool.query(
      `INSERT INTO attendance (student_id, class_id, date, status) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      [r.student_id, class_id, d, r.status]
    );
  }
  res.json({ success: true });
});

// 出勤统计
router.get('/stats', async (req, res) => {
  const { class_id, start_date, end_date } = req.query;
  let sql = `SELECT
               a.date,
               c.name as class_name,
               COUNT(*) as total,
               SUM(a.status = 'present') as present_count,
               SUM(a.status = 'absent') as absent_count,
               SUM(a.status = 'late') as late_count,
               SUM(a.status = 'leave') as leave_count
             FROM attendance a
             JOIN classes c ON a.class_id = c.id`;
  const conditions: string[] = [];
  const params: any[] = [];
  if (class_id) { conditions.push('a.class_id = ?'); params.push(class_id); }
  if (start_date) { conditions.push('a.date >= ?'); params.push(start_date); }
  if (end_date) { conditions.push('a.date <= ?'); params.push(end_date); }
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' GROUP BY a.date, c.name ORDER BY a.date DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// 首页统计
router.get('/dashboard', async (_req, res) => {
  const [[{ studentCount }]]: any = await pool.query('SELECT COUNT(*) as studentCount FROM students');
  const [[{ classCount }]]: any = await pool.query('SELECT COUNT(*) as classCount FROM classes');
  const today = new Date().toISOString().slice(0, 10);
  const [[todayStats]]: any = await pool.query(
    `SELECT COUNT(*) as total,
            SUM(status = 'present') as present_count
     FROM attendance WHERE date = ?`, [today]
  );
  res.json({
    studentCount,
    classCount,
    todayTotal: todayStats?.total || 0,
    todayPresent: todayStats?.present_count || 0,
  });
});

export default router;
