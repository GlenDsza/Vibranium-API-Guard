import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/modal";
import Card from "@/components/card";
import { FC, useEffect, useState } from "react";
import Progress from "@/components/progress";

interface ProgressBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

const ProgressBarModal: FC<ProgressBarModalProps> = ({
  isOpen,
  onClose,
  loading,
}) => {
  const [prog, setProg] = useState<number>(0);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        // increase progress by random 0-25% every second and max out at 90% then pause
        const num = Math.floor(Math.random() * 25);
        setProg((prog) => {
          if (prog < 100) {
            if (prog + num > 100) return 100;
            return prog + num;
          } else {
            clearInterval(interval);
            setProg(100);
            onClose();
            return 0;
          }
        });
      }, 1000);
    }
  }, [loading]);

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
          <ModalBody className=" overflow-hidden ">
            <Card extra="px-[30px] w-[640px] pt-[35px] pb-[40px] md-max:h-[10vh] flex flex-col !z-[1004] overflow-hidden h-[30vh]">
              <h1
                className={`text-2xl text-navy-700 dark:text-white font-bold text-center mb-6`}
              >
                Running Tests
              </h1>
              <Progress value={prog} />
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

export default ProgressBarModal;
