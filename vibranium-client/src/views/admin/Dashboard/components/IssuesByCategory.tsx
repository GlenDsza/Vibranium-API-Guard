import Card from "@/components/card";
import PieChart from "@/components/charts/PieChart";
import { pieChartData, pieChartOptions } from "@/variables/charts";
import { type FC } from "react";
import { ImEnlarge } from "react-icons/im";
import { NavigateFunction, useNavigate } from "react-router-dom";

const IssuesByCategory: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6 col-span-3"}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Issues by Category
        </div>
        <button
          onClick={() => {
            navigate("/admin/detected-incidents");
          }}
          className={`linear flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-xl font-bold text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10`}
        >
          <ImEnlarge className="h-4 w-4" />
        </button>
      </header>

      <div className="mt-2 overflow-x-scroll xl:overflow-x-hidden">
        <div className="w-full">
          <div className="h-[350px] w-full">
            <PieChart chartData={pieChartData} chartOptions={pieChartOptions} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IssuesByCategory;
