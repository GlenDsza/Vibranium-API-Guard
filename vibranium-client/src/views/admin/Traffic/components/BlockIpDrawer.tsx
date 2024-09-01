import { Drawer } from "@material-tailwind/react";
import { IoMdClose } from "react-icons/io";
import EndpointTable from "./IpTable";
import { ipaddresses, TempIP } from "@/constants/miscellaneous";
import { FC, useState } from "react";
import { MdLock } from "react-icons/md";
import { toast } from "react-toastify";

interface ApiDetailDrawerProps {
  open: boolean;
  hide: () => void;
}

const ApiDetailDrawer: FC<ApiDetailDrawerProps> = ({ open, hide }) => {
  const [myips, setMyIps] = useState<TempIP[]>(ipaddresses);
  const [inputip, setInputIp] = useState<string>("");

  const addIp = () => {
    if (inputip) {
      setMyIps([...myips, { ip: inputip }]);
      setInputIp("");
      toast.success("Ip Blocked Successfully");
    }
  };

  return (
    <Drawer
      open={open}
      onClose={hide}
      size={600}
      placement="right"
      placeholder={true}
      className="p-4 z-50 ps-6 rounded-t-lg overflow-y-scroll"
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Endpoint Details
        </div>
        <button
          onClick={hide}
          className="text-lg text-gray-400 dark:text-white"
        >
          <IoMdClose className="w-7 h-7 me-2 dark:text-white-300 inline" />
        </button>
      </div>
      <div className="w-full flex gap-2">
        <input
          type="text"
          placeholder="Ip Address"
          className="block w-5/6 rounded-2xl p-4 h-full min-h-[32px] bg-red-50"
          value={inputip}
          onChange={(e) => setInputIp(e.target.value)}
        />
        <button
          className={`w-16  flex items-center justify-center rounded-2xl bg-lightPrimary p-[0.4rem]  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10`}
          onClick={addIp}
        >
          <MdLock className="h-5 w-5 text-red-500 " />
        </button>
      </div>
      <div>
        <EndpointTable tableData={myips} />
      </div>
    </Drawer>
  );
};

export default ApiDetailDrawer;
