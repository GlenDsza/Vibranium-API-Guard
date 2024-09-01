import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import SortMenu from "./components/Dropdown";
import { FaPlus } from "react-icons/fa";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

import { BiCollection } from "react-icons/bi";

interface Collection {
  name: string;
  description: string;
  tags?: string;
  endpoints: string[];
  organization: string;
  createdAt: Date;
  updatedAt: Date;
}

const Collections = () => {
  const collections: Collection[] = [
    {
      name: "Example Collection 1",
      description: "This is an example collection",
      tags: "example, test",
      endpoints: ["66d3f5a10220c8952a1c9f13", "66d3f5a10220c8952a1c9f14"],
      organization: "66d3f5019ce5c53aeb973d6e",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Example Collection 2",
      description: "This is another example collection",
      endpoints: ["66d3f5a10220c8952a1c9f15"],
      organization: "66d3f5019ce5c53aeb973d6e",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  const [searchTxt, setSearchTxt] = useState<string>("");
  const [accOpen, setAccOpen] = useState<number>(0);
  const handleOpen = (value: number) =>
    setAccOpen(accOpen === value ? 0 : value);

  function NewIcon({ id, open }: { id: number; open: number }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${
          id === open ? "rotate-180" : ""
        } h-5 w-5 transition-transform me-5`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    );
  }

  return (
    <div>
      <div className="m-3 mt-8">
        <div className="flex gap-6 w-full mb-8">
          {/* Search Bar componet */}
          <div
            className="flex h-full items-center  bg-white text-navy-700 ease-in-out dark:bg-navy-900 dark:text-white p-4 rounded-lg w-[650vw]  border-brand-400"
            style={{
              borderWidth: "1px",
            }}
          >
            <p className="pl-3 pr-2 text-xl ">
              <FiSearch className="h-6 w-6 text-brand-400 dark:text-white" />
            </p>
            <input
              type="text"
              onChange={(e) => setSearchTxt(e.target.value)}
              value={searchTxt}
              placeholder="Search API Collections..."
              className="block h-full w-full rounded-full bg-white text-brand-400 text-lg font-medium outline-none dark:bg-navy-900 dark:text-white placeholder:text-brand-400"
            />
          </div>

          {/* Sort Drop Down */}
          <SortMenu />
          {/* Create Button */}

          <button
            onClick={() => {}}
            className={`flex h-full items-center  bg-white text-brand-400 ease-in-out dark:bg-navy-900 dark:text-white p-4 rounded-lg text-lg font-bold border-brand-400 px-6`}
            style={{
              borderWidth: "1px",
            }}
          >
            <FaPlus className="h-4 w-4 mr-2" /> Create
          </button>
        </div>

        {collections.map((item, index) => (
          <>
            <Accordion
              open={accOpen === index + 1}
              icon={<NewIcon id={index + 1} open={accOpen} />}
              key={index + 1}
              placeholder={true}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              className="bg-white dark:bg-navy-900 mb-5 rounded-lg shadow-lg dark:shadow-none"
            >
              <AccordionHeader
                onClick={() => handleOpen(index + 1)}
                placeholder={true}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <p className="font-bold ms-3 flex gap-4 items-center">
                  <BiCollection className="h-6 w-6 " /> {item.name}
                </p>
              </AccordionHeader>
              <AccordionBody>body 1</AccordionBody>
            </Accordion>
          </>
        ))}
      </div>
    </div>
  );
};

export default Collections;
