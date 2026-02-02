export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
      <button
        className="btn btn-outline-dark"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        « Previous
      </button>

      <span className="fw-bold">
        Page {page} of {totalPages}
      </span>

      <button
        className="btn btn-outline-dark"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Next »
      </button>
    </div>
  );
}
