import { useState, useContext, createContext, useEffect } from "react";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { CounterContext } from "./counter-context";

export function Scene() {
  const [springs, api] = useSpring(() => ({
    position: [0, -0.9, 0.5],
    rotation: [0, 0, 0],
    config: { friction: 5, mass: 0.3 },
  }));

  useEffect(() => {
    const timeout = setTimeout(() => {
      api.start({
        position: [0, -0.7, 0],
        rotation: [0, 0, 0],
      });
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [api]);

  const [visibleFlyingPoints, setVisibleFlyingPoints] = useState<number>(1);

  const { increment } = useContext(CounterContext);

  const touchEndHandler = () => {
    api.start({
      position: [0, -0.7, 0],
      rotation: [0, 0, 0],
    });
  };

  const setFlyingPointsHandler = () => {
    setVisibleFlyingPoints((prev) => prev + 1);
  };

  const wrapWithTouchEndHandler = (
    fn: (event: ThreeEvent<PointerEvent>) => void
  ) => {
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
      position: [0, -0.7, -Math.PI / 10],
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

  const circlePartsOpacity = 0;
  const MathPIVision = 4;

  return (
    <>
      <ambientLight intensity={2.5} />
      <directionalLight />
      <animated.group
        // @ts-expect-error rotation is not typed
        rotation={springs.rotation.to((x, y, z) => [x, y, z])}
        position={springs.position.to((x, y, z) => [x, y, z])}
      >
        <animated.mesh>
          <circleGeometry args={[1.5, 100, 100]} />
          <meshStandardMaterial map={colorMap} />
        </animated.mesh>
      </animated.group>

      <group position={[0, -0.7, 0]} rotation={[0, 0, -0.36]}>
        <mesh
          onPointerDown={wrapWithTouchEndHandler(topRightTouchStartHandler)}
          onPointerUp={touchEndHandler}
          onPointerLeave={touchEndHandler}
        >
          <circleGeometry
            args={[1.5, 32, Math.PI / MathPIVision, Math.PI / MathPIVision]}
          />
          <meshStandardMaterial
            color="#ff0000"
            transparent
            opacity={circlePartsOpacity}
          />
        </mesh>

        <mesh
          onPointerDown={wrapWithTouchEndHandler(middleRightTouchStartHandler)}
          onPointerUp={touchEndHandler}
          onPointerLeave={touchEndHandler}
        >
          <circleGeometry
            args={[
              1.5,
              32,
              (-Math.PI / MathPIVision) * 8,
              Math.PI / MathPIVision,
            ]}
          />
          <meshStandardMaterial
            color="#00ff00"
            transparent
            opacity={circlePartsOpacity}
          />
        </mesh>

        <mesh
          onPointerDown={wrapWithTouchEndHandler(bottomRightTouchStartHandler)}
          onPointerUp={touchEndHandler}
          onPointerLeave={touchEndHandler}
        >
          <circleGeometry
            args={[1.5, 32, -Math.PI / MathPIVision, Math.PI / MathPIVision]}
          />
          <meshStandardMaterial
            color="#0000ff"
            transparent
            opacity={circlePartsOpacity}
          />
        </mesh>

        <mesh
          onPointerDown={wrapWithTouchEndHandler(bottomCenterTouchStartHandler)}
          onPointerUp={touchEndHandler}
          onPointerLeave={touchEndHandler}
        >
          <circleGeometry
            args={[
              1.5,
              32,
              (-Math.PI / MathPIVision) * 2,
              Math.PI / MathPIVision,
            ]}
          />
          <meshStandardMaterial
            color="#00b7ff"
            transparent
            opacity={circlePartsOpacity}
          />
        </mesh>

        <mesh
          onPointerDown={wrapWithTouchEndHandler(bottomLeftTouchStartHandler)}
          onPointerUp={touchEndHandler}
          onPointerLeave={touchEndHandler}
        >
          <circleGeometry
            args={[
              1.5,
              32,
              (-Math.PI / MathPIVision) * 3,
              Math.PI / MathPIVision,
            ]}
          />
          <meshStandardMaterial
            color="#ff00ff"
            transparent
            opacity={circlePartsOpacity}
          />
        </mesh>

        <mesh
          onPointerDown={wrapWithTouchEndHandler(middleLeftTouchStartHandler)}
          onPointerUp={touchEndHandler}
          onPointerLeave={touchEndHandler}
        >
          <circleGeometry
            args={[
              1.5,
              32,
              (-Math.PI / MathPIVision) * 4,
              Math.PI / MathPIVision,
            ]}
          />
          <meshStandardMaterial
            color="#00ffff"
            transparent
            opacity={circlePartsOpacity}
          />
        </mesh>

        <mesh
          onPointerDown={wrapWithTouchEndHandler(topLeftTouchStartHandler)}
          onPointerUp={touchEndHandler}
          onPointerLeave={touchEndHandler}
        >
          <circleGeometry
            args={[
              1.5,
              32,
              (-Math.PI / MathPIVision) * 5,
              Math.PI / MathPIVision,
            ]}
          />
          <meshStandardMaterial
            color="#ff8000"
            transparent
            opacity={circlePartsOpacity}
          />
        </mesh>

        <mesh
          onPointerDown={wrapWithTouchEndHandler(topCenterTouchStartHandler)}
          onPointerUp={touchEndHandler}
          onPointerLeave={touchEndHandler}
        >
          <circleGeometry
            args={[
              1.5,
              32,
              (-Math.PI / MathPIVision) * 6,
              Math.PI / MathPIVision,
            ]}
          />
          <meshStandardMaterial
            color="#8000ff"
            transparent
            opacity={circlePartsOpacity}
          />
        </mesh>

        <mesh
          onPointerDown={wrapWithTouchEndHandler(middleCenterTouchStartHandler)}
          onPointerUp={touchEndHandler}
          onPointerLeave={touchEndHandler}
        >
          <circleGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial
            color="black"
            transparent
            opacity={circlePartsOpacity}
          />
        </mesh>
      </group>

      {/* TODO: fix flickering for points */}
      {Array.from({ length: visibleFlyingPoints }).map((_, index) => (
        <VisibleFlyingPoint key={index} item={index} />
      ))}
    </>
  );
}

const AnimatedText = animated(Text);

export function VisibleFlyingPoint({ item }: { item: number }) {
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
      <AnimatedText
        fillOpacity={item == 0 ? 0 : opacitySpring}
        color="white"
        {...fontProps}
        anchorX="center"
        anchorY="middle"
      >
        2
      </AnimatedText>
    </animated.mesh>
  );
}
