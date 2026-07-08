import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobApi } from '../api/jobApi';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';

export const JobListPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeSearch, setActiveSearch] = useState(false);

  // Pagination state (applicable only to non-search flow)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Fetch jobs dynamically based on search keywords or pagination index
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeSearch && searchKeyword.trim() !== '') {
        // Run search endpoint
        const response = await jobApi.searchJobs(searchKeyword.trim(), searchKeyword.trim());
        // GET /jobs/search returns direct array List<JobResponse>
        setJobs(response.data);
        setTotalPages(0); // No pagination metadata for search responses
      } else {
        // Run standard paginated list endpoint
        const response = await jobApi.getAllJobs(currentPage, pageSize);
        // GET /jobs returns Spring Data Page object
        setJobs(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setCurrentPage(response.data.number || 0);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Lỗi tải danh sách việc làm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, activeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    setActiveSearch(true);
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setActiveSearch(false);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Thỏa thuận';
    return `${Number(salary).toLocaleString()} USD`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch (e) {
      return dateString;
    }
  };

  const truncateDescription = (desc, length = 120) => {
    if (!desc) return '';
    if (desc.length <= length) return desc;
    return `${desc.substring(0, length)}...`;
  };

  return (
    <div className="job-list-page">
      {/* Search Header Section */}
      <div className="search-header-container">
        <h1 className="search-header-title">Tìm kiếm công việc mơ ước của bạn</h1>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-input-icon">🔍</span>
            <input
              type="text"
              className="search-input-field"
              placeholder="Nhập tên công việc, từ khóa hoặc địa điểm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary search-submit-btn">
            Tìm kiếm
          </button>
          {activeSearch && (
            <button type="button" onClick={handleClearSearch} className="btn btn-secondary search-clear-btn">
              Xóa lọc
            </button>
          )}
        </form>
      </div>

      {/* Main Jobs Listing Section */}
      <div className="jobs-section">
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loading />
        ) : jobs.length === 0 ? (
          <div className="empty-jobs-state">
            <div className="empty-icon">📭</div>
            <h3>Không tìm thấy công việc phù hợp</h3>
            <p>Hãy thử tìm kiếm với các từ khóa hoặc địa điểm khác.</p>
          </div>
        ) : (
          <>
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="job-card card"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="job-card-header">
                    <h3 className="job-card-title">{job.title}</h3>
                    <span className="job-company-tag">Employer</span>
                  </div>
                  <p className="job-card-desc">
                    {truncateDescription(job.description)}
                  </p>
                  <div className="job-card-footer">
                    <div className="job-footer-meta">
                      <span className="meta-item">{formatSalary(job.salary)}</span>
                      <span className="meta-item">{job.location}</span>
                    </div>
                    <span className="job-post-date">{formatDate(job.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls - visible only when not searching */}
            {!activeSearch && totalPages > 1 && (
              <div className="pagination-wrapper">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0 || loading}
                  className="btn btn-secondary pagination-btn"
                >
                  ◀ Previous
                </button>
                <span className="pagination-current">
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1 || loading}
                  className="btn btn-secondary pagination-btn"
                >
                  Next ▶
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
