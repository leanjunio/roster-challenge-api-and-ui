import { SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable, getPaginationRowModel, ColumnDef, createColumnHelper, OnChangeFn } from "@tanstack/react-table";
import { useState } from "react";
import { Artist } from "../../../types/artist";
import { formatToCAD } from "../../../utils/currency";
import { Checkbox } from "../../../components/inputs/Checkbox";
import { Pagination } from "./Pagination";
import type { Pagination as ServerPagination } from "../../../types/pagination";

export type TablePagination = {
  pageIndex: number;
  pageSize: number;
}

type ArtistTableProps = {
  data: Artist[];
  onToggleCompletedPayout: (artist: Artist) => void;
  onUpdate: (id: Artist["_id"]) => void;
  onDelete: (id: Artist["_id"], artist: Artist["artist"]) => void;
  pagination: TablePagination;
  updatePagination: OnChangeFn<TablePagination>;
  serverPagination: ServerPagination;
}

export function ArtistTable({
  data,
  onToggleCompletedPayout,
  onUpdate,
  onDelete,
  pagination,
  updatePagination,
  serverPagination
}: ArtistTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<Artist>();

  const ColumnDefinitions: ColumnDef<Artist, any>[] = [
    columnHelper.accessor((row) => row.artist, {
      id: "artist",
      cell: (info) => <div>{info.getValue()}</div>,
      header: () => <div>Artist Name</div>
    }),
    columnHelper.accessor((row) => row.rate, {
      id: "rate",
      cell: (info) => <div>{info.getValue()}</div>,
      header: () => <div>Rate</div>
    }),
    columnHelper.accessor((row) => row.streams, {
      id: "streams",
      cell: (info) => <div>{info.getValue()}</div>,
      header: () => <div>Rate</div>
    }),
    columnHelper.accessor((row) => row.payout, {
      id: "payout",
      cell: (info) => <div>{formatToCAD(info.getValue())}</div>,
      header: () => <div>Payout</div>
    }),
    columnHelper.accessor((row) => row.monthlyPayout, {
      id: "monthlyPayout",
      cell: (info) => <div>{formatToCAD(info.getValue())}</div>,
      header: () => <div>Avg. Monthly Payout</div>
    }),
    columnHelper.accessor((row) => row, {
      id: "isCompletelyPaid",
      cell: (info) => {
        return (
          <div>
            <Checkbox
              value={info.getValue().isCompletelyPaid}
              onChange={() => onToggleCompletedPayout(info.getValue())}
              name="completedPayout"
              id="completedPayout"
            />
          </div>
        )
      },
      header: () => <div>Completely Paid?</div>
    }),
    columnHelper.accessor((row) => row, {
      id: "actions",
      cell: (info) => {
        const artist = info.getValue();
        return (
          <div className="flex gap-2">
            <button className="btn btn-sm btn-primary" onClick={() => onUpdate(artist._id)}>Update</button>
            <button className="btn btn-sm btn-warning" onClick={() => onDelete(artist._id, artist.artist)}>Delete</button>
          </div>
        )
      },
      header: () => <div>Actions</div>
    }),
  ]

  const table = useReactTable({
    columns: ColumnDefinitions,
    data,
    pageCount: serverPagination.pageCount,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination
    },
    onSortingChange: setSorting,
    manualPagination: true,
    onPaginationChange: updatePagination
  })

  const headers = table.getFlatHeaders();
  const rows = table.getRowModel().rows;

  return (
    <div className="overflow-x-auto">
      <table className='table table-zebra table-pin-rows'>
        <thead>
          {headers.map(header => {
            const direction = header.column.getIsSorted();
            const sortIndicator = direction === "asc" ? "↑" : direction === "desc" ? "↓" : "";

            return (
              <th key={header.id}>
                {header.isPlaceholder ? null : (
                  <div
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer flex gap-4"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {direction && <span>{sortIndicator}</span>}
                  </div>
                )}
              </th>
            )
          })}
        </thead>
        <tbody className='overflow-auto'>
          {rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, index) => {
                return index === 0 ? (
                  <th key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </th>
                ) : (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <Pagination table={table} />
      </table>
    </div>
  )
}