import { useEffect, useState } from 'react';
import { API } from '../api';

interface ClassItem { id: number; name: string; }
interface StatRow {
  date: string;
  class_name: string;
  total: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  leave_count: number;
}

export default function Statistics() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [classId, setClassId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState<StatRow[]>([]);

  useEffect(() => {
    fetch(`${API}/classes`).then((r) => r.json()).then(setClasses);
  }, []);

  const load = () => {
    const params = new URLSearchParams();
    if (classId) params.set('class_id', classId);
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);
    fetch(`${API}/attendance/stats?${params}`).then((r) => r.json()).then(setData);
  };

  useEffect(() => { load(); }, [classId, startDate, endDate]);

  return (
    <div>
      <h1>出勤统计</h1>
      <div className="form-row">
        <select value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">全部班级</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <span>至</span>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {data.length > 0 && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>日期</th><th>班级</th><th>总人数</th><th>出席</th><th>缺席</th><th>迟到</th><th>请假</th><th>出勤率</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const rate = row.total > 0 ? Math.round(((row.present_count + row.late_count) / row.total) * 100) : 0;
                return (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td>{row.class_name}</td>
                    <td>{row.total}</td>
                    <td className="text-green">{row.present_count}</td>
                    <td className="text-red">{row.absent_count}</td>
                    <td className="text-yellow">{row.late_count}</td>
                    <td className="text-gray">{row.leave_count}</td>
                    <td><span className={`rate ${rate >= 80 ? 'good' : rate >= 60 ? 'ok' : 'bad'}`}>{rate}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="chart-section">
            <h2>可视化概览</h2>
            <div className="bar-chart">
              {data.slice(0, 7).reverse().map((row, i) => {
                const maxH = 160;
                const h = row.total > 0 ? (row.present_count / row.total) * maxH : 0;
                const rate = row.total > 0 ? Math.round(((row.present_count + row.late_count) / row.total) * 100) : 0;
                return (
                  <div key={i} className="bar-col">
                    <div className="bar-wrapper">
                      <div className="bar" style={{ height: h }} title={`${row.date} ${rate}%`} />
                      <span className="bar-value">{rate}%</span>
                    </div>
                    <div className="bar-label">{row.date.slice(5)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {data.length === 0 && <p className="empty-hint">暂无点名记录数据。</p>}
    </div>
  );
}
