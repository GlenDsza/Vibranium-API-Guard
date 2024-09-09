import { Drawer } from "@material-tailwind/react";
import { useEffect, useRef, useState, type FC } from "react";
import { BiCollection } from "react-icons/bi";
import { FaPlay, FaRegClock } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BsExclamationCircle } from "react-icons/bs";
import { IoCopyOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineUpdate } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { getDateTime } from "@/constants/utils";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { Endpoint } from "@/app/features/EndpointSlice";
import { Collection } from "@/utils/interfaces";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { getTests, TestObject } from "@/apis/tests";

interface CustomTestObject {
  method: string;
  endpoint: string;
  date: string;
  time: string;
  tests_performed: number;
  status: boolean;
  actions: TestObject;
}
interface ApiDetailDrawerProps {
  open: boolean;
  hide: () => void;
  endpoint: Endpoint;
  onProgressOpen: () => void;
  onProgressClose: () => void;
}

const ApiDetailDrawer: FC<ApiDetailDrawerProps> = ({
  open,
  hide,
  endpoint,
  onProgressOpen,
}) => {
  const {
    _id,
    method,
    path,
    summary,
    organization,
    requestBody,
    responses,
    threats,
    createdAt,
    updatedAt,
    parameters,
    enabled,
    operationId,
    secure,
  } = endpoint;

  const [risk, setRisk] = useState<string>("Low");
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [accOpen, setAccOpen] = useState<number>(0);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tests, setTests] = useState<CustomTestObject[]>([]);
  const opResponse = useRef<Map<string, any>>(null);
  const handleOpen = (value: number) =>
    setAccOpen(accOpen === value ? 0 : value);

  useEffect(() => {
    computeRisk();
    getRelatedCollections(_id);
    getFilteredTests(_id);
  }, [endpoint]);

  useEffect(() => {
    if (responses) {
      getResponses();
    }
  }, [responses]);

  const runTests = async (): Promise<void> => {
    hide();
    onProgressOpen();
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/test/${_id}`, {
      organization: organization._id,
      secure: secure,
    });
  };

  const computeRisk = () => {
    let temp = threats.reduce((acc, threat) => {
      if (threat.severity === "High") {
        return "High";
      } else if (threat.severity === "Medium") {
        return acc === "High" ? "High" : "Medium";
      } else {
        return acc === "High" || acc === "Medium" ? acc : "Low";
      }
    }, "None Detected");
    setRisk(temp);
  };

  const getRelatedCollections = async (id: string): Promise<void> => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/collections?endpointId=${id}`
    );
    setCollections(res.data);
  };

  const getResponses = () => {
    let temp = new Map<string, any>();
    for (const [key, value] of Object.entries(responses)) {
      temp.set(key, value);
    }
    opResponse.current = temp;
  };

  const getFilteredTests = async (endpoint: string): Promise<void> => {
    getTests(endpoint).then((res) => {
      if (res.success) {
        const data = res.data;

        data.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        const rows: CustomTestObject[] = data.map((row) => {
          const { endpoint, createdAt, testsPerformed } = row;
          let time = createdAt.split("T")[1].split(".")[0];
          let hours = parseInt(time.split(":")[0]);
          let minutes = parseInt(time.split(":")[1]);
          let suffix = hours >= 12 ? "PM" : "AM";
          hours = hours % 12;
          hours = hours ? hours : 12;
          time = hours + ":" + minutes + " " + suffix;

          return {
            method: endpoint.method,
            endpoint: endpoint.path,
            date: createdAt.split("T")[0],
            time,
            tests_performed: testsPerformed.length,
            status: testsPerformed.every((test: any) => test.testSuccess),
            actions: row,
          };
        });
        setTests(rows);
      }
    });
  };

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
              <p className="font-bold text-navy-700 dark:text-white">
                {method.toUpperCase()}
              </p>
            </div>
            <p className="font-bold text-navy-700 dark:text-white">{path}</p>
            <IoCopyOutline className="h-4 w-4 text-gray-400 dark:text-white cursor-pointer" />
          </div>
          <div className="col-span-1">
            <button
              onClick={runTests}
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
            <p className="text-sm font-bold ms-3">
              {collections.length > 0
                ? collections.map((collection) => collection.name).join(", ")
                : "-"}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <TbFileDescription className="h-5 w-5 text-gray-600 dark:text-white" />
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Summary
              </p>
            </div>
            <p className="text-sm font-bold ms-3">{summary}</p>
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
            <p className="text-sm font-bold ms-3">
              {secure ? "Secure" : "Public"}
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
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <FaRegClock className="h-5 w-5 text-gray-600 dark:text-white" />
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Discovered
              </p>
            </div>
            <p className="text-sm font-bold ms-3">{getDateTime(createdAt)}</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <MdOutlineUpdate className="h-5 w-5 text-gray-600 dark:text-white" />
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Last Updated
              </p>
            </div>
            <p className="text-sm font-bold ms-3">{getDateTime(updatedAt)}</p>
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
              Structure
            </Tab>
            <Tab className="text-sm font-bold text-gray-600 dark:text-white  focus:text-brand-800 focus:border-b-2 focus:border-brand-800 focus:bg-lightPrimary  p-3 rounded-md rounded-b-none pb-2">
              Schema
            </Tab>
            <Tab className="text-sm font-bold text-gray-600 dark:text-white  focus:text-brand-800 focus:border-b-2 focus:border-brand-800 focus:bg-lightPrimary  p-3 rounded-md rounded-b-none pb-2">
              Tests
            </Tab>
            <Tab className="text-sm font-bold text-gray-600 dark:text-white  focus:text-brand-800 focus:border-b-2 focus:border-brand-800 focus:bg-lightPrimary  p-3 rounded-md rounded-b-none pb-2">
              Threats
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="mt-6 ms-3 grid grid-cols-3">
                <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                  Enabled
                </div>
                <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                  {enabled ? "true" : "false"}
                </div>
              </div>

              <hr className="m-3" />

              <div className="ms-3 grid grid-cols-3">
                <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                  Operation ID
                </div>
                <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                  {operationId}
                </div>
              </div>

              <hr className="m-3 mb-1" />
              <Accordion
                open={accOpen === 1}
                icon={<NewIcon id={1} open={accOpen} />}
                placeholder={true}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <AccordionHeader
                  onClick={() => handleOpen(1)}
                  placeholder={true}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <p className="font-bold ms-3">Params</p>
                </AccordionHeader>
                <AccordionBody>
                  <div className="ms-3 mt-[-1rem]">
                    {parameters.length < 1 ? (
                      <p>
                        <span className="text-gray-600 dark:text-white">
                          No parameters
                        </span>
                      </p>
                    ) : (
                      parameters.map((param) => (
                        <div className="bg-gray-100 dark:bg-navy-700 dark:text-white p-3 rounded-lg">
                          <div className="grid grid-cols-3">
                            <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                              name
                            </div>
                            <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                              {param.name}
                            </div>
                          </div>

                          <hr className="my-3 bg-gray-300 h-[0.1rem]" />

                          <div className="grid grid-cols-3">
                            <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                              in
                            </div>
                            <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                              {param.in}
                            </div>
                          </div>

                          <hr className="my-3 bg-gray-300 h-[0.1rem]" />

                          <div className="grid grid-cols-3">
                            <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                              type
                            </div>
                            <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                              {param.schemaRef.type}
                            </div>
                          </div>

                          <hr className="my-3 bg-gray-300 h-[0.1rem]" />

                          <div className="grid grid-cols-3">
                            <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                              required
                            </div>
                            <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                              {param.required ? "true" : "false"}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </AccordionBody>
              </Accordion>
            </TabPanel>
            <TabPanel>
              <Accordion
                open={accOpen === 2}
                icon={<NewIcon id={2} open={accOpen} />}
                placeholder={true}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <AccordionHeader
                  onClick={() => handleOpen(2)}
                  placeholder={true}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <p className="font-bold ms-3">Request</p>
                </AccordionHeader>
                <AccordionBody>
                  <div className="ms-3 grid grid-cols-3">
                    <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                      request-body
                    </div>
                    <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                      {requestBody ? "true" : "false"}
                    </div>
                  </div>

                  <hr className="m-3" />
                  {requestBody ? (
                    <>
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
                          schema
                        </div>
                        <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4 font-bold">
                          {
                            requestBody.content["application/json"].schemaRef
                              .title
                          }
                        </div>
                      </div>

                      <hr className="m-3" />
                      <div className="ms-3 grid grid-cols-3">
                        <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                          required
                        </div>
                        <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4 font-bold">
                          {`[`} &nbsp;
                          {requestBody.content[
                            "application/json"
                          ].schemaRef.required
                            .slice(0, -1)
                            .map((item) => item)
                            .join(", ") +
                            ", " +
                            requestBody.content[
                              "application/json"
                            ].schemaRef.required.slice(-1)[0]}
                          &nbsp;{`]`}
                        </div>
                      </div>

                      <div className="ms-3 bg-gray-100 dark:bg-navy-700 dark:text-white p-3 rounded-lg mt-3">
                        {`{`}
                        {requestBody.content[
                          "application/json"
                        ].schemaRef.properties.map((property) => (
                          <>
                            <div className="ms-3">
                              <span className="text-blue-900 font-bold">
                                {property.name}:
                              </span>{" "}
                              {property.type
                                ? property.type
                                : property.anyOf
                                    .slice(0, -1)
                                    .map((item) => item.type)
                                    .join(" | ") +
                                  " | " +
                                  property.anyOf.slice(-1)[0].type}
                            </div>
                          </>
                        ))}
                        {`}`}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </AccordionBody>
              </Accordion>
              <Accordion
                open={accOpen === 3}
                icon={<NewIcon id={3} open={accOpen} />}
                placeholder={true}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <AccordionHeader
                  onClick={() => handleOpen(3)}
                  placeholder={true}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <p className="font-bold ms-3">Response</p>
                </AccordionHeader>
                <AccordionBody>
                  {opResponse.current &&
                    Array.from(opResponse.current.entries()).map(
                      ([key, value]) => {
                        return (
                          <div key={key} className="mb-8">
                            <div className="ms-3 grid grid-cols-3">
                              <div className="col-span-1 flex justify-start items-center font-poppins text-lg text-gray-600 dark:text-white font-bold">
                                Response Code
                              </div>
                              <div className="col-span-2 flex justify-end items-center font-poppins text-gray-600 dark:text-white pe-4 text-lg font-bold">
                                {key}
                              </div>
                            </div>
                            <hr className="m-3" />
                            <div className="ms-3 grid grid-cols-3">
                              <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                                Description
                              </div>
                              <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                                {value.description}
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
                            <div className="ms-3 bg-gray-100 dark:bg-navy-700 dark:text-white p-3 rounded-lg mt-3">
                              {`{`}

                              {value.content &&
                                value.content[
                                  "application/json"
                                ].schemaRef.properties.map((property: any) => (
                                  <>
                                    <div className="ms-3">
                                      <span className="text-blue-900 font-bold">
                                        {property.name || property.title}:
                                      </span>{" "}
                                      {property.type}
                                    </div>
                                  </>
                                ))}
                              {`}`}
                            </div>
                          </div>
                        );
                      }
                    )}
                </AccordionBody>
              </Accordion>
            </TabPanel>
            <TabPanel>
              {tests.length < 1 ? (
                <p className="text-gray-600 dark:text-white ms-3">
                  No Test Runs found
                </p>
              ) : (
                <>
                  <div className="flex justify-end">
                    <div className="flex h-full min-h-[32px] items-center rounded-lg bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px] mb-2">
                      <p className="pl-3 pr-2 text-xl">
                        <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                      </p>
                      <input
                        type="text"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                        className="block h-full min-h-[32px] w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                      />
                    </div>
                  </div>
                  {tests.map((test, index) => (
                    <Accordion
                      open={accOpen === index + 1}
                      icon={<NewIcon id={index + 1} open={accOpen} />}
                      placeholder={true}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      <AccordionHeader
                        onClick={() => handleOpen(index + 1)}
                        placeholder={true}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        <div className="flex gap-3">
                          <p className="font-semibold ms-3 text-sm">
                            {test.tests_performed} tests performed on
                            {" " + test.date} at{" " + test.time}
                          </p>
                          <div
                            className={`flex items-center justify-center text-xs font-semibold rounded-md px-2 ${
                              test.status
                                ? "bg-green-200 text-green-600"
                                : "bg-red-300 text-red-600"
                            } `}
                          >
                            {test.status ? "Passed" : "Failed"}
                          </div>
                        </div>
                      </AccordionHeader>
                      <AccordionBody>
                        <div className="ms-3">
                          {test.actions.testsPerformed.map((testCase) => (
                            <>
                              <div className="grid grid-cols-3">
                                <div className="col-span-2 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                                  {testCase.testName}
                                </div>
                                <div className="col-span-1 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                                  {testCase.testSuccess ? (
                                    <span className="text-green-600 dark:text-green-300">
                                      Passed
                                    </span>
                                  ) : (
                                    <span className="text-red-600 dark:text-red-300">
                                      Failed
                                    </span>
                                  )}
                                </div>
                              </div>

                              <hr className="my-3" />
                            </>
                          ))}
                        </div>
                      </AccordionBody>
                    </Accordion>
                  ))}
                </>
              )}
            </TabPanel>
            <TabPanel>
              {threats.length < 1 ? (
                <p className="text-gray-600 dark:text-white ms-3">
                  No threats detected
                </p>
              ) : (
                <>
                  <div className="flex justify-end">
                    <div className="flex h-full min-h-[32px] items-center rounded-lg bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px] mb-2">
                      <p className="pl-3 pr-2 text-xl">
                        <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                      </p>
                      <input
                        type="text"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                        className="block h-full min-h-[32px] w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                      />
                    </div>
                  </div>
                  {threats.map((threat, index) => (
                    <Accordion
                      open={accOpen === index + 1}
                      icon={<NewIcon id={index + 1} open={accOpen} />}
                      placeholder={true}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      <AccordionHeader
                        onClick={() => handleOpen(index + 1)}
                        placeholder={true}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        <div className="flex gap-3">
                          <p className="font-bold ms-3 text-sm">
                            {threat.name}
                          </p>
                          <div
                            className={`flex items-center justify-center text-xs font-semibold rounded-md px-2 ${
                              threat.severity === "Low"
                                ? "bg-yellow-200 text-yellow-600"
                                : threat.severity === "Medium"
                                ? "bg-orange-300 text-orange-600"
                                : "bg-red-300 text-red-600"
                            } `}
                          >
                            {threat.severity}

                            <BsExclamationCircle className="ms-1 h-3 w-3" />
                          </div>
                        </div>
                      </AccordionHeader>
                      <AccordionBody>
                        <div className="bg-gray-100 dark:bg-navy-700 dark:text-white p-3 rounded-lg ms-3 mt-[-1rem]">
                          <div className="grid grid-cols-3">
                            <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                              name
                            </div>
                            <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                              {threat.name}
                            </div>
                          </div>

                          <hr className="my-3 bg-gray-300 h-[0.1rem]" />

                          <div className="grid grid-cols-3">
                            <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                              severity
                            </div>
                            <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                              {threat.severity}
                            </div>
                          </div>

                          <hr className="my-3 bg-gray-300 h-[0.1rem]" />

                          <div className="grid grid-cols-3">
                            <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                              description
                            </div>
                            <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                              {threat.description}
                            </div>
                          </div>

                          <hr className="my-3 bg-gray-300 h-[0.1rem]" />

                          <div className="grid grid-cols-3">
                            <div className="col-span-1 flex justify-start items-center text-sm font-semibold text-gray-600 dark:text-white">
                              recommendation
                            </div>
                            <div className="col-span-2 flex justify-end items-center text-sm text-gray-600 dark:text-white pe-4">
                              {threat?.recommendations || "-"}
                            </div>
                          </div>
                        </div>
                      </AccordionBody>
                    </Accordion>
                  ))}
                </>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </Drawer>
  );
};

export default ApiDetailDrawer;
