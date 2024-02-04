import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./coin-canvas/coin-canvas";
import { CounterContext } from "./coin-canvas/counter-context";

import { FaChevronRight } from "react-icons/fa6";
import { SlEnergy } from "react-icons/sl";

//counter context

function App() {
  const [count, setCount] = useState(10_000_000_000);
  const increment = () => setTimeout(() => setCount((prev) => prev + 1), 500);

  return (
    <div className="flex flex-col h-full relative select-none px-2">
      <div className="flex flex-col space-y-2 mt-2 max-w-3xl w-full mx-auto">
        <div className="rounded bg-zinc-700 p-2 flex justify-center items-center ">
          <div
            className="flex items-center space-x-1"
            onClick={() => {
              console.log("Join squad");
            }}
          >
            <p className="text-md">Join squad</p>
            <FaChevronRight className="text-md" />
          </div>
        </div>

        <div className="flex justify-center items-center space-x-2">
          <img src="/notecoin.png" alt="coin" width={30} height={30} />
          <h1 className="text-3xl font-bold text-center select-none pointer-events-none">
            {count.toLocaleString("en-US")}
          </h1>
        </div>
      </div>

      <div className="absolute bottom-0 w-full">
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between p-2">
          <div className="flex flex-col">
            <div className="flex space-x-2 w-fit items-center">
              <SlEnergy className="text-yellow-400 text-3xl" />

              <div className="flex flex-col space-y-0.5">
                <p className="text-md">1500</p>
                <p className="text-xs text-slate-600">/ 1500</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex space-x-2 w-fit items-center bg-zinc-400 ring-1 ring-zinc-500 rounded">
              <div className="flex">
                <div className="p-2 flex flex-col items-center justify-end">
                  <p className="text-md">🐻</p>
                  <p className="text-md">frens</p>
                </div>
                <div className="p-2 flex flex-col items-center justify-end">
                  <img
                    src="/notecoin.png"
                    alt="earn notecoin"
                    width={20}
                    height={20}
                  />
                  <p className="text-md">earn</p>
                </div>
                <div className="p-2 flex flex-col items-center justify-end">
                  <p className="text-md">🚀</p>
                  <p className="text-md">boosts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 justify-center items-center">
        <CounterContext.Provider value={{ count, increment }}>
          <Canvas>
            <Scene />
          </Canvas>
        </CounterContext.Provider>
      </div>
    </div>
  );
}

export default App;
