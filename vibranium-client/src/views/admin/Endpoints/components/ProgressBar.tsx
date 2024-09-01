import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from "@chakra-ui/modal";
import Card from "@/components/card";
import { useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import { useAppSelector } from "@/app/store";
import { FaPlus } from "react-icons/fa";
import Progress from "@/components/progress";
import { redirect } from "react-router-dom";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface updateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  createCollection: (data: any) => Promise<void>;
}

interface FormState {
  name: string;
  description: string;
  tags?: string;
  endpoints: string[];
  organization: string;
}

const ProgressBar = ({
  isOpen,
  onClose
}: updateIncidentModalProps) => {
  const stateEndpoints = useAppSelector((state) => state.endpoints.data);
  const [endpointObjs, setEndpointObjs] = useState([]);
  const [ prog, setProg ] = useState(0);
  const navigate: NavigateFunction = useNavigate();

  const handleSubmit = () => {
    createCollection(formState);
    onClose();
  };

  const [formState, setFormState] = useState<FormState>({
    name: "",
    description: "",
    endpoints: [],
    tags: "",
    organization: localStorage.getItem("organization") || "",
  });

  const { name, description, tags, endpoints } = formState;

  useEffect(() => {
    const endpointObjs = stateEndpoints.map((endpoint) => {
      return {
        name: `${endpoint.path} - ${endpoint.method.toUpperCase()}`,
        id: endpoint._id,
      };
    });
    setEndpointObjs(endpointObjs);

    const interval = setInterval(() => {
      const num = Math.floor(Math.random() * 10);
      setProg(prog => {
        if (prog < 100) {
          return prog + num;
        } else {
          clearInterval(interval);  // Stop the interval when prog reaches 100
          setProg(100);  // Ensure it doesn't go above 100
          onClose();
          navigate("/admin/testing");
          return prog;  // Return the current value of prog
        }
      });
    }, 1000);
  }, [stateEndpoints]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay
          className="bg-[#000000A0] !z-[1001]]"
          backdropFilter="blur(10px)"
        />
        <ModalContent className="!z-[1002] !m-auto !w-max min-w-[340px] !max-w-[85%] top-[3vh] md:top-[5vh] overflow-hidden">
          {/* <ModalCloseButton className="right-5 top-5 absolute z-[5000] text-navy-700  hover:text-navy-900 dark:text-gray-500 dark:hover:text-white" /> */}
          <ModalBody className=" overflow-hidden ">
            <Card extra="px-[30px] w-[640px] pt-[35px] pb-[40px] md-max:h-[10vh] flex flex-col !z-[1004] overflow-hidden h-[30vh]">
              <h1
                className={`text-2xl text-navy-700 dark:text-white font-bold text-center mb-6`}
              >
                Running Tests
              </h1>
              <Progress value={prog} color="red"/>
              <div className="flex flex-col justify-center items-center mt-5">
                <h2>{prog}%</h2>
              </div>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProgressBar;
