import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import Card from "@/components/card";
import { useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import { useAppSelector } from "@/app/store";
import { FaPlus } from "react-icons/fa";

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

const CollectionModal = ({
  isOpen,
  onClose,
  createCollection,
}: updateIncidentModalProps) => {
  const stateEndpoints = useAppSelector((state) => state.endpoints.data);
  const [endpointObjs, setEndpointObjs] = useState([]);

  const handleSubmit = () => {
    createCollection(formState);
    setFormState({
      name: "",
      description: "",
      endpoints: [],
      tags: "",
      organization: localStorage.getItem("organization") || "",
    });
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
          <ModalCloseButton className="right-5 top-5 absolute z-[5000] text-navy-700  hover:text-navy-900 dark:text-gray-500 dark:hover:text-white" />
          <ModalBody className=" overflow-hidden ">
            <Card extra="px-[30px] w-[640px] pt-[35px] pb-[40px] md-max:h-[90vh] flex flex-col !z-[1004] overflow-hidden h-[80vh]">
              <h1
                className={`text-2xl text-navy-700 dark:text-white font-bold text-center mb-6`}
              >
                Create Collection
              </h1>

              <div className="relative flex-col my-2 sm:my-0 mb-4">
                <div className="flex items-center ">
                  <label
                    htmlFor="name"
                    className={`text-navy-700 dark:text-white font-bold ml-2`}
                  >
                    Name
                  </label>
                </div>

                <input
                  id="name"
                  value={name}
                  placeholder="Collection Name"
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  className=" relative mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none !border-none !bg-gray-50 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)] mb-6"
                />
              </div>

              <div className="relative flex-col my-2 sm:my-0 mt-4">
                <div className="flex items-center ">
                  <label
                    htmlFor="description"
                    className={`text-navy-700 dark:text-white font-bold ml-2`}
                  >
                    Description
                  </label>
                </div>

                <textarea
                  id="description"
                  value={description}
                  rows={2}
                  placeholder="Collection Description"
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                  className=" relative mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none !border-none !bg-gray-50 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)] mb-6"
                />
              </div>

              <div className="relative flex-col my-2 sm:my-0 mb-4">
                <div className="flex items-center ">
                  <label
                    htmlFor="tags"
                    className={`text-navy-700 dark:text-white font-bold ml-2`}
                  >
                    Tag
                  </label>
                </div>

                <input
                  id="tags"
                  value={tags}
                  placeholder="Collection Tag"
                  onChange={(e) =>
                    setFormState({ ...formState, tags: e.target.value })
                  }
                  className=" relative mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none !border-none !bg-gray-50 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)] mb-6"
                />
              </div>

              <div className="relative flex-col my-2 sm:my-0 mt-8   ">
                <div className="flex items-center ">
                  <label
                    htmlFor="endpoints"
                    className={`text-navy-700 dark:text-white font-bold ml-2`}
                  >
                    API Endpoints
                  </label>
                </div>

                <Multiselect
                  id="endpoints"
                  displayValue="name"
                  isObject={true}
                  selectedValues={endpointObjs.filter((item) =>
                    endpoints.includes(item.id)
                  )}
                  placeholder="Select API Endpoints"
                  showCheckbox={true}
                  onKeyPressFn={function noRefCheck() {}}
                  onRemove={(selectedList, _removedItem) => {
                    setFormState({
                      ...formState,
                      endpoints: selectedList.map((item: any) => item.id),
                    });
                  }}
                  onSearch={function noRefCheck() {}}
                  onSelect={(selectedList, _selectedItem) => {
                    setFormState({
                      ...formState,
                      endpoints: selectedList.map((item: any) => item.id),
                    });
                  }}
                  className=" relative mt-2 flex h-12 w-full items-center rounded-xl border bg-white/0 p-3 text-sm outline-none !border-none !bg-gray-50 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
                  options={endpointObjs}
                />
              </div>

              <div className="my-2 flex flex-col">
                <div className="flex flex-row items-center justify-center mx-2 mt-4 gap-4">
                  <button
                    onClick={handleSubmit}
                    className={` flex items-center justify-center rounded-lg bg-navy-50   font-medium text-brand-600 transition duration-200
           hover:cursor-pointer hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10 p-3`}
                  >
                    <FaPlus className="h-4 w-4 mr-2" /> Create
                  </button>
                </div>
              </div>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CollectionModal;
