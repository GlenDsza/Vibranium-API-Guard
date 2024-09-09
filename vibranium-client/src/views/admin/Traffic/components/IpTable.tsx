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
import { MdLockOpen } from "react-icons/md";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import Card from "@/components/card";
import { getBlacklistedIps, maybeBlockIp } from "@/apis/blacklist";
import { toast } from "react-toastify";

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
  ip: string;
};

const EndpointTable = ({ tableData }: { tableData: RowObj[] }) => {
  const columnHelper = createColumnHelper<RowObj>();

  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    getBlacklistedIps(
      localStorage.getItem("organization") || "66d3f5019ce5c53aeb973d6e"
    ).then((res) => {
      if (res.success) {
        _(res.data.map((item: any) => ({ ip: item })));
      }
    });
  }, [tableData]);

  const unblockIp = (ip: string) => {
    const orgid =
      localStorage.getItem("organization") || "66d3f5019ce5c53aeb973d6e";
    maybeBlockIp(orgid, ip, false).then((res) => {
      if (res.success) {
        _(data.filter((item) => item.ip !== ip));
        toast.success("Ip Unblocked Successfully");
      } else {
        toast.error("Failed to unblock IP");
      }
    });
  };

  const columns = [
    columnHelper.accessor("ip", {
      id: "ip",
      header: () => (
        <p className="mr-1 inline text-sm font-bold w-3/4 text-gray-600 dark:text-white">
          IP ADDRESS
        </p>
      ),
      cell: (info: any) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("ip", {
      id: "action",
      header: () => (
        <p className="mr-1 inline text-sm font-bold w-1/4 text-gray-600 dark:text-white">
          UNBLOCK
        </p>
      ),
      cell: (info: any) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              unblockIp(info.getValue());
            }}
            className={` flex items-center justify-center rounded-lg bg-lightPrimary p-[0.4rem]  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10`}
          >
            <MdLockOpen className="h-5 w-5 text-green-600 " />
          </button>
        </div>
      ),
    }),
  ]; // eslint-disable-next-line

  const [data, _] = useState([]);
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
                        <div
                          className={
                            header.id == "actions"
                              ? "items-start text-xs text-gray-600 w-4"
                              : "text-center items-center text-xs text-gray-600"
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
        </div>
      </Card>
    </>
  );
};

export default EndpointTable;
