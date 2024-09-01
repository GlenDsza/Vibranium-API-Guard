import { useAppSelector } from "@/app/store";
import TeamTable from "./components/TeamTable";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

const Team = () => {
  const team = useAppSelector((state) => state.team.data);
  return (
    <div>
      <div className="mx-3 my-3 grid grid-cols-1">
        {team.length > 0 ? <TeamTable tableData={team} /> : <TableSkeleton />}
      </div>
    </div>
  );
};

export default Team;
