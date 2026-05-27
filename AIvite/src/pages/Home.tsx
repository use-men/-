import { useEffect, useState } from 'react';
import { API } from '../api';

export default function Home() {
  const [stats, setStats] = useState({ studentCount: 0, classCount: 0, todayTotal: 0, todayPresent: 0 });

  useEffect(() => {
    fetch(`${API}/attendance/dashboard`).then((r) => r.json()).then(setStats);
  }, []);

  const attendanceRate = stats.todayTotal > 0 ? Math.round((stats.todayPresent / stats.todayTotal) * 100) : 0;

  return (
    <div>
      <h1>仪表盘</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.studentCount}</div>
          <div className="stat-label">学生总数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.classCount}</div>
          <div className="stat-label">班级总数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.todayTotal}</div>
          <div className="stat-label">今日点名人次</div>
        </div>
        <div className="stat-card accent">
          <div className="stat-number">{attendanceRate}%</div>
          <div className="stat-label">今日出勤率</div>
        </div>
      </div>
    </div>
  );
}
