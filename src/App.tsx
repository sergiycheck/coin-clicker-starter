import { useState, useContext, createContext } from "react";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
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
  const [springs, api] = useSpring(() => ({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { friction: 5, mass: 0.3 },
  }));

  const [visibleFlyingPoints, setVisibleFlyingPoints] = useState<number>(0);

  const { increment } = useContext(CounterContext);

  const circlePartsOpacity = 0.5;

  const touchEndHandler = () => {
    api.start({
      position: [0, 0, 0],
      rotation: [0, 0, 0],
    });
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
    api.start({
      rotation: [Math.PI / 10, Math.PI / 10, 0],
    });
  };

  const bottomCenterTouchStartHandler = () => {
    api.start({
      rotation: [Math.PI / 10, 0, 0],
    });
  };

  const bottomLeftTouchStartHandler = () => {
    api.start({
      rotation: [Math.PI / 10, -Math.PI / 10, 0],
    });
  };

  const middleRightTouchStartHandler = () => {
    api.start({
      rotation: [0, Math.PI / 10, 0],
    });
  };

  const middleCenterTouchStartHandler = () => {
    api.start({
      position: [0, 0, -Math.PI / 10],
    });
  };

  const middleLeftTouchStartHandler = () => {
    api.start({
      rotation: [0, -Math.PI / 10, 0],
    });
  };

  const topRightTouchStartHandler = () => {
    api.start({
      rotation: [-Math.PI / 10, Math.PI / 10, 0],
    });
  };

  const topCenterTouchStartHandler = () => {
    api.start({
      rotation: [-Math.PI / 10, 0, 0],
    });
  };

  const topLeftTouchStartHandler = () => {
    api.start({
      rotation: [-Math.PI / 10, -Math.PI / 10, 0],
    });
  };

  const colorMap = useTexture("/notecoin.png");

  return (
    <>
      <ambientLight intensity={2.5} />
      <directionalLight />
      <animated.group
        rotation={springs.rotation.to((x, y, z) => [x, y, z])}
        position={springs.position.to((x, y, z) => [x, y, z])}
      >
        <animated.mesh>
          <circleGeometry args={[1.5, 100, 100]} />
          <meshStandardMaterial map={colorMap} />
        </animated.mesh>
      </animated.group>

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
  const fontProps = {
    fontSize: 0.35,
    font: "./Roboto-Bold.ttf",
    letterSpacing: -0.05,
    lineHeight: 0.5,
    "material-toneMapped": false,
  };

  const { mouse, viewport } = useThree();

  const x = (mouse.x * viewport.width) / 2;
  const y = (mouse.y * viewport.height) / 2;

  const { position: positionSpring, opacity: opacitySpring } = useSpring({
    from: {
      position: [x, y - 0.2, 1],
      opacity: 1,
    },
    to: {
      position: [x, y + 2, 1],
      opacity: 0,
    },
    config: { duration: 700, tension: 500, friction: 10, mass: 100 },
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
