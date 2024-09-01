import { MdReport } from "react-icons/md";
import { VscDebugCoverage } from "react-icons/vsc";

import Widget from "@/components/widget/Widget";
import { FaTasks } from "react-icons/fa";
import IssuesPieChart from "./components/IssuesByCategory";
import ApisByRiskScore from "./components/ApisByRiskScore";
import WeeklyIssues from "./components/WeeklyIssues";
import TestCoverage from "./components/TestCoverage";

const Dashboard = () => {
  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
        <Widget
          icon={<FaTasks className="h-6 w-6" />}
          title={"Total APIs"}
          subtitle={"23"}
        />
        <Widget
          icon={<MdReport className="h-7 w-7" />}
          title={"Critical Endpoints"}
          subtitle={"4"}
        />
        <Widget
          icon={<VscDebugCoverage className="h-7 w-7" />}
          title={"Test Coverage"}
          subtitle={"87%"}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-5">
        <ApisByRiskScore />
        <IssuesPieChart />
      </div>

      <div className="mt-5 grid grid-cols-5 gap-5">
        <div className="col-span-2: md:col-span-3">
          <WeeklyIssues />
        </div>

        <div className="col-span-2 rounded-[20px]">
          <TestCoverage />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
