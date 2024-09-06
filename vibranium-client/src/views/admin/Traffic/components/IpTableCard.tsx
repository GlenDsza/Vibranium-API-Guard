import Card from "@/components/card";
import { useState, type FC } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import EndpointTable from "./IpTable";
import BlockIpDrawer from "./BlockIpDrawer";

const ApisByRiskScore: FC = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  return (
    <>
      <Card extra=" bg-white w-full rounded-3xl py-6 px-2 text-center col-span-2 h-[440px] overflow-auto">
        <div className="mb-auto flex items-center justify-between px-6 h-[10%]">
          <h2 className="text-lg font-bold text-navy-700 dark:text-white">
            Blacklisted IPs
          </h2>
          <button
            className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10"
            onClick={() => setShowDrawer(true)}
          >
            <MdAddCircleOutline className="h-6 w-6" />
          </button>
        </div>
        <div className="h-[90%]">
          <EndpointTable tableData={[]} />
        </div>
      </Card>
      {showDrawer && (
        <BlockIpDrawer open={showDrawer} hide={() => setShowDrawer(false)} />
      )}
    </>
  );
};

export default ApisByRiskScore;
