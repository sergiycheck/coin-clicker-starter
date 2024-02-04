import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./coin-canvas/coin-canvas";
import { CounterContext } from "./coin-canvas/counter-context";

import { FaChevronRight } from "react-icons/fa6";

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
