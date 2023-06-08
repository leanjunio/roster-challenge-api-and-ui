import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { Artist } from "../../../types/artist"
import { formatToCAD } from "../../../utils/currency";

const columnHelper = createColumnHelper<Artist>();

export const ColumnDefinitions: ColumnDef<Artist, any>[] = [
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
]