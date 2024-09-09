import TableSkeleton from "@/components/skeleton/TableSkeleton";
import EndpointTable from "./components/EndpointTable";
import { useAppDispatch, useAppSelector } from "@/app/store";
import ProgressBarModal from "./components/ProgressBarModal";
import { useDisclosure } from "@chakra-ui/hooks";
import { fetchEndpoints, updateEndpoint } from "@/app/features/EndpointSlice";
import { toast } from "react-toastify";

const Endpoints = () => {
  const endpoints = useAppSelector((state) => state.endpoints.data);
  const dispatch = useAppDispatch();

  const getEndpoints = async (): Promise<void> => {
    await dispatch(
      fetchEndpoints({
        organization: localStorage.getItem("organization") as string,
      })
    );
  };

  const updateEndpointAndReload = async (
    id: string,
    enabled?: boolean,
    secure?: boolean
  ): Promise<void> => {
    if (enabled === undefined && secure === undefined) return;
    if (enabled !== undefined)
      await dispatch(
        updateEndpoint({ endpointId: id, data: { enabled: enabled } })
      );
    if (secure !== undefined)
      await dispatch(
        updateEndpoint({ endpointId: id, data: { secure: secure } })
      );
    await getEndpoints();
    toast.success("Endpoint updated successfully");
  };

  const {
    isOpen: isProgressOpen,
    onOpen: onProgressOpen,
    onClose: onProgressClose,
  } = useDisclosure();

  return (
    <div>
      <div className="mx-3 my-3 grid grid-cols-1">
        {endpoints.length > 0 ? (
          <EndpointTable
            tableData={endpoints}
            updateEndpoint={updateEndpointAndReload}
            onProgressOpen={onProgressOpen}
            onProgressClose={onProgressClose}
          />
        ) : (
          <TableSkeleton />
        )}
        <ProgressBarModal
          onClose={onProgressClose}
          isOpen={isProgressOpen}
          loading={isProgressOpen}
        />
      </div>
    </div>
  );
};

export default Endpoints;
