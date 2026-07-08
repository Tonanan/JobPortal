import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ErrorMessage } from './ErrorMessage';

const jobSchema = z.object({
  title: z.string().min(3, 'Tiêu đề phải từ 3 đến 100 ký tự').max(100, 'Tiêu đề phải từ 3 đến 100 ký tự'),
  description: z.string().min(1, 'Mô tả không được để trống'),
  salary: z.number().min(0, 'Lương phải lớn hơn hoặc bằng 0'),
  location: z.string().min(1, 'Địa điểm không được để trống'),
});

export const JobForm = ({ initialValues, onSubmit, loading, error }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <div className="form-card card">
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Tiêu đề công việc
          </label>
          <input
            id="title"
            type="text"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            placeholder="Nhập tiêu đề công việc"
            {...register('title')}
          />
          {errors.title && <span className="form-error">{errors.title.message}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="location">
            Địa điểm
          </label>
          <input
            id="location"
            type="text"
            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
            placeholder="Nhập địa điểm"
            {...register('location')}
          />
          {errors.location && <span className="form-error">{errors.location.message}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="salary">
            Mức lương (USD)
          </label>
          <input
            id="salary"
            type="number"
            min="0"
            className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
            placeholder="Nhập mức lương"
            {...register('salary', { valueAsNumber: true })}
          />
          {errors.salary && <span className="form-error">{errors.salary.message}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Mô tả công việc
          </label>
          <textarea
            id="description"
            rows="6"
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            placeholder="Nhập mô tả chi tiết cho công việc"
            {...register('description')}
          />
          {errors.description && <span className="form-error">{errors.description.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      </form>
    </div>
  );
};
