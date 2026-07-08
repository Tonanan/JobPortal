import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { isLogin, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Job<span className="logo-accent">Portal</span>
        </Link>
        <div className="navbar-links">
          {!isLogin && (
            <>
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                Trang chủ
              </NavLink>
              <div className="navbar-auth-buttons">
                <Link to="/login" className="btn btn-secondary">Đăng nhập</Link>
                <Link to="/register" className="btn btn-primary">Đăng ký</Link>
              </div>
            </>
          )}

          {isLogin && role === 'CANDIDATE' && (
            <>
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                Trang chủ
              </NavLink>
              <NavLink to="/applications" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                Ứng tuyển của tôi
              </NavLink>
              <button onClick={handleLogout} className="btn btn-outline-danger">
                Đăng xuất
              </button>
            </>
          )}

          {isLogin && role === 'EMPLOYER' && (
            <>
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                Trang chủ
              </NavLink>
              <NavLink to="/employer/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                Quản lý
              </NavLink>
              <button onClick={handleLogout} className="btn btn-outline-danger">
                Đăng xuất
              </button>
            </>
          )}
          {isLogin && role === 'ADMIN' && (
            <>
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                Trang chủ
              </NavLink>
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                Quản trị
              </NavLink>
              <button onClick={handleLogout} className="btn btn-outline-danger">
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
