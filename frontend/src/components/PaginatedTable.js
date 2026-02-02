import React from "react";
import Pagination from "./Pagination";

export default function PaginatedTable({
  children,
  page,
  totalPages,
  onPageChange
}) {
  return (
    <>
      {children}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
