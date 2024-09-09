import { useEffect, useState } from "react";
import {
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import Card from "@/components/card";
import { FiSearch } from "react-icons/fi";
import Pagination from "@/components/pagination/Pagination";
import { getTests, deleteTest } from "@/apis/tests";
import { TestObject } from "@/apis/tests";
import { FaTrash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";

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

type RowObj = {
  method: string;
  endpoint: string;
  date: string;
  time: string;
  tests_performed: number;
  status: boolean;
  actions: TestObject;
};

const EndpointTable = ({
  openDrawer,
}: {
  openDrawer: (singleTest: TestObject) => void;
}) => {
  const columnHelper = createColumnHelper<RowObj>();

  const [sorting, setSorting] = useState<SortingState>([]);

  const deleteTestHandler = (singleTest: TestObject) => {
    deleteTest(singleTest._id).then((res) => {
      if (res) {
        const new_rows = data.filter(
          (row) => row.actions._id !== singleTest._id
        );
        _(new_rows);
      } else {
        console.error("Failed to delete test");
      }
    });
  };

  const columns = [
    columnHelper.accessor("method", {
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
            {info.getValue().toUpperCase()}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("endpoint", {
      id: "path",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          ENDPOINT
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("date", {
      id: "date",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          DATE
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("time", {
      id: "time",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          TIME
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("tests_performed", {
      id: "risk",
      header: () => (
        <p className="mr-1 text-sm font-bold text-gray-600 dark:text-white flex justify-center">
          TESTS PERFORMED
        </p>
      ),
      cell: (info) => {
        return (
          <p className="text-sm font-bold text-navy-700 dark:text-white flex justify-center">
            {info.getValue()}
          </p>
        );
      },
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          STATUS
        </p>
      ),
      cell: (info) => (
        <div>
          <span
            className={`text-sm font-bold px-2 rounded ${
              info.getValue()
                ? "text-green-600 bg-green-200"
                : "text-red-600 bg-red-200"
            }`}
          >
            {info.getValue() ? "Passed" : "Failed"}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("actions", {
      id: "actions",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          ACTIONS
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center justify-start gap-3">
          <button
            onClick={() => openDrawer(info.getValue())}
            className={` flex items-center justify-center rounded-lg bg-lightPrimary p-[0.4rem]  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10`}
          >
            <FaRegEye className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteTestHandler(info.getValue())}
            className={` flex items-center justify-center rounded-lg bg-lightPrimary p-[0.4rem]  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10`}
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ]; // eslint-disable-next-line

  const [data, _] = useState([]);

  useEffect(() => {
    getTests().then((res) => {
      if (res.success) {
        const data = res.data;

        data.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        const rows: RowObj[] = data.map((row) => {
          const { endpoint, createdAt, testsPerformed } = row;
          let time = createdAt.split("T")[1].split(".")[0];
          let hours = parseInt(time.split(":")[0]);
          let minutes = parseInt(time.split(":")[1]);
          let suffix = hours >= 12 ? "PM" : "AM";
          hours = hours % 12;
          hours = hours ? hours : 12;
          time = hours + ":" + minutes + " " + suffix;

          return {
            method: endpoint.method,
            endpoint: endpoint.path,
            date: createdAt.split("T")[0],
            time,
            tests_performed: testsPerformed.length,
            status: testsPerformed.every((test) => test.testSuccess),
            actions: row,
          };
        });
        _(rows);
      }
    });
  }, []);

  const [globalFilter, setGlobalFilter] = useState<string>("");
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
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <>
      <Card extra={"w-full h-full sm:overflow-auto px-6"}>
        <header className="relative flex items-center justify-between pt-4">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Test Results
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
          </div>
        </header>

        <div className="mt-2 overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="!border-px !border-gray-400"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                      >
                        <div className="items-center justify-between text-xs text-gray-600">
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
                        <td key={cell.id} className="border-white/0 py-3  pr-4">
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
    </>
  );
};

export default EndpointTable;
