import { Drawer } from "@material-tailwind/react";
import { IoMdClose } from "react-icons/io";
import { FC, useState } from "react";
import { TestObject } from "@/apis/tests";
import { IoCopyOutline } from "react-icons/io5";
import {
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { TestsPerformed } from "@/apis/tests";

interface ApiDetailDrawerProps {
  open: boolean;
  hide: () => void;
  singleTest: TestObject;
}

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

const ApiDetailDrawer: FC<ApiDetailDrawerProps> = ({
  open,
  hide,
  singleTest,
}) => {
  const { method, path } = singleTest.endpoint;

  // Table Params
  const columnHelper = createColumnHelper<TestsPerformed>();

  const columns = [
    columnHelper.accessor("testName", {
      id: "testName",
      header: () => (
        <div className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          TEST NAME
        </div>
      ),
      cell: (info) => (
        <div>
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue().toUpperCase()}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("testSuccess", {
      id: "testSuccess",
      header: () => (
        <div className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          RESULTS
        </div>
      ),
      cell: (info) => (
        <div
          className={`text-sm font-bold ${
            info.getValue()
              ? "text-green-500 dark:text-green-300"
              : "text-red-500 dark:text-red-300"
          }`}
        >
          {info.getValue() ? "SUCCESS" : "FAILURE"}
        </div>
      ),
    }),
  ]; // eslint-disable-next-line

  const [data, _] = useState(singleTest.testsPerformed);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Drawer
      open={open}
      onClose={hide}
      size={600}
      placement="right"
      placeholder={true}
      className="p-4 z-50 ps-6 rounded-t-lg overflow-y-scroll"
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Test Details
        </div>
        <button
          onClick={hide}
          className="text-lg text-gray-400 dark:text-white"
        >
          <IoMdClose className="w-7 h-7 me-2 dark:text-white-300 inline" />
        </button>
      </div>
      <div className="col-span-4 flex gap-4 items-center">
        <div
          className="items-center justify-start rounded-md bg-lightPrimary p-[0.4rem]  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10 ps-2"
        >
          <p className="font-bold text-navy-700 dark:text-white">
            {method.toUpperCase()}
          </p>
        </div>
        <p className="font-bold text-navy-700 dark:text-white">{path}</p>
        <IoCopyOutline className="h-4 w-4 text-gray-400 dark:text-white cursor-pointer" />
      </div>
      <div className="w-full gap-2 pt-6">
        <div className="text-base font-bold text-navy-700 dark:text-white">
          Tests Performed
        </div>
        <div className="pt-4">
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
                          className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start p-6"
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
                          <td
                            key={cell.id}
                            className="border-white/0 py-3  pr-4 w-1/2 p-6"
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
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default ApiDetailDrawer;
