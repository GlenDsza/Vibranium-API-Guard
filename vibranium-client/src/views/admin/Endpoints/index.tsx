import TableSkeleton from "@/components/skeleton/TableSkeleton";
import EndpointTable from "./components/EndpointTable";
import { endpoints } from "@/constants/miscellaneous";

const Endpoints = () => {
  return (
    <div>
      <div className="mx-3 my-3 grid grid-cols-1">
        {true ? <EndpointTable tableData={endpoints} /> : <TableSkeleton />}
      </div>
    </div>
  );
};

export default Endpoints;
