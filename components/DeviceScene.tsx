import { useEffect, useRef } from "react";
import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { Reflector } from "three/addons/objects/Reflector.js";
type Props = {
  progress: React.RefObject<number>;
  rotation: React.RefObject<number>;
  onReady: () => void;
  onFailure: () => void;
};
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};
const mix = T.MathUtils.lerp;
export default function DeviceScene({
  progress,
  rotation,
  onReady,
  onFailure,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = host.current;
    if (!root) return;
    let renderer: T.WebGLRenderer;
    try {
      renderer = new T.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      onFailure();
      return;
    }
    renderer.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.BasicShadowMap;
    root.appendChild(renderer.domElement);
    let disposed = false,
      dirty = true,
      visible = true;
    let assetsReady = false;
    const manager = new T.LoadingManager(() => {
      if (disposed) return;
      const prepare = async () => {
        // Offscreen reflections use a different colour pipeline from the viewport.
        // Compile both variants before drawing, otherwise the first reflection stalls.
        renderer.setRenderTarget(reflection.getRenderTarget());
        await renderer.compileAsync(studio, camera);
        if (disposed) return;
        renderer.setRenderTarget(null);
        await renderer.compileAsync(studio, camera);
        if (disposed) return;
        renderer.setRenderTarget(displayTarget);
        await renderer.compileAsync(universe, screenCamera);
        if (disposed) return;
        renderer.setRenderTarget(null);
        await renderer.compileAsync(universe, spaceCamera);
        if (!disposed) {
          assetsReady = true;
          dirty = true;
        }
      };
      void prepare().catch(() => {
        if (!disposed) onFailure();
      });
    });
    const textures: T.Texture[] = [],
      loader = new T.TextureLoader(manager);
    const texture = (name: string, srgb = true) => {
      const t = loader.load(
        `/cinematic/${name}`,
        () => {
          dirty = true;
        },
        undefined,
        () => {
          if (!disposed) onFailure();
        },
      );
      if (srgb) t.colorSpace = T.SRGBColorSpace;
      textures.push(t);
      return t;
    };
    const studio = new T.Scene();
    studio.background = new T.Color("#171c20");
    studio.fog = new T.Fog("#171c20", 18, 45);
    const camera = new T.PerspectiveCamera(38, 1, 0.025, 120);
    // Precomputed from Three.js RoomEnvironment. Loading the filtered radiance map
    // avoids generating and compiling an entire environment on the visitor's phone.
    let environment: T.DataTexture | undefined;
    const environmentAbort = new AbortController();
    const environmentURL = "/cinematic/studio-environment.bin.gz";
    manager.itemStart(environmentURL);
    fetch(environmentURL, { signal: environmentAbort.signal })
      .then(async (response) => {
        if (!response.ok || !response.body)
          throw new Error("Environment unavailable");
        const stream = response.body.pipeThrough(
          new DecompressionStream("gzip"),
        );
        const buffer = await new Response(stream).arrayBuffer();
        if (disposed) return;
        environment = new T.DataTexture(
          new Uint16Array(buffer),
          336,
          256,
          T.RGBAFormat,
          T.HalfFloatType,
        );
        environment.mapping = T.CubeUVReflectionMapping;
        environment.minFilter = environment.magFilter = T.LinearFilter;
        environment.colorSpace = T.LinearSRGBColorSpace;
        environment.needsUpdate = true;
        studio.environment = environment;
      })
      .catch(() => {
        if (!disposed) onFailure();
      })
      .finally(() => {
        dirty = true;
        manager.itemEnd(environmentURL);
      });
    studio.add(new T.AmbientLight(0xb9cad9, 0.6));
    const key = new T.DirectionalLight(0xffe7ce, 3.2);
    key.position.set(-4, 7, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.001;
    studio.add(key);
    const rim = new T.DirectionalLight(0xa0cbff, 4);
    rim.position.set(2, 3, -5);
    studio.add(rim);
    const screenLight = new T.PointLight(0x2c8cff, 18, 12, 2);
    screenLight.position.set(0, 0, 1);
    studio.add(screenLight);
    const silver = new T.MeshStandardMaterial({
      color: 0x858b95,
      metalness: 0.96,
      roughness: 0.23,
    });
    const graphite = new T.MeshStandardMaterial({
      color: 0x080b10,
      metalness: 0.6,
      roughness: 0.3,
    });
    const box = (
      w: number,
      h: number,
      d: number,
      material: T.Material,
      radius = 0.04,
    ) => {
      const mesh = new T.Mesh(
        new RoundedBoxGeometry(w, h, d, 3, radius),
        material,
      );
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      return mesh;
    };
    const laptop = new T.Group();
    studio.add(laptop);
    const base = box(4.9, 0.12, 3.15, silver);
    base.position.set(0, -1.03, 0.6);
    laptop.add(base);
    const keyboard = new T.InstancedMesh(
      new T.BoxGeometry(0.28, 0.018, 0.21),
      graphite,
      65,
    );
    const temp = new T.Object3D();
    let ki = 0;
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 13; col++) {
        temp.position.set((col - 6) * 0.325, -0.961, -0.47 + row * 0.27);
        temp.updateMatrix();
        keyboard.setMatrixAt(ki++, temp.matrix);
      }
    laptop.add(keyboard);
    const trackpad = box(
      1.6,
      0.009,
      0.83,
      new T.MeshStandardMaterial({
        color: 0x656c77,
        metalness: 0.8,
        roughness: 0.33,
      }),
    );
    trackpad.position.set(0, -0.962, 1.43);
    laptop.add(trackpad);
    const lid = new T.Group();
    lid.position.set(0, -0.94, -0.92);
    laptop.add(lid);
    const cover = box(4.88, 3.08, 0.09, silver, 0.065);
    cover.position.y = 1.54;
    lid.add(cover);
    const bezel = box(4.74, 2.95, 0.018, graphite);
    bezel.position.set(0, 1.54, 0.055);
    lid.add(bezel);
    const displayTarget = new T.WebGLRenderTarget(768, 432);
    const screenMaterial = new T.MeshBasicMaterial({
      map: displayTarget.texture,
      color: 0xffffff,
      toneMapped: false,
    });
    const screen = new T.Mesh(new T.PlaneGeometry(4.55, 2.56), screenMaterial);
    screen.position.set(0, 1.54, 0.068);
    lid.add(screen);
    const cameraDot = new T.Mesh(new T.CircleGeometry(0.016, 12), graphite);
    cameraDot.position.set(0, 2.965, 0.07);
    lid.add(cameraDot);
    const seam = new T.Mesh(
      new T.PlaneGeometry(4.5, 0.016),
      new T.MeshBasicMaterial({ color: 0x58baff }),
    );
    seam.position.set(0, -0.943, 2.18);
    laptop.add(seam);
    const marble = texture("marble.webp");
    marble.wrapS = marble.wrapT = T.RepeatWrapping;
    marble.repeat.set(4, 4);
    const normal = texture("marble-normal.webp", false);
    normal.wrapS = normal.wrapT = T.RepeatWrapping;
    normal.repeat.set(4, 4);
    const floorMaterial = new T.MeshStandardMaterial({
      map: marble,
      normalMap: normal,
      normalScale: new T.Vector2(0.13, 0.13),
      color: 0x303741,
      roughness: 0.2,
      metalness: 0.25,
      transparent: true,
      opacity: 0.82,
    });
    const floor = new T.Mesh(new T.PlaneGeometry(60, 60), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.11;
    floor.receiveShadow = true;
    studio.add(floor);
    const reflection = new Reflector(new T.PlaneGeometry(60, 60), {
      color: 0x777d87,
      textureWidth: 512,
      textureHeight: 512,
      clipBias: 0.003,
    });
    reflection.rotation.x = -Math.PI / 2;
    reflection.position.y = -1.12;
    studio.add(reflection);
    const desk = box(
      18,
      0.18,
      12,
      new T.MeshStandardMaterial({
        color: 0x030508,
        roughness: 0.5,
        metalness: 0.12,
      }),
    );
    desk.position.set(0, -1.2, 1);
    studio.add(desk);
    // Render this same globe onto the laptop screen and directly to the viewport after entering it.
    const universe = new T.Scene();
    universe.background = new T.Color("#02060e");
    const spaceCamera = new T.PerspectiveCamera(38, 1, 0.01, 150);
    const screenCamera = new T.PerspectiveCamera(38, 768 / 432, 0.01, 50);
    screenCamera.position.z = 7;
    const world = new T.Group();
    universe.add(world);
    const earthMap = texture("earth_daymap.webp");
    const globe = new T.Group();
    world.add(globe);
    const globeMaterial = new T.ShaderMaterial({
      toneMapped: false,
      uniforms: { earth: { value: earthMap } },
      vertexShader: `varying vec2 vUv; varying vec3 vNormal; void main(){vUv=uv;vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `uniform sampler2D earth; varying vec2 vUv; varying vec3 vNormal; void main(){vec3 map=texture2D(earth,vUv).rgb; float land=smoothstep(.0,.07,max(map.r,map.g)-map.b*.85); vec2 grid=abs(fract(vUv*vec2(48.,24.))-.5); float lines=1.-smoothstep(.016,.035,min(grid.x,grid.y)); vec2 dots=fract(vUv*vec2(230.,115.))-.5; float point=(1.-smoothstep(.13,.25,length(dots)))*land; float edge=pow(1.-abs(vNormal.z),3.); vec3 col=vec3(.015,.075,.14)+vec3(.12,.5,1.)*(lines*.65+point*1.5+edge*.6); gl_FragColor=vec4(col,1.);
#include <colorspace_fragment>
}`,
    });
    globe.add(new T.Mesh(new T.SphereGeometry(1.6, 96, 64), globeMaterial));
    const globeLine = new T.LineBasicMaterial({
      color: 0x68c9ff,
      transparent: true,
      opacity: 0.7,
    });
    const geoPoint = (lat: number, lon: number, r = 1.63) => {
      const a = (lat * Math.PI) / 180,
        b = (lon * Math.PI) / 180;
      return new T.Vector3(
        -Math.cos(a) * Math.cos(b) * r,
        Math.sin(a) * r,
        Math.cos(a) * Math.sin(b) * r,
      );
    };
    const origin = geoPoint(-34, 151);
    for (const [lat, lon] of [
      [51, 0],
      [40, -74],
      [35, 139],
      [1, 104],
      [37, -122],
      [-23, -46],
    ]) {
      const end = geoPoint(lat, lon),
        mid = origin.clone().add(end).normalize().multiplyScalar(2.5);
      const curve = new T.QuadraticBezierCurve3(origin, mid, end);
      globe.add(
        new T.Line(
          new T.BufferGeometry().setFromPoints(curve.getPoints(64)),
          globeLine,
        ),
      );
      const point = new T.Mesh(
        new T.SphereGeometry(0.028, 8, 8),
        new T.MeshBasicMaterial({ color: 0xc5edff }),
      );
      point.position.copy(end);
      globe.add(point);
    }
    universe.add(new T.AmbientLight(0x7a8eab, 0.4));
    const sun = new T.DirectionalLight(0xffe9d5, 2.1);
    sun.position.set(-4, 3, 5);
    universe.add(sun);
    const planets = ["mars", "jupiter", "neptune"].map((name, i) => {
      const planet = new T.Mesh(
        new T.SphereGeometry(i === 1 ? 2.1 : 1.8, 80, 64),
        new T.MeshStandardMaterial({
          map: texture(`${name}.webp`),
          roughness: 0.93,
          metalness: 0,
        }),
      );
      planet.rotation.z = i === 2 ? 0.4 : 0.1;
      world.add(planet);
      return planet;
    });
    const starPositions = new Float32Array(900 * 3);
    let seed = 617;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 900; i++) {
      starPositions[i * 3] = (random() - 0.5) * 55;
      starPositions[i * 3 + 1] = (random() - 0.5) * 34;
      starPositions[i * 3 + 2] = -10 - random() * 25;
    }
    const starsMaterial = new T.PointsMaterial({
      color: 0xa4b8d6,
      size: 0.022,
      transparent: true,
      opacity: 0.65,
    });
    const stars = new T.Points(
      new T.BufferGeometry().setAttribute(
        "position",
        new T.BufferAttribute(starPositions, 3),
      ),
      starsMaterial,
    );
    world.add(stars);
    const deployCanvas = document.createElement("canvas");
    deployCanvas.width = 1200;
    deployCanvas.height = 675;
    const context = deployCanvas.getContext("2d")!;
    const deployTexture = new T.CanvasTexture(deployCanvas);
    deployTexture.colorSpace = T.SRGBColorSpace;
    textures.push(deployTexture);
    const drawDeploy = (amount: number) => {
      const clicked = amount >= 0.65;
      context.fillStyle = "#080d13";
      context.fillRect(0, 0, 1200, 675);
      context.fillStyle = "#dbe5ed";
      context.font = "500 21px Arial";
      context.fillText("APEXWEB", 60, 60);
      context.fillStyle = "#fff";
      context.font = "500 67px Arial";
      context.fillText(
        clicked ? "A new chapter." : "Ready for the world.",
        95,
        258,
      );
      context.fillStyle = "#a2b1c1";
      context.font = "27px Arial";
      context.fillText(
        clicked
          ? "Let’s make it yours."
          : "Your next beginning is one step away.",
        98,
        318,
      );
      context.fillStyle = clicked ? "#b7eadb" : "#dbeeff";
      context.beginPath();
      context.roundRect(98, 380, 230, 66, 33);
      context.fill();
      context.fillStyle = "#102032";
      context.font = "24px Arial";
      context.fillText(clicked ? "You’re live" : "Deploy", 148, 422);
      const t = smooth(amount / 0.65),
        x = mix(810, 244, t),
        y = mix(515, 420, t);
      context.fillStyle = "white";
      context.strokeStyle = "#162433";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 2, y + 31);
      context.lineTo(x + 11, y + 23);
      context.lineTo(x + 19, y + 38);
      context.lineTo(x + 26, y + 34);
      context.lineTo(x + 17, y + 20);
      context.lineTo(x + 29, y + 18);
      context.closePath();
      context.fill();
      context.stroke();
      if (amount > 0.65 && amount < 0.95) {
        context.strokeStyle = `rgba(170,235,255,${1 - (amount - 0.65) / 0.3})`;
        context.lineWidth = 2;
        context.beginPath();
        context.arc(244, 420, 15 + (amount - 0.65) * 100, 0, Math.PI * 2);
        context.stroke();
      }
      deployTexture.needsUpdate = true;
    };
    let mobile = false;
    const resize = () => {
      const width = root.clientWidth,
        height = root.clientHeight;
      mobile = width < 700;
      renderer.setSize(width, height);
      camera.aspect = spaceCamera.aspect = width / height;
      camera.updateProjectionMatrix();
      spaceCamera.updateProjectionMatrix();
      dirty = true;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    resize();
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      dirty = true;
    });
    intersection.observe(root);
    let dragging = false,
      lastX = 0;
    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      root.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      rotation.current += (e.clientX - lastX) * 0.006;
      lastX = e.clientX;
      dirty = true;
    };
    const up = () => {
      dragging = false;
    };
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        rotation.current += e.key === "ArrowLeft" ? -0.2 : 0.2;
        dirty = true;
      }
    };
    root.addEventListener("pointerdown", down);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerup", up);
    root.addEventListener("pointercancel", up);
    root.addEventListener("lostpointercapture", up);
    root.addEventListener("keydown", keydown);
    let frame = 0,
      previous = -1,
      current = progress.current,
      announced = false;
    const render = () => {
      if (disposed) return;
      frame = requestAnimationFrame(render);
      if (!assetsReady || !visible || document.hidden) return;
      current =
        Math.abs(progress.current - current) < 0.001
          ? progress.current
          : mix(current, progress.current, 0.16);
      if (!dirty && current === previous) return;
      dirty = false;
      previous = current;
      const p = current,
        desktopZ = mobile ? 21.5 : 12;
      if (p < 2 || p >= 8.3) {
        const closing = p >= 8.3,
          opening = smooth(p / 1.15),
          zoom = smooth((p - 0.95) / 1.05);
        laptop.position.x =
          closing && !mobile ? mix(2, 0, smooth((p - 10) / 1)) : 0;
        studio.background = new T.Color(closing ? "#020408" : "#171c20");
        studio.environmentIntensity = closing ? 0.3 : 1;
        key.intensity = closing ? 1.2 : 3.2;
        rim.intensity = closing ? 1.3 : 4;
        renderer.toneMappingExposure = closing
          ? mix(0.01, 1.2, smooth((p - 8.3) / 0.5))
          : 1.2;
        laptop.rotation.set(
          0,
          closing ? 0 : mix(-1.05, 0, opening) + rotation.current * (1 - zoom),
          0,
        );
        lid.rotation.x = closing
          ? -0.07
          : mix(Math.PI / 2 - 0.025, -0.07, opening);
        seam.visible = !closing && p < 0.65;
        floor.visible = reflection.visible = !closing;
        desk.visible = closing;
        screenLight.intensity = closing ? 3 : mix(2, 20, opening);
        if (!closing) {
          globe.visible = true;
          globe.position.set(0, 0, 0);
          globe.scale.setScalar(1);
          globe.rotation.y = p * 0.3 + 2.2;
          world.scale.setScalar(1);
          world.position.set(0, 0, 0);
          planets.forEach((v) => (v.visible = false));
          stars.visible = false;
          renderer.setRenderTarget(displayTarget);
          renderer.render(universe, screenCamera);
          renderer.setRenderTarget(null);
          screenMaterial.map = displayTarget.texture;
          screenMaterial.color.setScalar(p < 0.12 ? 0 : 1);
          camera.position.set(
            0,
            mix(3.2, 0.596, zoom),
            mix(desktopZ, 2.71, zoom),
          );
          camera.lookAt(0, mix(-0.1, 0.596, zoom), -0.96);
        } else {
          const arrive = smooth((p - 8.3) / 0.65),
            zoomEnd = smooth((p - 10) / 1);
          drawDeploy(clamp((p - 9.15) / 0.8));
          screenMaterial.map = deployTexture;
          screenMaterial.color.setScalar(1);
          camera.position.set(
            0,
            mix(1.4, 0.596, zoomEnd),
            mix(desktopZ, 2.71, zoomEnd),
          );
          camera.lookAt(0, mix(-5, mix(0, 0.596, zoomEnd), arrive), -0.96);
        }
        renderer.render(studio, camera);
      } else {
        renderer.toneMappingExposure = 1.2;
        spaceCamera.position.set(
          0,
          0,
          mobile ? mix(7, 11.5, smooth((p - 2) / 0.6)) : 7,
        );
        spaceCamera.lookAt(0, 0, 0);
        globe.visible = p < 3.95;
        stars.visible = p > 3.4;
        const growth = smooth((p - 2) / 1.75);
        globe.scale.setScalar(mix(1, 1.4, growth));
        globe.position.set(
          mobile ? 0 : mix(0, 2.0, smooth((p - 2) / 0.4)),
          mobile ? mix(0, -0.95, smooth((p - 2) / 0.6)) : 0,
          0,
        );
        globe.position.y += smooth((p - 3.4) / 0.55) * 10;
        globe.rotation.y = 2.8 + (p - 2) * 0.8 + rotation.current;
        planets.forEach((planet, i) => {
          const delta = p - (4.5 + i * 1.25);
          planet.visible = Math.abs(delta) < 1.1 || p >= 7.55;
          planet.position.set(mobile ? 0 : 1.8, mobile ? -1 : 0, 0);
          planet.position.y +=
            delta < -0.4
              ? -smooth((-delta - 0.4) / 0.65) * 9
              : smooth((delta - 0.35) / 0.65) * 9;
          planet.rotation.y = p * 0.28 + i * 2 + rotation.current;
          if (p >= 7.55) {
            const gather = smooth((p - 7.55) / 0.55);
            const exitDelta = 7.55 - (4.5 + i * 1.25);
            const exitY =
              (mobile ? -1 : 0) + smooth((exitDelta - 0.35) / 0.65) * 9;
            planet.position.set(
              mix(mobile ? 0 : 1.8, (i - 1) * 4.2, gather),
              mix(exitY, i === 1 ? 0.5 : -0.4, gather),
              -i * gather,
            );
          }
        });
        const disappear = smooth((p - 7.55) / 0.7);
        world.scale.setScalar(
          p < 7.55 ? 1 : Math.max(0.0001, Math.pow(1 - disappear, 3)),
        );
        world.position.set(0, 0, p < 7.55 ? 0 : -disappear * 30);
        starsMaterial.opacity = (1 - disappear) * 0.65;
        renderer.render(universe, spaceCamera);
      }
      if (!announced && assetsReady) {
        announced = true;
        onReady();
      }
    };
    render();
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointercancel", up);
      root.removeEventListener("lostpointercapture", up);
      root.removeEventListener("keydown", keydown);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      const materials = new Set<T.Material>(),
        geometries = new Set<T.BufferGeometry>();
      for (const s of [studio, universe])
        s.traverse((obj) => {
          const mesh = obj as T.Mesh;
          if (mesh.geometry) geometries.add(mesh.geometry);
          if (mesh.material)
            (Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material]
            ).forEach((m) => materials.add(m));
        });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      reflection.dispose();
      displayTarget.dispose();
      environmentAbort.abort();
      environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress, rotation, onReady, onFailure]);
  return (
    <div
      ref={host}
      className="cinema-renderer"
      role="img"
      aria-label="Interactive cinematic journey through a laptop, connected Earth, Mars, Jupiter and Neptune. Drag or use left and right arrow keys to rotate."
      tabIndex={0}
    />
  );
}
