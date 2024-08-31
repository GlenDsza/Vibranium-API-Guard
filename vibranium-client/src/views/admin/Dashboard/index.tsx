import { MdReport } from "react-icons/md";
import { VscDebugCoverage } from "react-icons/vsc";

import Widget from "@/components/widget/Widget";
// import StaffTable from "./components/StaffTable";
// import { useAppSelector } from "@/app/store";
// import TableSkeleton from "./components/TableSkeleton";
// import IncidentTable from "./components/IncidentTable";
import { FaTasks } from "react-icons/fa";
// import { SOURCES, getSource } from "../../../constants/validations";
import IssuesPieChart from "./components/IssuesByCategory";
import ApisByRiskScore from "./components/ApisByRiskScore";
import WeeklyIssues from "./components/WeeklyIssues";
import TestCoverage from "./components/TestCoverage";

const Dashboard = () => {
  // const staff = useAppSelector((state) => state.staff.data);
  // const incidents = useAppSelector((state) => state.incidents.data);

  // const detectedIncidents = incidents
  //   .filter((obj) => getSource(obj.source) === SOURCES.CCTV)
  //   .sort((a, b) => (a.status > b.status ? 1 : -1));

  // const reportedIncidents = incidents
  //   .filter((obj) => getSource(obj.source) === SOURCES.USER)
  //   .sort((a, b) => (a.status > b.status ? 1 : -1));

  // const resolvedIncidents = incidents.filter(
  //   (obj) => obj.status === "Resolved"
  // );

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
        <Widget
          icon={<FaTasks className="h-6 w-6" />}
          title={"Total APIs"}
          // subtitle={resolvedIncidents.length.toString()}
          subtitle={"23"}
        />
        <Widget
          icon={<MdReport className="h-7 w-7" />}
          title={"Critical Endpoints"}
          // subtitle={detectedIncidents
          //   .filter((obj) => obj.status === "Pending")
          //   .length.toString()}
          subtitle={"4"}
        />
        <Widget
          icon={<VscDebugCoverage className="h-7 w-7" />}
          title={"Test Coverage"}
          // subtitle={reportedIncidents
          //   .filter((obj) => obj.status === "Pending")
          //   .length.toString()}
          subtitle={"87%"}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-5">
        <ApisByRiskScore />
        <IssuesPieChart />

        {/* {detectedIncidents?.length > 0 ? (
          <IncidentTable
            title="Detected Incidents"
            tableData={detectedIncidents}
          />
        ) : (
          <TableSkeleton type="recentIncident" />
        )} */}
      </div>

      <div className="mt-5 grid grid-cols-5 gap-5">
        <div className="col-span-2: md:col-span-3">
          <WeeklyIssues />

          {/* <TableSkeleton type="recentIncident" /> */}
        </div>

        <div className="col-span-2 rounded-[20px]">
          <TestCoverage />
        </div>

        {/* <TableSkeleton type="staffTable" /> */}
      </div>
    </div>
  );
};

export default Dashboard;
