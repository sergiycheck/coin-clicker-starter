import React, { useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import useWebSocket from "react-use-websocket";

import { FaChevronRight } from "react-icons/fa6";
import { CounterContext } from "./coin-canvas/counter-context";
import { Scene } from "./coin-canvas/coin-canvas";

type User = {
  id: string;
  userName: string;
  connectionId: string; // ipv4Address | null
  coinCounter: number;
};

const socketUrl = "wss://6ri9wdx49c.execute-api.us-east-1.amazonaws.com/dev";

function App() {
  const place = 161_270;
  const rang = "Silver";
  const incrementValue = 20;
  const app = window.Telegram.WebApp;

  const [dynamoDbUserName, setDynamoDbUsername] = useState("");

  const getUserNameFromUrlParams = useCallback(() => {
    const url = new URL(window.location.href);
    const userName = url.searchParams.get("userName");
    const chatId = url.searchParams.get("chatId");

    if (!userName || !chatId) return null;

    return `${userName}-${chatId}`;
  }, []);

  React.useEffect(() => {
    const userNameFromParams = getUserNameFromUrlParams();
    if (!userNameFromParams) return;

    setDynamoDbUsername(userNameFromParams);
  }, [getUserNameFromUrlParams]);

  const [user, setUser] = useState<User>();
  const [count, setCount] = useState(0);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl);

  const increment = () => {
    if (!user) return;

    setCount((prev) => prev + incrementValue);

    sendJsonMessage({
      action: "increaseCounterHandler",
      id: user.id,
      incrementValue,
    });
  };

  useEffect(() => {
    const jsonMessage = lastJsonMessage as any;

    switch (jsonMessage?.action) {
      case "getUserByUserName":
        if (!jsonMessage.user) {
          const userNameFromParams = getUserNameFromUrlParams();
          sendJsonMessage({ action: "createUserHandler", userName: userNameFromParams });
          return;
        }

        setUser(jsonMessage?.user);
        setCount(jsonMessage?.user.coinCounter);
        break;

      case "createUser":
        setUser(jsonMessage?.user);
        setCount(jsonMessage?.user.coinCounter);

        break;

      case "increaseCounter":
        setCount(jsonMessage?.counter.coinCounter);
        break;

      default:
        break;
    }
  }, [lastJsonMessage, getUserNameFromUrlParams, sendJsonMessage]);

  useEffect(() => {
    if (!user && dynamoDbUserName) {
      sendJsonMessage({ action: "getUserHandler", userName: dynamoDbUserName });
    } else {
      app.ready();
    }
  }, [user, sendJsonMessage, dynamoDbUserName, app]);

  return (
    <div className="flex flex-col h-full relative select-none ">
      {/* gradient background */}
      <div
        className="absolute top-0 left-0 right-0 bottom-0 
        overflow-hidden"
        style={{
          background: "linear-gradient(to top, #354175 -80%, #000 100%)",
        }}
      >
        <div
          className={`absolute h-[369px] w-[369px] translate-x-[-50%] left-[50%] 
            translate-y-[-70%] top-[70%] rounded-full bg-[#757E9B] blur-[50px]`}
        ></div>
      </div>

      {/* header */}
      <div className="absolute translate-x-[-50%] left-[50%] max-w-3xl w-full p-2">
        <div className="flex flex-col space-y-2">
          <div className="rounded bg-zinc-700 p-2 flex justify-center items-center ">
            <div className="flex items-center space-x-1">
              <p className="text-md">Join squad</p>
              <FaChevronRight className="text-sm  text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex justify-center items-center space-x-2">
              <img src="/notecoin.png" alt="coin" width={30} height={30} />
              <h1 className="text-3xl font-bold text-center select-none pointer-events-none">
                {count.toLocaleString("en-US")}
              </h1>
            </div>

            <div className="flex justify-center items-center space-x-3">
              <div className="flex items-center justify-center relative">
                <img src="/icons/left-wreath.svg" alt="left wreath" className="w-[30px]" />
                <div>{place.toLocaleString("en-US").concat("th")}</div>
                <img className="w-[30px]" src="/icons/right-wreath.svg" alt="left wreath" />
              </div>

              <p className="text-sm">·</p>

              <img className="w-[20px]" src="/silver-goblet.png" alt="goblet" />
              <p className="text-sm">{rang}</p>
              <FaChevronRight className="text-xs text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div
        className="absolute bottom-0 w-full max-w-3xl translate-x-[-50%] left-[50%] 
         flex flex-col space-y-3 p-2"
      >
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between p-2">
          <div className="flex flex-col">
            <div className="flex space-x-2 w-fit items-center">
              <p className="text-3xl">⚡</p>

              <div className="flex flex-col space-y-0.5">
                <p className="text-md">1500</p>
                <p className="text-xs text-slate-600">/ 1500</p>
              </div>
            </div>
          </div>

          <div
            className="flex space-x-4 w-fit items-center p-3
              bg-zinc-600/50 ring-1 ring-zinc-500/50 rounded"
          >
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center gap-1">
                <p className="text-md w-[20px] h-[20px]">🐻</p>
                <p className="text-xs">frens</p>
              </div>
              <div className="inline-block h-[30px] w-[0.3px] bg-gray-100/20 "></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className=" flex flex-col items-center gap-1">
                <img src="/notecoin.png" alt="earn notecoin" width={20} height={20} />
                <p className="text-xs">earn</p>
              </div>
              <div className="inline-block h-[30px] w-[0.3px] bg-gray-100/20 "></div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <p className="text-md w-[20px] h-[20px]">🚀</p>
              <p className="text-xs">boosts</p>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className=" h-2.5 rounded-full bg-gradient-to-r from-zinc-800/5 to-zinc-300"
            style={{
              width: "100%",
            }}
          ></div>
        </div>
      </div>

      <CounterContext.Provider value={{ count, increment }}>
        <Canvas>
          <Scene incrementValue={incrementValue} />
        </Canvas>
      </CounterContext.Provider>
    </div>
  );
}

export default App;
