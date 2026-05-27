import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: '首页', icon: '📊' },
  { to: '/classes', label: '班级管理', icon: '🏫' },
  { to: '/students', label: '学生管理', icon: '👨‍🎓' },
  { to: '/roll-call', label: '开始点名', icon: '📝' },
  { to: '/statistics', label: '出勤统计', icon: '📈' },
];

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">学生点名系统</div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
