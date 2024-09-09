import { getTests } from "@/apis/tests";
import { useAppSelector } from "@/app/store";
import Card from "@/components/card";
import Progress from "@/components/progress";
import { useEffect, useState } from "react";
import { ImEnlarge } from "react-icons/im";
import { NavigateFunction, useNavigate } from "react-router-dom";

const TestCoverage = () => {
  const endpoints = useAppSelector((state) => state.endpoints.data);
  const [tests, setTests] = useState<any[]>([]);
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (endpoints.length > 0) {
      getFilteredTests();
    }
  }, [endpoints]);

  const getFilteredTests = async (): Promise<void> => {
    endpoints.forEach((endpoint) => {
      getTests(endpoint._id).then((res) => {
        if (res.success) {
          const rows: any[] = res.data.map((row) => {
            const { testsPerformed } = row;
            const testsPassed = testsPerformed.filter(
              (test: any) => test.testSuccess
            );

            return {
              endpointId: row.endpoint._id,
              totalTests: testsPerformed.length,
              passedTests: testsPassed.length,
            };
          });
          setTests((prev) => [...prev, ...rows]);
        }
      });
    });
  };
  return (
    <Card extra={"w-full sm:overflow-auto h-[440px]"}>
      <header className="relative flex items-center justify-between p-6 pb-0">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Test Coverage
        </div>

        <button
          onClick={() => {
            navigate("/admin/team");
          }}
          className={`linear flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-xl font-bold text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10`}
        >
          <ImEnlarge className="h-4 w-4" />
        </button>
      </header>

      <div className="mt-4 mb-6 px-6 overflow-y-scroll xl:overflow-x-hidden">
        {endpoints.map(
          (endpoint, index) =>
            tests.filter((test) => test.endpointId === endpoint._id).length >
              0 && (
              <div className="flex flex-col" key={index + 1}>
                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <span className="font-dm text-sm font-medium text-gray-700 mb-3 bg-gray-200 px-2 rounded">
                      {endpoint.path}
                    </span>
                    <span className="font-dm text-sm font-medium text-gray-700">
                      ({endpoint.method.toUpperCase()})
                    </span>
                  </div>
                  <span className="font-dm text-sm font-medium text-gray-700">
                    {tests.filter((test) => test.endpointId === endpoint._id)[0]
                      ?.passedTests || 0}{" "}
                    /{" "}
                    {tests.filter((test) => test.endpointId === endpoint._id)[0]
                      ?.totalTests || 0}{" "}
                    tests passed
                  </span>
                </div>

                <div className="flex gap-3 items-center">
                  <Progress
                    value={Math.floor(
                      ((tests.filter(
                        (test) => test.endpointId === endpoint._id
                      )[0]?.passedTests || 0) /
                        (tests.filter(
                          (test) => test.endpointId === endpoint._id
                        )[0]?.totalTests || 1)) *
                        100
                    )}
                  />
                  <span className="text-sm text-gray-600">
                    {Math.floor(
                      ((tests.filter(
                        (test) => test.endpointId === endpoint._id
                      )[0]?.passedTests || 0) /
                        (tests.filter(
                          (test) => test.endpointId === endpoint._id
                        )[0]?.totalTests || 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <hr className="mt-2 mb-4" />
              </div>
            )
        )}
      </div>
    </Card>
  );
};

export default TestCoverage;
