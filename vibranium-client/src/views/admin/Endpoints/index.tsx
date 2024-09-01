import TableSkeleton from "@/components/skeleton/TableSkeleton";
import EndpointTable from "./components/EndpointTable";
import { useAppSelector } from "@/app/store";
import ProgressBar from "./components/ProgressBar";
import { useDisclosure } from "@chakra-ui/hooks";

const Endpoints = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const endpoints = useAppSelector((state) => state.endpoints.data);

  return (
    <div>
      <div className="mx-3 my-3 grid grid-cols-1">
        {endpoints.length > 0 ? (
          <EndpointTable tableData={endpoints} onOpen={onOpen}/>
        ) : (
          <TableSkeleton />
        )}
        <ProgressBar
          onClose={onClose}
          isOpen={isOpen}
        />
      </div>
    </div>
  );
};

export default Endpoints;
