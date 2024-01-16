import { useState, useContext, createContext, useRef } from "react";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

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
  const [rotation, setRotation] = useState<[x: number, y: number, z: number]>([0, 0, 0]);
  const [coinPosition, setCoinPosition] = useState<[x: number, y: number, z: number]>([0, 0, 0]);

  const [visibleFlyingPoints, setVisibleFlyingPoints] = useState<number>(0);

  const { increment } = useContext(CounterContext);

  const circlePartsOpacity = 0;

  const touchEndHandler = () => {
    setRotation([0, 0, 0]);
    setCoinPosition([0, 0, 0]);
  };

  const setFlyingPointsHandler = () => {
    setVisibleFlyingPoints((prev) => prev + 1);
  };

  const wrapWithTouchEndHandler = (fn: (event: ThreeEvent<PointerEvent>) => void) => {
    return (event: ThreeEvent<PointerEvent>) => {
      increment();
      touchEndHandler();
      setFlyingPointsHandler();
      fn(event);
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

      {visibleFlyingPoints &&
        Array.from({ length: visibleFlyingPoints }).map((_, index) => <VisibleFlyingPoint key={index} />)}
    </>
  );
}

const AnimatedText = animated(Text);

function VisibleFlyingPoint() {
  const fontProps = { fontSize: 0.5, letterSpacing: -0.05, lineHeight: 1, "material-toneMapped": false };

  const { mouse, viewport } = useThree();

  const x = (mouse.x * viewport.width) / 2;
  const y = (mouse.y * viewport.height) / 2;

  const { position: positionSpring, opacity: opacitySpring } = useSpring({
    from: {
      position: [x, y, 0],
      opacity: 1,
    },
    to: {
      position: [x, y + 5, 0],
      opacity: 0,
    },
    config: { duration: 1_000 },
  });

  return (
    <animated.mesh position={positionSpring as any}>
      <AnimatedText fillOpacity={opacitySpring} color="white" {...fontProps} anchorX="center" anchorY="middle">
        1
      </AnimatedText>
    </animated.mesh>
  );
}

export default App;
