import { useState } from "react";
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
import ApiDetailDrawer from "./ApiDetailDrawer";
import { Parameter } from "@/app/features/EndpointSlice";
import { Schema, Threat } from "@/utils/interfaces";
import { FaInfo } from "react-icons/fa";

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
  _id: string;
  path: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  summary: string;
  operationId: string;
  enabled: boolean;
  organization: string;
  parameters: Parameter[];
  requestBody: {
    content: {
      "application/json": {
        schemaRef: Schema;
      };
    };
    required: boolean;
  };
  responses: Map<
    string,
    {
      description: string;
      content: {
        "application/json": {
          schemaRef: Schema;
        };
      };
    }
  >;
  threats: Threat[];
  createdAt: string;
  updatedAt: string;
  actions: string | undefined;
};

const EndpointTable = (props: { tableData: any }) => {
  const columnHelper = createColumnHelper<RowObj>();
  const { tableData } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<RowObj | null>(null);

  const handleView = (rowObj: RowObj) => {
    setSelectedRow(rowObj);
    setShowDrawer(true);
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
    columnHelper.accessor("path", {
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
    columnHelper.accessor("threats", {
      id: "risk",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          RISK
        </p>
      ),
      cell: (info) => {
        const threats = info.getValue() as Threat[];
        const risk = threats.reduce((acc, threat) => {
          if (threat.severity === "High") {
            return "High";
          } else if (threat.severity === "Medium") {
            return acc === "High" ? "High" : "Medium";
          } else {
            return acc === "High" || acc === "Medium" ? acc : "Low";
          }
        }, "None Detected");
        return (
          <p
            className={`text-sm font-bold ${
              risk === "Low"
                ? "text-green-500 dark:text-green-300"
                : risk === "Medium"
                ? "text-amber-500 dark:text-amber-300"
                : risk === "High"
                ? "text-red-500 dark:text-red-300"
                : "text-gray-500 dark:text-gray-300"
            }`}
          >
            {risk}
          </p>
        );
      },
    }),
    columnHelper.accessor("enabled", {
      id: "status",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          STATUS
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue() ? "Active" : "Disabled"}
        </p>
      ),
    }),
    columnHelper.accessor("summary", {
      id: "summary",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          SUMMARY
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("enabled", {
      id: "actions",
      header: () => (
        <p className="mr-1 inline text-sm font-bold text-gray-600 dark:text-white">
          ACTIONS
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center space-x-2">
          <button
            className={` flex items-center justify-center rounded-lg bg-lightPrimary p-[0.4rem]  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10`}
          >
            {info.getValue() ? "Disable" : "Enable"}
          </button>
          <button
            onClick={() => handleView(info.row.original)}
            className={` flex items-center justify-center rounded-lg bg-lightPrimary p-[0.4rem]  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10`}
          >
            <FaInfo className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ]; // eslint-disable-next-line

  const [data, _] = useState(() => [...tableData]);
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
            Endpoints
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
      {selectedRow && (
        <ApiDetailDrawer
          endpoint={selectedRow}
          open={showDrawer}
          hide={() => setShowDrawer(false)}
        />
      )}
    </>
  );
};

export default EndpointTable;
