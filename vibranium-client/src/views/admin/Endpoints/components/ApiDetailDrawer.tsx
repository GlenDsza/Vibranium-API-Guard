import { Endpoint } from "@/constants/miscellaneous";
import { Drawer } from "@material-tailwind/react";
import { useState, type FC } from "react";
import { BiCollection } from "react-icons/bi";
import { FaPlay, FaLock, FaRegClock } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BsExclamationCircle } from "react-icons/bs";
import { IoCopyOutline } from "react-icons/io5";
import { LuGlobe } from "react-icons/lu";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { getDateTime } from "@/constants/utils";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

interface ApiDetailDrawerProps {
  open: boolean;
  hide: () => void;
  endpoint: Endpoint;
}

const ApiDetailDrawer: FC<ApiDetailDrawerProps> = ({
  open,
  hide,
  endpoint,
}) => {
  const [accOpen, setAccOpen] = useState<number>(0);
  const handleOpen = (value: number) =>
    setAccOpen(accOpen === value ? 0 : value);

  const {
    collection,
    hostName,
    accessType,
    authType,
    created_at,
    risk,
    path,
    type,
  } = endpoint;

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
        } h-5 w-5 transition-transform`}
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
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-5">
          <div className="col-span-4 flex gap-4 items-center">
            <div
              className="items-center justify-start rounded-md bg-lightPrimary p-[0.4rem]  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10 ps-2"
            >
              <p className="font-bold text-navy-700 dark:text-white">{type}</p>
            </div>
            <p className="font-bold text-navy-700 dark:text-white">{path}</p>
            <IoCopyOutline className="h-4 w-4 text-gray-400 dark:text-white cursor-pointer" />
          </div>
          <div className="col-span-1">
            <button
              onClick={() => {}}
              className={` flex items-center justify-center rounded-lg bg-brand-50 p-3  font-medium text-brand-500 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10`}
            >
              Run Test
              <FaPlay className="ms-2 h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <BiCollection className="h-5 w-5 text-gray-600 dark:text-white" />
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Collection
              </p>
            </div>
            <p className="text-sm font-bold ms-3">{collection}</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <LuGlobe className="h-5 w-5 text-gray-600 dark:text-white" />
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Host Name
              </p>
            </div>
            <p className="text-sm font-bold ms-3">{hostName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <IoIosInformationCircleOutline className="h-5 w-5 text-gray-600 dark:text-white" />
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Access Type
              </p>
            </div>
            <p className="text-sm font-bold ms-3">{accessType}</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <FaLock className="h-4 w-4 text-gray-600 dark:text-white" />
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Auth Type
              </p>
            </div>
            <p className="text-sm font-bold ms-3">{authType}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <FaRegClock className="h-5 w-5 text-gray-600 dark:text-white" />
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Discovered
              </p>
            </div>
            <p className="text-sm font-bold ms-3">
              {getDateTime(created_at.toString())}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <BsExclamationCircle className="h-4 w-4 text-gray-600 dark:text-white" />
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Risk
              </p>
            </div>
            <p className="text-sm font-bold ms-3">{risk}</p>
          </div>
        </div>

        <Tabs defaultIndex={0}>
          <TabList className="flex w-full gap-6 border-b-2 mb-3">
            <Tab
              className="text-sm font-bold text-gray-600 dark:text-white  focus:text-brand-800 focus:border-b-2 focus:border-brand-800 focus:bg-lightPrimary  p-3 rounded-md rounded-b-none pb-2"
              _selected={{
                color: "#190793",
                backgroundColor: "#f4f7fe",
                borderColor: "#190793",
                borderBottomWidth: "2px",
              }}
            >
              Schema
            </Tab>
            <Tab className="text-sm font-bold text-gray-600 dark:text-white  focus:text-brand-800 focus:border-b-2 focus:border-brand-800 focus:bg-lightPrimary  p-3 rounded-md rounded-b-none pb-2">
              Values
            </Tab>
            <Tab className="text-sm font-bold text-gray-600 dark:text-white  focus:text-brand-800 focus:border-b-2 focus:border-brand-800 focus:bg-lightPrimary  p-3 rounded-md rounded-b-none pb-2">
              Dependency Graph
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Accordion
                open={accOpen === 1}
                icon={<NewIcon id={1} open={accOpen} />}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <AccordionHeader
                  onClick={() => handleOpen(1)}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <p className="font-bold ms-3">Request</p>
                </AccordionHeader>
                <AccordionBody>
                  <div className="ms-3 grid grid-cols-3">
                    <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                      authorization
                    </div>
                    <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                      JWT eyJhbGciOiJIUz6IkpXVCJ9.eyJzdWIiOiIxafgbasjt
                    </div>
                  </div>
                  <hr className="m-3" />
                  <div className="ms-3 grid grid-cols-3">
                    <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                      content-length
                    </div>
                    <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                      2
                    </div>
                  </div>
                  <hr className="m-3" />
                  <div className="ms-3 grid grid-cols-3">
                    <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                      content-type
                    </div>
                    <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                      application/json
                    </div>
                  </div>
                  <hr className="m-3" />
                  <div className="ms-3 grid grid-cols-3">
                    <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                      host
                    </div>
                    <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                      localhost
                    </div>
                  </div>
                </AccordionBody>
              </Accordion>
              <Accordion
                open={accOpen === 2}
                icon={<NewIcon id={2} open={accOpen} />}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <AccordionHeader
                  onClick={() => handleOpen(2)}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <p className="font-bold ms-3">Response</p>
                </AccordionHeader>
                <AccordionBody>
                  <div className="ms-3">
                    We&apos;re not always in the position that we want to be at.
                    We&apos;re constantly growing. We&apos;re constantly making
                    mistakes. We&apos;re constantly trying to express ourselves
                    and actualize our dreams.
                  </div>
                </AccordionBody>
              </Accordion>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </Drawer>
  );
};

export default ApiDetailDrawer;
