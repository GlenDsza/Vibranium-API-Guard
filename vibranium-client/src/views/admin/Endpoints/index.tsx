import TableSkeleton from "@/components/skeleton/TableSkeleton";
import EndpointTable from "./components/EndpointTable";
import { useAppSelector } from "@/app/store";

const Endpoints = () => {
  const endpoints = useAppSelector((state) => state.endpoints.data);
  return (
    <div>
      <div className="mx-3 my-3 grid grid-cols-1">
        {endpoints.length > 0 ? (
          <EndpointTable tableData={endpoints} />
        ) : (
          <TableSkeleton />
        )}
      </div>
    </div>
  );
};

export default Endpoints;
