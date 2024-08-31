import Card from "@/components/card";
import Progress from "@/components/progress";
import { apisForCoverage } from "@/constants/miscellaneous";
import { ImEnlarge } from "react-icons/im";
import { NavigateFunction, useNavigate } from "react-router-dom";

const TestCoverage = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <Card extra={"w-full sm:overflow-auto h-[440px]"}>
      <header className="relative flex items-center justify-between p-6 pb-0">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Test Coverage
        </div>

        <button
          onClick={() => {
            navigate("/admin/staff");
          }}
          className={`linear flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-xl font-bold text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10`}
        >
          <ImEnlarge className="h-4 w-4" />
        </button>
      </header>

      <div className="mt-4 mb-6 px-6 overflow-y-scroll xl:overflow-x-hidden">
        {apisForCoverage.map((api, index) => (
          <div className="flex flex-col" key={index + 1}>
            <p className="font-dm text-sm font-medium text-gray-600 mb-3">
              {api.name}
            </p>
            <div className="flex gap-3 items-center">
              <Progress value={api.coverage} />
              <span className="text-sm text-gray-600">{api.coverage}%</span>
            </div>
            <hr className="mt-2 mb-4" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TestCoverage;
