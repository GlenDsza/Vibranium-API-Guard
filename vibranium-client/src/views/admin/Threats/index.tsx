import { useAppSelector } from "@/app/store";
import ThreatTable from "./components/ThreatsTable";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

const threats: any[] = [
  {
    endpoint: "60b8d295f3e28c001c8e4b3d", // Example ObjectId string
    name: "SQL Injection",
    description: "SQL injection vulnerability detected.",
    type: "Injection",
    severity: "High",
    recommendations: "Use parameterized queries.",
    status: "Pending",
  },
  {
    endpoint: "60b8d295f3e28c001c8e4b3e",
    name: "Cross-Site Scripting (XSS)",
    description: "XSS vulnerability detected.",
    type: "Scripting",
    severity: "Medium",
    recommendations: "Sanitize user inputs.",
    status: "Resolved",
  },
  {
    endpoint: "60b8d295f3e28c001c8e4b3f",
    name: "Insecure Deserialization",
    description: "Insecure deserialization vulnerability detected.",
    type: "Deserialization",
    severity: "Low",
    status: "Pending",
  },
];

const Threats = () => {
  const team = useAppSelector((state) => state.team.data);
  return (
    <div>
      <div className="mx-3 my-3 grid grid-cols-1">
        {team.length > 0 ? <ThreatTable tableData={team} /> : <TableSkeleton />}
      </div>
    </div>
  );
};

export default Threats;
