USE db_student;

-- 插入班级数据
INSERT INTO classes (name) VALUES
('计算机一班'),
('计算机二班'),
('软件工程一班');

-- 插入学生数据 (计算机一班)
INSERT INTO students (name, student_no, class_id) VALUES
('张三', '2024001', 1),
('李四', '2024002', 1),
('王五', '2024003', 1),
('赵六', '2024004', 1),
('钱七', '2024005', 1);

-- 插入学生数据 (计算机二班)
INSERT INTO students (name, student_no, class_id) VALUES
('孙八', '2024006', 2),
('周九', '2024007', 2),
('吴十', '2024008', 2),
('郑十一', '2024009', 2),
('王十二', '2024010', 2);

-- 插入学生数据 (软件工程一班)
INSERT INTO students (name, student_no, class_id) VALUES
('冯十三', '2024011', 3),
('陈十四', '2024012', 3),
('楚十五', '2024013', 3),
('魏十六', '2024014', 3),
('蒋十七', '2024015', 3);

-- 插入今日点名记录 (部分学生)
INSERT INTO attendance (student_id, class_id, date, status) VALUES
(1, 1, CURDATE(), 'present'),
(2, 1, CURDATE(), 'present'),
(3, 1, CURDATE(), 'late'),
(4, 1, CURDATE(), 'absent'),
(5, 1, CURDATE(), 'present'),
(6, 2, CURDATE(), 'present'),
(7, 2, CURDATE(), 'leave'),
(8, 2, CURDATE(), 'present'),
(9, 2, CURDATE(), 'present'),
(10, 2, CURDATE(), 'late');
