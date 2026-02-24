import type { FC } from 'react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AdminPagination: FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const visiblePages = [1, 2, 3];

  return (
    <div className="admin-pagination">
      <button
        className="admin-pagination__btn admin-pagination__btn--prev"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {visiblePages.map((p) => (
        <button
          key={p}
          className={`admin-pagination__btn ${currentPage === p ? 'admin-pagination__btn--active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <span className="admin-pagination__ellipsis">...</span>

      <button
        className="admin-pagination__btn"
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>

      <button
        className="admin-pagination__btn admin-pagination__btn--next"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default AdminPagination;
