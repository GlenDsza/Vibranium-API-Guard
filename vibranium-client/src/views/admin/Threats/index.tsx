import { useAppSelector } from "@/app/store";
import ThreatTable from "./components/ThreatsTable";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

const threats: any[] = [
  {
    endpoint: "60b8d295f3e28c001c8e4b3e",
    path: "/products/{productId}",
    method: "GET",
    name: "Cross-Site Scripting (XSS)",
    description: "XSS vulnerability detected.",
    type: "Scripting",
    severity: "Medium",
    recommendations: "Sanitize user inputs.",
    status: "Pending",
  },
  {
    endpoint: "60b8d295f3e28c001c8e4b3d",
    path: "/products/{productId}",
    method: "GET",
    name: "SQL Injection",
    description: "SQL injection vulnerability detected.",
    type: "Injection",
    severity: "High",
    recommendations: "Use parameterized queries.",
    status: "Pending",
  },
  {
    endpoint: "60b8d295f3e28c001c8e4b3f",
    path: "/orders/{orderId}",
    method: "PUT",
    name: "Broken Access Control",
    description: "Insecure access to sensitive data detected.",
    type: "BOAC",
    severity: "Medium",
    status: "Pending",
  },
  {
    endpoint: "60b8d295f3e28c001c8e4b3f",
    path: "/orders",
    method: "GET",
    name: "Insecure Deserialization",
    description: "Insecure deserialization vulnerability detected.",
    type: "Deserialization",
    severity: "Low",
    status: "Completed",
  },
];

const Threats = () => {
  return (
    <div>
      <div className="mx-3 my-3 grid grid-cols-1">
        {threats.length > 0 ? (
          <ThreatTable tableData={threats} />
        ) : (
          <TableSkeleton />
        )}
      </div>
    </div>
  );
};

export default Threats;
