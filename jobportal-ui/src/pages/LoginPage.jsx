import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { decodeJwt } from '../utils/token';

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email không được để trống')
    .email('Email không đúng định dạng'),
  password: z.string()
    .min(1, 'Mật khẩu không được để trống')
    .min(8, 'Mật khẩu phải từ 8-24 ký tự')
    .max(24, 'Mật khẩu phải từ 8-24 ký tự'),
});

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await authApi.login(data);
      const { token } = response.data;
      
      // Store token and role in auth state
      login(token);

      toast.success('Đăng nhập thành công!');
      
      // Decode JWT locally for immediate redirect
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      const role = decoded.role;

      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.message) {
        setErrorMsg(err.message);
      } else if (typeof err === 'object') {
        const firstErrKey = Object.keys(err)[0];
        if (firstErrKey) {
          setErrorMsg(err[firstErrKey]);
        } else {
          setErrorMsg('Lỗi đăng nhập. Vui lòng thử lại.');
        }
      } else {
        setErrorMsg('Lỗi kết nối máy chủ.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <h2 className="auth-title">Đăng nhập tài khoản</h2>
        <p className="auth-subtitle">Cùng xây dựng sự nghiệp thành công với Job Portal</p>
        
        {errorMsg && <ErrorMessage message={errorMsg} />}

        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email đăng nhập</label>
              <input
                id="email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Nhập email của bạn"
                {...register('email')}
              />
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Nhập mật khẩu"
                {...register('password')}
              />
              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Đăng nhập
            </button>
          </form>
        )}

        <div className="auth-links">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};
