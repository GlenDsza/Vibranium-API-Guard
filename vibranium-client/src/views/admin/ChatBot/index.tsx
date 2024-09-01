import ChatBody from "./components/ChatBody";
import ChatInput from "./components/ChatInput";
import { useState, useEffect } from "react";

const Chatbot = () => {
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);

  const ingest = async () => {
    setChat((prev) => [
      ...prev,
      {
        role: "ai",
        message: `Hello Glen Dsouza\nI'm your AI Assistant. I can help you navigate through the API's and their issues swiftly.🙂`,
      },
    ]);
  };

  useEffect(() => {
    const count = chat.length;
    if (count % 2 == 0) {
      if (count == 2) {
        setTimeout(() => {
          setChat((prev) => [
            ...prev,
            {
              role: "ai",
              message:
                "There are 2 API's which are vulnerable. \n 1. /products/{productId} (GET): This API is vulnerable to SQL Injection and Cross Site Scripting (XSS) Attacks  \n 2. /orders/{orderId} (PUT): This API is vulnerable to Broken Access Control. \n\nDo you need any further assistance?",
            },
          ]);
        }, 6000);
      }
      if (count == 4) {
        setTimeout(() => {
          setChat((prev) => [
            ...prev,
            {
              role: "ai",
              message:
                "Suspicious Activity Detected: IP 192.168.1.10 was making an unusually high number of requests to the /api/products/search endpoint. \n\n Rate Limiting Activated: Due to the high volume, the Vibranium Shield implemented rate limiting on this IP to prevent potential abuse and maintain system performance.\n\n Blocked Requests: Some requests from IP 192.168.1.10 were blocked to mitigate overload and ensure fair usage for all users.`",
            },
          ]);
        }, 6000);
      }
    }
  }, [chat]);

  useEffect(() => {
    try {
      ingest();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, []);

  const sendMessage = async (newMessage: { role: string; message: string }) => {
    await Promise.resolve(setChat((prev) => [...prev, newMessage]));

    setLoading(true);
    try {
      // await Promise.resolve(
      //   setChat((prev) => [
      //     ...prev,
      //     {
      //       role: "ai",
      //       message:
      //         "There are 2 API's which are vulnerable. \n 1. /products/{productId} (GET): This API is vulnerable to SQL Injection and Cross Site Scripting (XSS) Attacks  \n 2. /orders/{orderId} (PUT): This API is vulnerable to Broken Access Control. \n\nWould you like to see the recommendations for these vulnerabilities?",
      //     },
      //   ])
      // );
    } catch (error) {
      console.log(error);
      throw error;
    }
    setLoading(false);
  };

  const uploadImage = async () => {};

  return (
    <div>
      <div className="my-3 grid grid-cols-1">
        <div className="bg-[#1A232E] rounded-lg shadow-2xl  h-[87vh] py-6 relative text-white overflow-hidden flex flex-col justify-between align-middle">
          {/* gradients */}
          {/* <div className="gradient-01 z-0 absolute"></div> */}
          <div className="gradient-02 z-0 absolute bottom-1"></div>

          {/* Header */}

          <div className=" font-bold text-xl text-center mb-3">
            AI Assistant
          </div>

          {/* Chat Body */}
          <div className="h-[90%] overflow-auto w-full max-w-4xl min-w-[20rem] py-8 self-center px-4">
            <ChatBody chatArr={chat} />
          </div>

          {/* Input */}
          <div className="w-full max-w-4xl min-w-[20rem] self-center px-4">
            <ChatInput
              sendMessage={sendMessage}
              loading={loading}
              uploadImage={uploadImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
