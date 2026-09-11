import { useEffect, useRef } from "react";
import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { createSolarSystem } from "./SolarSystem";
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
    studio.background = new T.Color("#000000");
    studio.fog = new T.Fog("#000000", 12, 26);
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
    studio.add(new T.AmbientLight(0xb9cad9, 0.12));
    const key = new T.DirectionalLight(0xffe7ce, 3.2);
    key.position.set(-4, 7, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.001;
    studio.add(key);
    const spotlight = new T.SpotLight(0xffecd8, 180, 24, 0.48, 0.9, 2);
    spotlight.position.set(0, 7, 1);
    spotlight.target.position.set(0, -1, 0);
    studio.add(spotlight, spotlight.target);
    const beamMaterial = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: T.DoubleSide,
      blending: T.AdditiveBlending,
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec2 vUv;void main(){float edge=pow(sin(vUv.x*3.14159),5.);gl_FragColor=vec4(.72,.79,1.,edge*.12*pow(vUv.y,.7));}`,
    });
    const beam = new T.Mesh(
      new T.ConeGeometry(3.5, 9, 64, 1, true),
      beamMaterial,
    );
    beam.position.set(0, 3.4, 0);
    studio.add(beam);
    const wallCanvas = document.createElement("canvas");
    wallCanvas.width = 16;
    wallCanvas.height = 256;
    const wc = wallCanvas.getContext("2d")!,
      wg = wc.createLinearGradient(0, 256, 0, 0);
    wg.addColorStop(0, "#030405");
    wg.addColorStop(0.22, "#3d3933");
    wg.addColorStop(0.4, "#b6a286");
    wg.addColorStop(1, "#ddd0b9");
    wc.fillStyle = wg;
    wc.fillRect(0, 0, 16, 256);
    const wallTexture = new T.CanvasTexture(wallCanvas);
    wallTexture.colorSpace = T.SRGBColorSpace;
    textures.push(wallTexture);
    const wallMaterial = new T.MeshStandardMaterial({
      map: wallTexture,
      roughness: 1,
    });
    const wall = new T.Mesh(new T.PlaneGeometry(70, 35), wallMaterial);
    wall.position.set(0, 10, -15);
    studio.add(wall);
    const rim = new T.DirectionalLight(0xa0cbff, 4);
    rim.position.set(2, 3, -5);
    studio.add(rim);
    const screenLight = new T.PointLight(0x2c8cff, 18, 12, 2);
    screenLight.position.set(0, 0, 1);
    studio.add(screenLight);
    const silver = new T.MeshStandardMaterial({
      color: 0x4b4d50,
      metalness: 0.96,
      roughness: 0.2,
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
    const legends = document.createElement("canvas");
    legends.width = 1024;
    legends.height = 320;
    const lc = legends.getContext("2d")!;
    lc.fillStyle = "#b4b5b3";
    lc.font = "15px Arial";
    lc.textAlign = "center";
    [
      "1234567890−=⌫",
      "QWERTYUIOP[]",
      "ASDFGHJKL;↵",
      "ZXCVBNM,./↑",
      "⌘⌥          ⌘",
    ].forEach((row, y) =>
      [...row].forEach((ch, x) => lc.fillText(ch, 40 + x * 77, 40 + y * 61)),
    );
    const legendTexture = new T.CanvasTexture(legends);
    textures.push(legendTexture);
    const legendPlane = new T.Mesh(
      new T.PlaneGeometry(4.2, 1.35),
      new T.MeshBasicMaterial({
        map: legendTexture,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      }),
    );
    legendPlane.rotation.x = -Math.PI / 2;
    legendPlane.position.set(0, -0.947, 0.08);
    laptop.add(legendPlane);
    const holes = new T.InstancedMesh(
      new T.CircleGeometry(0.009, 6),
      new T.MeshBasicMaterial({ color: 0x000000 }),
      420,
    );
    let hi = 0;
    for (const side of [-1, 1])
      for (let row = 0; row < 35; row++)
        for (let col = 0; col < 6; col++) {
          temp.position.set(
            side * (2.19 + col * 0.021),
            -0.963,
            -0.45 + row * 0.038,
          );
          temp.rotation.set(-Math.PI / 2, 0, 0);
          temp.updateMatrix();
          holes.setMatrixAt(hi++, temp.matrix);
        }
    laptop.add(holes);
    const trackpad = box(
      1.6,
      0.009,
      0.83,
      new T.MeshStandardMaterial({
        color: 0x252a2f,
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
    const apple = new T.Mesh(
      new T.PlaneGeometry(0.62, 0.62),
      new T.MeshStandardMaterial({
        map: texture("apple.png"),
        transparent: true,
        metalness: 0.85,
        roughness: 0.12,
        side: T.DoubleSide,
      }),
    );
    apple.position.set(0, 1.6, -0.049);
    apple.rotation.y = Math.PI;
    lid.add(apple);
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
    const glassMaterial = new T.MeshPhysicalMaterial({
      color: 0xc9d9e8,
      metalness: 0,
      roughness: 0.055,
      transparent: true,
      opacity: 0.19,
      clearcoat: 1,
      clearcoatRoughness: 0.025,
      envMapIntensity: 2.2,
      ior: 1.52,
      depthWrite: false,
    });
    const glass = new T.Mesh(new T.PlaneGeometry(4.55, 2.56), glassMaterial);
    glass.position.set(0, 1.54, 0.077);
    lid.add(glass);
    const glareMaterial = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { amount: { value: 1 } },
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec2 vUv;uniform float amount;void main(){float streak=exp(-pow((vUv.x+vUv.y*.5-.85)*8.,2.));gl_FragColor=vec4(.78,.86,1.,streak*.16*amount);}`,
    });
    const glare = new T.Mesh(new T.PlaneGeometry(4.55, 2.56), glareMaterial);
    glare.position.copy(glass.position);
    glare.position.z += 0.002;
    lid.add(glare);
    const cameraDot = new T.Mesh(new T.CircleGeometry(0.016, 12), graphite);
    cameraDot.position.set(0, 2.965, 0.07);
    lid.add(cameraDot);
    const seam = new T.Mesh(
      new T.PlaneGeometry(4.5, 0.016),
      new T.MeshBasicMaterial({ color: 0x58baff }),
    );
    seam.position.set(0, -0.943, 2.18);
    laptop.add(seam);
    const marble = texture("desk-wood.webp");
    marble.wrapS = marble.wrapT = T.RepeatWrapping;
    marble.repeat.set(6, 6);
    const normal = texture("desk-normal.webp", false);
    normal.wrapS = normal.wrapT = T.RepeatWrapping;
    normal.repeat.set(6, 6);
    const floorMaterial = new T.MeshStandardMaterial({
      map: marble,
      normalMap: normal,
      normalScale: new T.Vector2(0.12, 0.12),
      color: 0x1d2024,
      roughness: 0.66,
      metalness: 0.08,
      transparent: true,
      opacity: 0.997,
    });
    const floor = new T.Mesh(new T.PlaneGeometry(60, 60), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.11;
    floor.receiveShadow = true;
    studio.add(floor);
    const reflection = new Reflector(new T.PlaneGeometry(60, 60), {
      color: 0x45484d,
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
    desk.position.set(0, -1.24, 1);
    studio.add(desk);
    // Render this same globe onto the laptop screen and directly to the viewport after entering it.
    const universe = new T.Scene();
    universe.background = new T.Color("#000000");
    const spaceCamera = new T.PerspectiveCamera(38, 1, 0.01, 1200);
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
        b = ((lon + 180) * Math.PI) / 180;
      return new T.Vector3(
        -Math.cos(a) * Math.cos(b) * r,
        Math.sin(a) * r,
        Math.cos(a) * Math.sin(b) * r,
      );
    };
    const hub = geoPoint(-37.8136, 144.9631);
    const routes: T.BufferGeometry[] = [];
    const couriers: { mesh: T.Mesh; curve: T.QuadraticBezierCurve3 }[] = [];
    for (const [lat, lon] of [
      [51, 0],
      [40, -74],
      [35, 139],
      [1, 104],
      [37, -122],
      [-23, -46],
      [48, 2],
      [52, 13],
      [25, 55],
      [19, 73],
      [22, 114],
      [37, 127],
      [31, 121],
      [-33, 18],
      [-1, 37],
      [30, 31],
      [43, -79],
      [19, -99],
      [-34, -58],
      [-36, 175],
      [-31, 116],
      [-27, 153],
      [-33, 151],
      [13, 100],
    ]) {
      const start = geoPoint(lat, lon),
        mid = start.clone().add(hub).normalize().multiplyScalar(2.55);
      const curve = new T.QuadraticBezierCurve3(start, mid, hub);
      const geometry = new T.BufferGeometry().setFromPoints(
        curve.getPoints(100),
      );
      geometry.setDrawRange(0, 0);
      routes.push(geometry);
      globe.add(new T.Line(geometry, globeLine));
      const mesh = new T.Mesh(
        new T.SphereGeometry(0.023, 8, 8),
        new T.MeshBasicMaterial({ color: 0xe0f7ff }),
      );
      globe.add(mesh);
      couriers.push({ mesh, curve });
    }
    const hubMarker = new T.Mesh(
      new T.SphereGeometry(0.06, 16, 12),
      new T.MeshBasicMaterial({ color: 0xffffff }),
    );
    hubMarker.position.copy(hub);
    globe.add(hubMarker);
    universe.add(new T.AmbientLight(0x7a8eab, 0.4));
    const sun = new T.DirectionalLight(0xffe9d5, 2.1);
    sun.position.set(-4, 3, 5);
    universe.add(sun);
    const solar = createSolarSystem(universe, texture);
    // The live page itself is projected onto the laptop. The final camera pose
    // makes this homography the identity, so there is no second image to fade in.
    const projectPage = () => {
      const panel = document.getElementById("screen-handoff"),
        surface = panel?.querySelector<HTMLElement>(".handoff-surface");
      if (!panel || !surface) return;
      const width = root.clientWidth,
        height = root.clientHeight,
        scale = Math.min(4.55 / width, 2.56 / height);
      const hw = (width * scale) / 2,
        hh = (height * scale) / 2;
      studio.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      const points = [
        [-hw, 1.54 + hh],
        [hw, 1.54 + hh],
        [hw, 1.54 - hh],
        [-hw, 1.54 - hh],
      ].map(([x, y]) => {
        const v = new T.Vector3(x, y, 0.08)
          .applyMatrix4(lid.matrixWorld)
          .project(camera);
        return { x: ((v.x + 1) * width) / 2, y: ((1 - v.y) * height) / 2 };
      });
      const [p0, p1, p2, p3] = points,
        dx1 = p1.x - p2.x,
        dx2 = p3.x - p2.x,
        dx3 = p0.x - p1.x + p2.x - p3.x,
        dy1 = p1.y - p2.y,
        dy2 = p3.y - p2.y,
        dy3 = p0.y - p1.y + p2.y - p3.y;
      const denominator = dx1 * dy2 - dx2 * dy1;
      if (Math.abs(denominator) < 0.001) return;
      const g = (dx3 * dy2 - dx2 * dy3) / denominator,
        h = (dx1 * dy3 - dx3 * dy1) / denominator;
      const a = p1.x - p0.x + g * p1.x,
        b = p3.x - p0.x + h * p3.x,
        d = p1.y - p0.y + g * p1.y,
        e = p3.y - p0.y + h * p3.y;
      surface.style.transform = `matrix3d(${a / width},${d / width},0,${g / width},${b / height},${e / height},0,${h / height},0,0,1,0,${p0.x},${p0.y},0,1)`;
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
        progress.current >= 7.8 ? progress.current :
        Math.abs(progress.current - current) < 0.001
          ? progress.current
          : mix(current, progress.current, 0.16);
      if (!dirty && current === previous) return;
      dirty = false;
      previous = current;
      const p = current,
        desktopZ = mobile ? 21.5 : 12;
      const handoff = document.getElementById("screen-handoff");
      const handoffSurface = handoff?.querySelector<HTMLElement>(".handoff-surface");
      const curtain = document.querySelector<HTMLElement>(".cinema-curtain");
      if (curtain) curtain.style.opacity = String(p < 8.3 ? clamp((p - 7.98) / 0.32) : 1 - clamp((p - 8.3) / 0.5));
      if (handoff && handoffSurface) {
        // Keep the page out of document scrolling until the camera has arrived.
        handoffSurface.style.position = p < 11 ? "fixed" : "absolute";
        handoff.style.pointerEvents = p >= 11 ? "auto" : "none";
        if (p < 8.3) handoff.style.visibility = "hidden";
      }
      if (p < 2 || p >= 8.3) {
        const closing = p >= 8.3,
          opening = smooth(p / 1.4),
          zoom = clamp(p / 2);
        laptop.position.x =
          closing && !mobile ? mix(2, 0, smooth((p - 10) / 1)) : 0;
        studio.background = new T.Color(0x000000);
        wall.visible = closing;
        if (studio.fog instanceof T.Fog) {
          studio.fog.near = closing ? 23 : 12;
          studio.fog.far = closing ? 65 : 26;
        }
        spotlight.intensity = closing ? 75 : 110;
        beam.visible = !closing;
        studio.environmentIntensity = closing ? 0.48 : 0.2;
        key.intensity = closing ? 2 : 0.6;
        rim.intensity = closing ? 0.6 : 0.35;
        renderer.toneMappingExposure = closing
          ? mix(0.001, 1.05, smooth((p - 8.3) / 0.65))
          : 1.2;
        laptop.rotation.set(
          0,
          closing ? 0 : mix(-0.65, 0, opening) + rotation.current * (1 - zoom),
          0,
        );
        lid.rotation.x = closing ? 0 : mix(1.52, 0, opening);
        seam.visible = false;
        floor.visible = reflection.visible = true;
        desk.visible = true;
        screenLight.intensity = closing ? 0.5 : mix(0, 1.8, opening);
        if (!closing) {
          globe.visible = true;
          globe.position.set(0, 0, 0);
          globe.scale.setScalar(1);
          globe.rotation.y = 1.27;
          world.scale.setScalar(1);
          world.position.set(0, 0, 0);

          solar.update(2, spaceCamera, mobile, rotation.current);
          renderer.setRenderTarget(displayTarget);
          renderer.render(universe, screenCamera);
          renderer.setRenderTarget(null);
          if (screenMaterial.map !== displayTarget.texture) {
            screenMaterial.map = displayTarget.texture;
            screenMaterial.needsUpdate = true;
          }
          screenMaterial.color.setScalar(p < 0.12 ? 0 : 1);
          camera.position.set(
            0,
            mix(5.0, 0.596, zoom),
            mix(desktopZ, 2.88, zoom),
          );
          camera.lookAt(0, mix(-0.1, 0.596, zoom), -0.96);
        } else {
          const arrive = smooth((p - 8.3) / 0.65),
            zoomEnd = smooth((p - 10) / 1);
          if (screenMaterial.map !== null) {
            screenMaterial.map = null;
            screenMaterial.needsUpdate = true;
          }
          screenMaterial.color.set("#080d13");
          const panel = document.getElementById("screen-handoff");
          if (panel) {
            panel.dataset.deployed = String(p >= 9.67);
            panel.style.setProperty(
              "--surface-glare",
              String(1 - smooth((p - 9.8) / 0.8)),
            );
            panel.style.opacity = String(smooth((p - 8.3) / 0.55));
            const cursor = panel.querySelector<HTMLElement>(".surface-cursor");
            const button = panel.querySelector<HTMLElement>(".published-pill");
            if (cursor && button) {
              const click = clamp((p - 9.15) / 0.52);
              cursor.style.left = `${mix(root.clientWidth * 0.7, button.offsetLeft + button.offsetWidth * 0.6, smooth(click))}px`;
              cursor.style.top = `${mix(root.clientHeight * 0.75, button.offsetTop + button.offsetHeight * 0.6, smooth(click))}px`;
              cursor.style.opacity = String(1 - smooth((p - 9.7) / 0.35));
            }
          }
          const endZ =
            -0.84 +
            Math.min((4.55 * root.clientHeight) / root.clientWidth, 2.56) /
              (2 * Math.tan((19 * Math.PI) / 180));
          camera.position.set(
            0,
            mix(1.4, 0.6, zoomEnd),
            mix(desktopZ, endZ, zoomEnd),
          );
          camera.lookAt(0, mix(-5, mix(0, 0.6, zoomEnd), arrive), -0.96);
        }
        glareMaterial.uniforms.amount.value = closing
          ? 1 - smooth((p - 10) / 0.7)
          : 1 - smooth((p - 1.3) / 0.7);
        glassMaterial.opacity = (closing ? 0.035 : 0.19) * glareMaterial.uniforms.amount.value;
        renderer.render(studio, camera);
        if (closing) {
          projectPage();
          // Reveal only after this frame has its matching screen projection.
          if (handoff) handoff.style.visibility = "visible";
        }
      } else {
        renderer.toneMappingExposure = 1.1;
        solar.update(p, spaceCamera, mobile, rotation.current);
        globe.visible = p < 3.65;
        globe.position.set(0, 0, 0);
        globe.scale.setScalar(1);
        globe.rotation.y =
          1.27 + smooth((p - 2) / 1.4) * 1.85 + rotation.current;
        routes.forEach((g, i) => {
          const t = clamp((p - 2.12 - i * 0.023) / 0.85);
          g.setDrawRange(0, Math.max(0, Math.floor(t * 101)));
          couriers[i].mesh.visible = t > 0 && t < 1;
          couriers[i].mesh.position.copy(couriers[i].curve.getPoint(t));
        });
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
      solar.dispose();
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
