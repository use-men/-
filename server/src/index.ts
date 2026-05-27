import express from 'express';
import cors from 'cors';
import pool from './db.js';
import classesRouter from './routes/classes.js';
import studentsRouter from './routes/students.js';
import attendanceRouter from './routes/attendance.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS classes (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(50) NOT NULL,
      student_no VARCHAR(20) UNIQUE NOT NULL,
      class_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INT PRIMARY KEY AUTO_INCREMENT,
      student_id INT NOT NULL,
      class_id INT NOT NULL,
      date DATE NOT NULL,
      status ENUM('present', 'absent', 'late', 'leave') DEFAULT 'present',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
      UNIQUE KEY unique_record (student_id, class_id, date)
    )
  `);
  console.log('Database tables initialized');

  // 自动插入示例数据
  const [existing]: any = await pool.query('SELECT COUNT(*) as count FROM classes');
  if (existing[0].count === 0) {
    await pool.query(`INSERT INTO classes (name) VALUES ('计算机一班'), ('计算机二班'), ('软件工程一班')`);
    await pool.query(`
      INSERT INTO students (name, student_no, class_id) VALUES
      ('张三', '2024001', 1), ('李四', '2024002', 1), ('王五', '2024003', 1),
      ('赵六', '2024004', 1), ('钱七', '2024005', 1),
      ('孙八', '2024006', 2), ('周九', '2024007', 2), ('吴十', '2024008', 2),
      ('郑十一', '2024009', 2), ('王十二', '2024010', 2),
      ('冯十三', '2024011', 3), ('陈十四', '2024012', 3), ('楚十五', '2024013', 3),
      ('魏十六', '2024014', 3), ('蒋十七', '2024015', 3)
    `);
    await pool.query(`
      INSERT INTO attendance (student_id, class_id, date, status) VALUES
      (1, 1, CURDATE(), 'present'), (2, 1, CURDATE(), 'present'),
      (3, 1, CURDATE(), 'late'), (4, 1, CURDATE(), 'absent'),
      (5, 1, CURDATE(), 'present'), (6, 2, CURDATE(), 'present'),
      (7, 2, CURDATE(), 'leave'), (8, 2, CURDATE(), 'present'),
      (9, 2, CURDATE(), 'present'), (10, 2, CURDATE(), 'late')
    `);
    console.log('Sample data inserted: 3 classes, 15 students, 10 attendance records');
  }
}

app.use('/api/classes', classesRouter);
app.use('/api/students', studentsRouter);
app.use('/api/attendance', attendanceRouter);

// 初始化数据接口
app.post('/api/init', async (_req, res) => {
  try {
    const [existing]: any = await pool.query('SELECT COUNT(*) as count FROM classes');
    if (existing[0].count > 0) {
      return res.json({ message: '数据库已有数据，跳过初始化' });
    }

    await pool.query(`INSERT INTO classes (name) VALUES ('计算机一班'), ('计算机二班'), ('软件工程一班')`);
    await pool.query(`
      INSERT INTO students (name, student_no, class_id) VALUES
      ('张三', '2024001', 1), ('李四', '2024002', 1), ('王五', '2024003', 1),
      ('赵六', '2024004', 1), ('钱七', '2024005', 1),
      ('孙八', '2024006', 2), ('周九', '2024007', 2), ('吴十', '2024008', 2),
      ('郑十一', '2024009', 2), ('王十二', '2024010', 2),
      ('冯十三', '2024011', 3), ('陈十四', '2024012', 3), ('楚十五', '2024013', 3),
      ('魏十六', '2024014', 3), ('蒋十七', '2024015', 3)
    `);
    await pool.query(`
      INSERT INTO attendance (student_id, class_id, date, status) VALUES
      (1, 1, CURDATE(), 'present'), (2, 1, CURDATE(), 'present'),
      (3, 1, CURDATE(), 'late'), (4, 1, CURDATE(), 'absent'),
      (5, 1, CURDATE(), 'present'), (6, 2, CURDATE(), 'present'),
      (7, 2, CURDATE(), 'leave'), (8, 2, CURDATE(), 'present'),
      (9, 2, CURDATE(), 'present'), (10, 2, CURDATE(), 'late')
    `);

    res.json({ message: '初始化完成！已创建 3 个班级、15 名学生、10 条点名记录' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
