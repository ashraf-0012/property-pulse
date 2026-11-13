import React from "react";

const Pagination = ({ page, pagesize, totalItems }) => {
  const totalPages = Math.ceil(totalItems / pagesize);

  return (
    <section className="container mx-auto flex justify-center items-center my-8">
      {page > 1 ? (
        <a
          href={`/properties/?page=${page - 1}&pagesize=${pagesize}`}
          className="mr-2 px-2 py-1 border border-gray-300 rounded"
        >
          Previous
        </a>
      ) : null}
      <span className="mx-2">
        {" "}
        page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <a
          href={`/properties/?page=${page + 1}&pagesize=${pagesize}`}
          className="ml-2 px-2 py-1 border border-gray-300 rounded"
        >
          Next
        </a>
      ) : null}
    </section>
  );
};

export default Pagination;
