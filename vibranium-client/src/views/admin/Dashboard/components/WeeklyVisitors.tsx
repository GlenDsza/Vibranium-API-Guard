import Card from "@/components/card";
import LineChart from "@/components/charts/LineChart";
import {
  lineChartOptionsTotalSpent,
  singleLineChartDataTotalSpent,
} from "@/variables/charts";
import { FaChartLine } from "react-icons/fa6";

const WeeklyVisitors = () => {
  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center col-span-2">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          Unique Visitors (Past 7 Days)
        </h2>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <FaChartLine className="h-6 w-6" />
        </button>
      </div>

      <div className="md:mt-16 lg:mt-0">
        <div className="h-[250px] w-full xl:h-[350px]">
          <LineChart
            chartData={singleLineChartDataTotalSpent}
            chartOptions={lineChartOptionsTotalSpent}
          />
        </div>
      </div>
    </Card>
  );
};

export default WeeklyVisitors;
