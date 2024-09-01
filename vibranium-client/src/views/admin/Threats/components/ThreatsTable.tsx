import { useState } from "react";
import Card from "@/components/card";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import avatar from "@/assets/img/defaultAvatar.jpg";

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
import { FaUser, FaUserShield } from "react-icons/fa6";

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
  userId: string;
  name: string;
  email: string;
  mobile: string;
  photo: string;
  role: string | undefined;
};

function ThreatTable(props: { tableData: any }) {
  const userId = localStorage.getItem("id");
  const columnHelper = createColumnHelper<RowObj>();
  const navigate: NavigateFunction = useNavigate();
  const { tableData } = props;
  const [sorting, setSorting] = useState<SortingState>([]);
  let defaultData = tableData;
  const columns = [
    columnHelper.accessor("photo", {
      id: "photo",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white"></p>
      ),
      cell: (_info) => (
        <div className="h-[30px] w-[30px] rounded-full">
          <img src={avatar} className="h-full w-full rounded-full" alt="" />
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      id: "name",
      filterFn: "fuzzy",
      sortingFn: fuzzySort,
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          NAME
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          @{info.getValue()}
        </p>
      ),
    }),

    columnHelper.accessor("userId", {
      id: "userId",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          USER ID
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("mobile", {
      id: "mobile",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          CONTACT NO.
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          EMAIL
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("userId", {
      id: "role",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          ROLE (ACCESS)
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center justify-start gap-3">
          {userId === info.getValue() ? <FaUserShield size={20} /> : <FaUser />}

          <p className="text-md font-medium text-gray-600 dark:text-white mt-1">
            {userId === info.getValue() ? "Admin" : "Member"}
          </p>
        </div>
      ),
    }),
  ]; // eslint-disable-next-line
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [data] = useState<any>(() => [...defaultData]);

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
          Team Table
        </div>
        <div className="flex items-center justify-between">
          <div className="flex h-full min-h-[32px] items-center rounded-lg bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
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
          <button
            onClick={() => {
              navigate("/admin/team");
            }}
            className={` linear mx-1 flex items-center justify-center rounded-lg bg-lightPrimary p-[0.4rem]  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10`}
          >
            <AiOutlinePlus className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="mt-2 overflow-x-scroll xl:overflow-x-hidden">
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
