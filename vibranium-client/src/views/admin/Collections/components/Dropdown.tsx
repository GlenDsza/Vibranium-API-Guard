import { useState } from "react";
import Dropdown from "@/components/dropdown";
import { AiOutlineUser } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { AiOutlineShop } from "react-icons/ai";
import { TiLightbulb } from "react-icons/ti";

import { FaChevronDown } from "react-icons/fa6";

function SortMenu(props: { transparent?: boolean }) {
  const { transparent } = props;
  const [open, setOpen] = useState(false);
  return (
    <Dropdown
      button={
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center text-xl hover:cursor-pointer bg-white border-brand-400 p-2 text-brand-400 hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10 linear justify-center rounded-lg font-bold transition duration-200 border-transparent px-6`}
          style={{
            borderWidth: "1px",
          }}
        >
          Sort
          <FaChevronDown className=" ms-2 h-4 w-4" />
        </button>
      }
      animation={"origin-top-right transition-all duration-300 ease-in-out"}
      classNames={`${transparent ? "top-8" : "top-11"} right-0 w-max`}
      children={
        <div className="z-50 w-max rounded-xl bg-white px-4 py-3 text-sm shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="hover:text-black flex cursor-pointer items-center gap-2 text-gray-600 hover:font-medium">
            <span>
              <AiOutlineUser />
            </span>
            Panel 1
          </p>
          <p className="hover:text-black mt-2 flex cursor-pointer items-center gap-2 pt-1 text-gray-600 hover:font-medium">
            <span>
              <AiOutlineShop />
            </span>
            Panel 2
          </p>
          <p className="hover:text-black mt-2 flex cursor-pointer items-center gap-2 pt-1 text-gray-600 hover:font-medium">
            <span>
              <TiLightbulb />
            </span>
            Panel 3
          </p>
          <p className="hover:text-black mt-2 flex cursor-pointer items-center gap-2 pt-1 text-gray-600 hover:font-medium">
            <span>
              <FiSettings />
            </span>
            Panel 4
          </p>
        </div>
      }
    />
  );
}

export default SortMenu;
