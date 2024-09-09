import { useEffect, useState } from "react";
import Card from "@/components/card";
import { FiSearch } from "react-icons/fi";
import { FaHourglassHalf } from "react-icons/fa";
import {
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingFn,
  sortingFns,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import Pagination from "@/components/pagination/Pagination";
import { Endpoint } from "@/app/features/EndpointSlice";
import { Threat } from "@/utils/interfaces";
import { FaCheck } from "react-icons/fa";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

type RowObj = {
  _id: string;
  endpoint: Endpoint;
  name: string;
  description: string;
  type: string;
  severity: string;
  recommendations?: string;
  status: string;
};

function ThreatTable(props: {
  tableData: Threat[];
  updateThreat: (id: string, status: string) => Promise<void>;
}) {
  const columnHelper = createColumnHelper<RowObj>();
  const { tableData, updateThreat } = props;
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = [
    columnHelper.accessor("severity", {
      id: "severity",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          {" "}
          SEVERITY
        </p>
      ),
      cell: (info) => (
        <div
          className={`h-full w-[80px] rounded-md text-sm font-bold flex justify-center ${
            info.getValue() === "High"
              ? "bg-red-200 text-red-600"
              : info.getValue() === "Medium"
              ? "bg-yellow-200 text-yellow-600"
              : "bg-green-200 text-green-600"
          }`}
        >
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      id: "name",
      filterFn: "fuzzy",
      sortingFn: fuzzySort,
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          THREAT
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),

    columnHelper.accessor("endpoint", {
      id: "method",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          METHOD
        </p>
      ),
      cell: (info) => (
        <div
          className="flex items-center justify-start rounded-md bg-lightPrimary p-[0.4rem]  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10 w-[75%] ps-2"
        >
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue().method.toUpperCase()}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("endpoint", {
      id: "path",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          PATH
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue().path}
        </p>
      ),
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          STATUS
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue() === "Pending" ? (
            <div className="flex gap-3">
              <FaHourglassHalf size={20} className="text-yellow-500" />
              {info.getValue()}
            </div>
          ) : (
            <div className="flex gap-3">
              <FaCheck size={20} className="text-green-500" />
              {info.getValue()}
            </div>
          )}
        </p>
      ),
    }),
    columnHelper.accessor("status", {
      id: "role",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          Actions
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center justify-start gap-3">
          <button
            className="bg-navy-50 p-2 rounded-lg flex"
            onClick={() => handleUpdate(info.row.original)}
          >
            {info.getValue() === "Pending" ? "Resolve" : "Reopen"}
          </button>
        </div>
      ),
    }),
  ]; // eslint-disable-next-line
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [data, setData] = useState<Threat[]>([]);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const handleUpdate = async (rowObj: RowObj) => {
    const id = rowObj._id;
    const status = rowObj.status === "Pending" ? "Resolved" : "Pending";
    await updateThreat(id, status);
  };

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });
  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Threats Table
        </div>
        <div className="flex items-center justify-between">
          <div className="flex h-full min-h-[32px] items-center rounded-lg bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[275px]">
            <p className="pl-3 pr-2 text-xl">
              <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
            </p>
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="block h-full min-h-[32px] w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
            />
          </div>
        </div>
      </header>

      <div className="mt-2 overflow-x-scroll xl:overflow-x-hidden h-full">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-600 dark:text-white">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "▲",
                          desc: "▼",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className={`${
                          cell.column.id === "photo"
                            ? "min-w-20px"
                            : "min-w-[130px]"
                        }  border-white/0 py-3 pr-2`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination table={table} />
      </div>
    </Card>
  );
}

export default ThreatTable;
