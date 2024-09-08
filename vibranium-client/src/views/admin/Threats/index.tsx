import ThreatTable from "./components/ThreatsTable";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Threat } from "@/utils/interfaces";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Threats = () => {
  const [threats, setThreats] = useState<Threat[]>([]);

  const getThreats = async () => {
    await axios.get("http://localhost:4000/api/threats").then((response) => {
      setThreats(response.data);
    });
  };

  const updateThreat = async (id: string, status: string): Promise<void> => {
    await axios.put(`http://localhost:4000/api/threats/${id}`, { status });
    await getThreats();
    toast.success("Threat status updated successfully");
  };

  useEffect(() => {
    getThreats();
  }, []);

  return (
    <div>
      <div className="mx-3 my-3 grid grid-cols-1">
        {threats.length > 0 ? (
          <ThreatTable tableData={threats} updateThreat={updateThreat} />
        ) : (
          <TableSkeleton />
        )}
      </div>
    </div>
  );
};

export default Threats;
