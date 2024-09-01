import Card from "@/components/card";
import { type FC } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import EndpointTable from "./IpTable";
import { ipaddresses } from "@/constants/miscellaneous";

const ApisByRiskScore: FC = () => {
  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center col-span-2 h-[440px] overflow-auto">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          Blacklisted APIs
        </h2>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdAddCircleOutline className="h-6 w-6" />
        </button>
      </div>
      <div>
        <EndpointTable tableData={ipaddresses} />
      </div>
    </Card>
  );
};

export default ApisByRiskScore;
