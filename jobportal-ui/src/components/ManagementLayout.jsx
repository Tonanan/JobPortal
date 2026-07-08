import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ManagementLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isAdmin = location.pathname.startsWith('/admin');
  const basePath = isAdmin ? '/admin' : '/employer';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="management-layout">
      <aside className="management-sidebar">
        <div className="management-sidebar-brand">
          <span className="management-sidebar-title">Quản lý</span>
          <p className="management-sidebar-subtitle">
            {isAdmin ? 'Quản trị hệ thống' : 'Trang nhà tuyển dụng'}
          </p>
        </div>

        <nav className="management-menu">
          <NavLink
            to={`${basePath}/dashboard`}
            className={({ isActive }) => isActive ? 'management-menu-item active' : 'management-menu-item'}
          >
            Tổng quan
          </NavLink>
          <NavLink
            to={`${basePath}/jobs`}
            className={({ isActive }) => isActive ? 'management-menu-item active' : 'management-menu-item'}
          >
            Tin tuyển dụng
          </NavLink>
        </nav>

        <button type="button" onClick={handleLogout} className="management-logout-btn btn btn-secondary">
          Đăng xuất
        </button>
      </aside>

      <main className="management-content">
        <Outlet />
      </main>
    </div>
  );
};
