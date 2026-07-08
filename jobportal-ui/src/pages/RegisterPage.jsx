import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';

const registerSchema = z.object({
  name: z.string().min(1, 'Họ tên không được để trống'),
  email: z.string()
    .min(1, 'Email không được để trống')
    .email('Email không đúng định dạng'),
  password: z.string()
    .min(1, 'Mật khẩu không được để trống')
    .min(8, 'Mật khẩu phải từ 8-24 ký tự')
    .max(24, 'Mật khẩu phải từ 8-24 ký tự'),
  role: z.enum(['CANDIDATE', 'EMPLOYER'], {
    errorMap: () => ({ message: 'Vui lòng chọn vai trò người dùng' }),
  }),
});

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'CANDIDATE',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await authApi.register(data);
      toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      if (err.message) {
        setErrorMsg(err.message);
      } else if (typeof err === 'object') {
        const firstErrKey = Object.keys(err)[0];
        if (firstErrKey) {
          setErrorMsg(err[firstErrKey]);
        } else {
          setErrorMsg('Lỗi đăng ký. Vui lòng thử lại.');
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
        <h2 className="auth-title">Đăng ký tài khoản</h2>
        <p className="auth-subtitle">Tạo tài khoản ngay để nhận hàng ngàn cơ hội hấp dẫn</p>

        {errorMsg && <ErrorMessage message={errorMsg} />}

        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Họ và tên</label>
              <input
                id="name"
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Nhập họ và tên của bạn"
                {...register('name')}
              />
              {errors.name && (
                <span className="form-error">{errors.name.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email đăng ký</label>
              <input
                id="email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Nhập địa chỉ email"
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
                placeholder="Nhập mật khẩu (từ 8-24 ký tự)"
                {...register('password')}
              />
              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="role">Bạn là</label>
              <select
                id="role"
                className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                {...register('role')}
              >
                <option value="CANDIDATE">Người tìm việc (Candidate)</option>
                <option value="EMPLOYER">Nhà tuyển dụng (Employer)</option>
              </select>
              {errors.role && (
                <span className="form-error">{errors.role.message}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Đăng ký
            </button>
          </form>
        )}

        <div className="auth-links">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};
