export const getApiErrorMessage = (error) => {
  if (!error) {
    return 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object') {
    if (error.message) {
      return error.message;
    }

    if (error.error) {
      return getApiErrorMessage(error.error);
    }

    if (error.errors) {
      if (Array.isArray(error.errors)) {
        return error.errors.map((item) => getApiErrorMessage(item)).join('; ');
      }
      return getApiErrorMessage(error.errors);
    }

    const values = Object.values(error);
    if (values.length > 0) {
      return getApiErrorMessage(values[0]);
    }
  }

  return 'Lỗi kết nối máy chủ.';
};
