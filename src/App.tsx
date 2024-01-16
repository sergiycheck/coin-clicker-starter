import { useState, useContext, createContext } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

//counter context
const CounterContext = createContext({
  count: 0,
  increment: () => {},
});

function App() {
  const [count, setCount] = useState(10_000_000_000);
  const increment = () => setCount((prev) => prev + 1);

  return (
    <div className="flex flex-col h-full relative select-none pointer-events-none">
      <h1 className="text-3xl font-bold text-center p-10 absolute z-10 left-[50%] translate-x-[-50%] select-none">
        {count}
      </h1>

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

function Scene() {
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [coinPosition, setCoinPosition] = useState([0, 0, 0]);
  const { increment } = useContext(CounterContext);

  const circlePartsOpacity = 0;

  const touchEndHandler = () => {
    setRotation([0, 0, 0]);
    setCoinPosition([0, 0, 0]);
  };

  const wrapWithTouchEndHandler = (fn: () => void) => {
    return () => {
      increment();
      touchEndHandler();
      fn();
    };
  };

  const bottomRightTouchStartHandler = () => {
    setRotation([Math.PI / 10, Math.PI / 10, 0]);
  };

  const bottomCenterTouchStartHandler = () => {
    setRotation([Math.PI / 10, 0, 0]);
  };

  const bottomLeftTouchStartHandler = () => {
    setRotation([Math.PI / 10, -Math.PI / 10, 0]);
  };

  const middleRightTouchStartHandler = () => {
    setRotation([0, Math.PI / 10, 0]);
  };

  const middleCenterTouchStartHandler = () => {
    setCoinPosition([0, 0, -Math.PI / 10]);
  };

  const middleLeftTouchStartHandler = () => {
    setRotation([0, -Math.PI / 10, 0]);
  };

  const topRightTouchStartHandler = () => {
    setRotation([-Math.PI / 10, Math.PI / 10, 0]);
  };

  const topCenterTouchStartHandler = () => {
    setRotation([-Math.PI / 10, 0, 0]);
  };

  const topLeftTouchStartHandler = () => {
    setRotation([-Math.PI / 10, -Math.PI / 10, 0]);
  };

  const colorMap = useTexture("/notecoin.png");

  return (
    <>
      <ambientLight intensity={2.5} />
      <directionalLight />
      <group rotation={rotation} position={coinPosition}>
        <mesh>
          <circleGeometry args={[1.5, 100, 100]} />
          <meshStandardMaterial map={colorMap} />
        </mesh>
      </group>

      <mesh
        position={[0, 0, 0]}
        onPointerDown={wrapWithTouchEndHandler(topRightTouchStartHandler)}
        onPointerUp={touchEndHandler}
        onPointerLeave={touchEndHandler}
      >
        <circleGeometry args={[1.5, 32, 0, Math.PI / 2]} />
        <meshStandardMaterial color="blue" transparent opacity={circlePartsOpacity} />
      </mesh>

      <mesh
        position={[0, 0, 0]}
        onPointerDown={wrapWithTouchEndHandler(bottomRightTouchStartHandler)}
        onPointerUp={touchEndHandler}
        onPointerLeave={touchEndHandler}
      >
        <circleGeometry args={[1.5, 32, -Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="green" transparent opacity={circlePartsOpacity} />
      </mesh>

      <mesh
        position={[0, 0, 0]}
        onPointerDown={wrapWithTouchEndHandler(bottomLeftTouchStartHandler)}
        onPointerUp={touchEndHandler}
        onPointerLeave={touchEndHandler}
      >
        <circleGeometry args={[1.5, 32, Math.PI, Math.PI / 2]} />
        <meshStandardMaterial color="red" transparent opacity={circlePartsOpacity} />
      </mesh>

      <mesh
        position={[0, 0, 0]}
        onPointerDown={wrapWithTouchEndHandler(topLeftTouchStartHandler)}
        onPointerUp={touchEndHandler}
        onPointerLeave={touchEndHandler}
      >
        <circleGeometry args={[1.5, 32, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="gray" transparent opacity={circlePartsOpacity} />
      </mesh>

      <mesh
        position={[0, 0, 0]}
        onPointerDown={wrapWithTouchEndHandler(middleCenterTouchStartHandler)}
        onPointerUp={touchEndHandler}
        onPointerLeave={touchEndHandler}
      >
        <circleGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="black" transparent opacity={circlePartsOpacity} />
      </mesh>
    </>
  );
}

export default App;
