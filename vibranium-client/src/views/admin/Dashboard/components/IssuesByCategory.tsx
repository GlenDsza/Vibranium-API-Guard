import Card from "@/components/card";
import PieChart from "@/components/charts/PieChart";
import { type FC } from "react";
import { ImEnlarge } from "react-icons/im";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { ThreatType } from "@/apis/dashboard";

interface ThreatsPieChartCategoricalProps {
  threats_by_type: ThreatType[];
}

const ThreatsPieChartCategorical: FC<ThreatsPieChartCategoricalProps> = ({
  threats_by_type,
}) => {
  const navigate: NavigateFunction = useNavigate();

  const pieChartData = threats_by_type.map((threat) => threat.count);
  const labels = threats_by_type.map((threat) => threat._id);

  const pieChartOptions = {
    labels: labels,
    colors: ["#4318FF", "#6AD2FF", "#A8A8A8", "#050C9C", "#A7E6FF"],
    chart: {
      width: "50px",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: true,
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: true,
          },
        },
      },
    },
    fill: {
      colors: ["#4318FF", "#6AD2FF", "#A8A8A8", "#050C9C", "#A7E6FF"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        backgroundColor: "#000000",
      },
    },
  };

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

export default ThreatsPieChartCategorical;
