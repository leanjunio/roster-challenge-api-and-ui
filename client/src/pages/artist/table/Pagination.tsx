import { Table } from "@tanstack/react-table";

type PaginationProps<T> = {
  hasPrevPage: boolean;
  hasNextPage: boolean;
  table: Table<T>
};

export function Pagination<T>({
  hasPrevPage,
  hasNextPage,
  table
}: PaginationProps<T>) {
  const state = table.getState().pagination;
  const goLastPage = () => table.setPageIndex(table.getPageCount());

  return (
    <div className="my-5 w-max sticky left-0">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 ">
          <div className="btn-group px-0 btn-sm">
            {/* button to go to first page */}
            <button
              className="btn btn-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!hasPrevPage}
            >
              {"<<"}
            </button>
            {/* button to go previous page */}
            <button
              className="btn btn-sm"
              onClick={() => table.previousPage()}
              disabled={!hasPrevPage}
            >
              {"<"}
            </button>
            {/* button to go next page */}
            <button
              className="btn btn-sm"
              onClick={() => table.nextPage()}
              disabled={!hasNextPage}
            >
              {">"}
            </button>
            {/* button to go last page */}
            <button
              className="btn btn-sm"
              onClick={goLastPage}
              disabled={!hasNextPage}
            >
              {">>"}
            </button>
          </div>
          {/* page info */}
          <span className="flex gap-1 items-center">
            <p className="font-semibold">Page</p>
            <p className="font-semibold">{state.pageIndex + 1} of {table.getPageCount()}</p>
          </span>
          <select
            value={state.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="select select-sm select-bordered"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row">
          {/* input to skip to a specific page */}
          {/* <span className="flex items-center gap-1">
            Go to page:
            <input
              defaultValue={state.pageIndex + 1}
              type="number"
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="input input-bordered w-20 input-sm mx-2"
            />
          </span> */}
          {/* select to input page size */}

        </div>
      </div>
    </div >
  )
}