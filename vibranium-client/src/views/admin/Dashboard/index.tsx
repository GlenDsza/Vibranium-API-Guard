import { MdReport } from "react-icons/md";
import { VscDebugCoverage } from "react-icons/vsc";

import Widget from "@/components/widget/Widget";
import { FaTasks } from "react-icons/fa";
import IssuesPieChart from "./components/IssuesByCategory";
import ApisByRiskScore from "./components/ApisByRiskScore";
import { useEffect, useState } from "react";
import { DashboardData, getDashboardData } from "@/apis/dashboard";

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardData().then((res) => {
      if (res.success) {
        setData(res.data); // Update state with fetched data
      } else {
        console.log("Failed to fetch data");
      }
    });
  }, []);

  if (!data) {
    return <div>Loading...</div>; // Only show loading when data is null
  }

  return (
    <div>
      {/* Card widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
        <Widget
          icon={<FaTasks className="h-6 w-6" />}
          title={"Total APIs"}
          subtitle={data.endpoint_count.toString()}
        />
        <Widget
          icon={<MdReport className="h-7 w-7" />}
          title={"Total Threats"}
          subtitle={data.threats_count.toString()}
        />
        <Widget
          icon={<VscDebugCoverage className="h-7 w-7" />}
          title={"Test Success Rate"}
          subtitle={`${(
            (data.passed_tests_count /
              (data.passed_tests_count + data.failed_tests_count)) *
            100
          ).toFixed(2)}%`}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-5">
        <ApisByRiskScore
          high_severity_threats={data.high_severity_threats}
          medium_severity_threats={data.medium_severity_threats}
          low_severity_threats={data.low_severity_threats}
        />
        <IssuesPieChart threats_by_type={data.threast_by_type} />
      </div>

      {/* <div className="mt-5 grid grid-cols-5 gap-5">
        <div className="col-span-2: md:col-span-3">
          <WeeklyIssues />
        </div>

        <div className="col-span-2 rounded-[20px]">
          <TestCoverage />
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
