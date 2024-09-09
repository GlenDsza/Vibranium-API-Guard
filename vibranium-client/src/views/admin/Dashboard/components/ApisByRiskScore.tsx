import Card from "@/components/card";
import { type FC } from "react";
import { MdBarChart } from "react-icons/md";
import BarChart from "@/components/charts/BarChart";
import { barChartOptionsDailyTraffic } from "@/variables/charts";

interface ApisByRiskScoreProps {
  none_detected_threats: number;
  high_severity_threats: number;
  medium_severity_threats: number;
  low_severity_threats: number;
}

const ApisByRiskScore: FC<ApisByRiskScoreProps> = ({
  none_detected_threats,
  high_severity_threats,
  medium_severity_threats,
  low_severity_threats,
}: {
  none_detected_threats: number;
  high_severity_threats: number;
  medium_severity_threats: number;
  low_severity_threats: number;
}) => {
  console.log(
    high_severity_threats,
    medium_severity_threats,
    low_severity_threats
  );
  const chartData = [
    {
      name: "Threats",
      data: [
        high_severity_threats,
        medium_severity_threats,
        low_severity_threats,
        none_detected_threats,
      ],
    },
  ];

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center col-span-2">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          APIs By Risk Score
        </h2>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="md:mt-16 lg:mt-0">
        <div className="h-[250px] w-full xl:h-[350px]">
          <BarChart
            chartData={chartData}
            chartOptions={barChartOptionsDailyTraffic}
          />
        </div>
      </div>
    </Card>
  );
};

export default ApisByRiskScore;
