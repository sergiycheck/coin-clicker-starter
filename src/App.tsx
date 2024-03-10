import { useState, useEffect, useMemo, useCallback } from "react";
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

const externalLink = {
  href: "https://clicker.joincommunity.xyz",
  joinSquad() {
    return `${this.href}/clicker/league/squad`;
  },
  league() {
    return `${this.href}/clicker/league/5/user`;
  },
  frens() {
    return `${this.href}/clicker/frens`;
  },
  earn() {
    return `${this.href}/clicker/earn`;
  },
  boosts() {
    return `${this.href}/clicker/boosts`;
  },
};

type UserData = {
  query_id: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    allows_write_to_pm: boolean;
  };
  auth_date: number;
  hash: string;
};

function parseInitData(initData: string): UserData | null {
  if (!initData) return null;
  const data = initData.split("&").reduce((acc, item) => {
    const [key, value] = item.split("=");

    let valueDecoded = decodeURIComponent(value);
    try {
      valueDecoded = JSON.parse(valueDecoded);
    } catch (err) {
      null;
    } finally {
      acc[key] = valueDecoded;
    }

    return acc;
  }, {}) as UserData;

  return data;
}

function App() {
  const place = 5;
  const rang = "Diamond";
  const incrementValue = 20;

  const app = useMemo(() => window.Telegram.WebApp, []);

  const [telegramUserData, setTelegramUserData] = useState<UserData | null>(null);
  const [userFromDynamoDb, setUserFromDynamoDb] = useState<User | null>(null);
  const [userNameWithChatId, setUserNameWithChatId] = useState<string | null>(null);

  const [count, setCount] = useState(0);
  const [countToSet, setCountToSet] = useState(0);

  useEffect(() => {
    if (countToSet === 0) return;
    const intervalId = setInterval(() => {
      setCount((prev) => {
        if (prev == countToSet) {
          setCountToSet(0);
          clearInterval(intervalId);
          return prev;
        }
        return prev + 1;
      });
    }, 10);

    return () => {
      clearInterval(intervalId);
    };
  }, [countToSet]);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl);

  const increment = useCallback(() => {
    if (!userFromDynamoDb) return;

    sendJsonMessage({
      action: "increaseCounterHandler",
      id: userFromDynamoDb.id,
      incrementValue,
    });
  }, [incrementValue, sendJsonMessage, userFromDynamoDb]);

  useEffect(() => {
    if (userNameWithChatId) {
      sendJsonMessage({ action: "getUserHandler", userName: userNameWithChatId });
    } else {
      app.ready();
      app.expand();
      const initDataParsed = parseInitData(app.initData);

      // used for development
      // const initData =
      // "query_id=AAGpQR4ZAAAAAKlBHhlZ6IeH&user=%7B%22id%22%3A421413289%2C%22first_name%22%3A%22Serhii%22%2C%22last_name%22%3A%22Kuzmych%22%2C%22username%22%3A%22Sieroga%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1709999012&hash=5abe0c5489ceb1f36780b676728b60f3d231040c04ed4f5ed1fa441278f8355b";
      // const initDataParsed = parseInitData(initData);

      if (!initDataParsed) return;
      setTelegramUserData(initDataParsed);
      setUserNameWithChatId(`${initDataParsed.user.username}-${initDataParsed.user.id}`);
    }
  }, [userNameWithChatId, app, sendJsonMessage]);

  useEffect(() => {
    const jsonMessage = lastJsonMessage as any;
    if (!userNameWithChatId) return;

    switch (jsonMessage?.action) {
      case "getUserByUserName":
        if (!jsonMessage.user) {
          sendJsonMessage({ action: "createUserHandler", userName: userNameWithChatId });
          return;
        }

        setUserFromDynamoDb(jsonMessage?.user);
        setCount(jsonMessage?.user.coinCounter);
        break;

      case "createUser":
        setUserFromDynamoDb(jsonMessage?.user);
        setCount(jsonMessage?.user.coinCounter);

        break;

      case "increaseCounter":
        setCountToSet(jsonMessage?.counter.coinCounter);

        break;

      default:
        break;
    }
  }, [lastJsonMessage, sendJsonMessage, userNameWithChatId, setCountToSet]);

  return (
    <div className="flex flex-col h-screen relative select-none pt-[16px] pb-[20px]">
      {/* gradient background */}
      <div
        className="absolute top-0 left-0 right-0 bottom-0  overflow-hidden"
        style={{
          backgroundImage: "url('/bg-diamond.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          transform: "rotate(180deg)",
        }}
      ></div>

      {/* header */}
      <div className="absolute translate-x-[-50%] left-[50%] max-w-3xl w-full p-2 z-10">
        <div className="flex flex-col space-y-2">
          {/* join squad */}
          <div
            className="rounded bg-zinc-600/50 p-2 flex justify-center items-center "
            onClick={() => {
              window.location.href = externalLink.joinSquad();
            }}
          >
            <div className="flex items-center space-x-1">
              <p className="text-md">Join squad</p>
              <FaChevronRight className="text-sm  text-gray-400" />
            </div>
          </div>

          {/* rank */}
          <div className="flex flex-col space-y-3">
            {/* count of coins */}
            <div className="flex justify-center items-center space-x-2">
              <img src="/icons/minicoin.svg" alt="coin" width={30} height={30} />
              <h1 className="text-3xl font-bold text-center select-none pointer-events-none">
                {count.toLocaleString("en-US")}
              </h1>
            </div>

            {/* position and league */}
            <div
              className="flex justify-center items-center space-x-3 z-10"
              onClick={() => {
                console.log("league");
                window.location.href = externalLink.league();
              }}
            >
              <div className="flex items-center justify-center relative">
                <img src="/icons/left-wreath.svg" alt="left wreath" className="w-[30px]" />
                <div>{place.toLocaleString("en-US").concat("th")}</div>
                <img className="w-[30px]" src="/icons/right-wreath.svg" alt="left wreath" />
              </div>

              <p className="text-sm">·</p>

              <img className="w-[20px]" src="/diamond.png" alt="goblet" />
              <p className="text-sm">{rang}</p>
              <FaChevronRight className="text-xs text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div
        className="absolute bottom-0 w-full max-w-3xl translate-x-[-50%] left-[50%] 
         flex flex-col space-y-2 p-2 z-10"
      >
        {/* energy and progress bar */}
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between space-x-4">
          {/* energy */}
          <div className="flex flex-col">
            <div className="flex space-x-2 w-fit items-center">
              <p className="text-3xl">⚡</p>

              <div className="flex flex-col space-y-0.5">
                <p className="text-md">1500</p>
              </div>
            </div>
          </div>

          {/* energy progress bar */}
          <div className="w-full h-3.5">
            <div className="w-full h-3.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-50"></div>
          </div>
        </div>

        {/* frend earn boosts */}
        <div
          className="grid grid-cols-3 space-x-4 p-3
              bg-zinc-600/50 ring-1 ring-zinc-500/50 rounded"
        >
          {/* frens */}
          <div
            className="flex items-center space-x-3 justify-center relative z-10"
            onClick={() => {
              window.location.href = externalLink.frens();
            }}
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <img src="/icons/box.png" alt="Invite frens" width={27} height={27} />
              <p className="text-xs">Frens</p>
            </div>
            <div className="inline-block h-[30px] w-[0.3px] bg-gray-100/20 absolute right-0"></div>
          </div>

          {/* Earn */}
          <div
            className="flex items-center space-x-3 justify-center relative z-10"
            onClick={() => {
              window.location.href = externalLink.earn();
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <img src="/icons/minicoin.svg" alt="Earn notecoin" width={27} height={27} />
              <p className="text-xs">Earn</p>
            </div>
            <div className="inline-block h-[30px] w-[0.3px] bg-gray-100/20 absolute right-0"></div>
          </div>

          {/* Boosts */}
          <div
            className="flex flex-col items-center gap-1 text-center z-10"
            onClick={() => {
              window.location.href = externalLink.boosts();
            }}
          >
            <p className="text-md w-[27px] h-[27px]">🚀</p>
            <p className="text-xs">Boosts</p>
          </div>
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
