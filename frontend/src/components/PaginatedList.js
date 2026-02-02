import Pagination from "./Pagination";

export default function PaginatedList({
  data,
  renderItem,
  page,
  totalPages,
  onPageChange
}) {
  return (
    <>
      {data.map((item, index) => renderItem(item, index))}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
