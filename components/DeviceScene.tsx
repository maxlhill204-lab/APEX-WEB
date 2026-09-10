import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type Props = {
  progress: React.RefObject<number>;
  rotation: React.RefObject<number>;
  playing: React.RefObject<boolean>;
  onReady: () => void;
  onFailure: () => void;
};
export default function DeviceScene({
  progress,
  rotation,
  playing,
  onReady,
  onFailure,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = host.current;
    if (!root) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      onFailure();
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    root.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 1.2, 11.8);
    camera.lookAt(0, 0.15, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = new RoomEnvironment();
    const env = pmrem.fromScene(environment, 0.04);
    scene.environment = env.texture;
    environment.dispose();
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(-3, 6, 4);
    scene.add(key);
    const edge = new THREE.DirectionalLight(0xd8e5ff, 2.5);
    edge.position.set(4, 2, -3);
    scene.add(edge);
    const silver = new THREE.MeshStandardMaterial({
      color: 0x999da2,
      metalness: 0.95,
      roughness: 0.24,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x101113,
      metalness: 0.6,
      roughness: 0.25,
    });
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0x090a0b,
      metalness: 0.25,
      roughness: 0.6,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const meshes: THREE.Mesh[] = [];
    function box(
      w: number,
      h: number,
      d: number,
      r: number,
      mat: THREE.Material,
    ) {
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), mat);
      meshes.push(mesh);
      return mesh;
    }
    const laptop = new THREE.Group();
    scene.add(laptop);
    laptop.position.y = 0.1;
    const base = box(4.9, 0.12, 3.15, 0.05, silver);
    base.position.set(0, -1.03, 0.6);
    laptop.add(base);
    const bottom = box(4.87, 0.035, 3.1, 0.02, dark);
    bottom.position.copy(base.position);
    bottom.position.y -= 0.07;
    laptop.add(bottom);
    const keyboard = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.28, 0.018, 0.21),
      keyMat,
      65,
    );
    const temp = new THREE.Object3D();
    let ki = 0;
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 13; col++) {
        temp.position.set((col - 6) * 0.325, -0.952, -0.47 + row * 0.27);
        temp.updateMatrix();
        keyboard.setMatrixAt(ki++, temp.matrix);
      }
    laptop.add(keyboard);
    const trackpad = box(
      1.6,
      0.012,
      0.83,
      0.06,
      new THREE.MeshStandardMaterial({
        color: 0x7c8085,
        metalness: 0.85,
        roughness: 0.32,
      }),
    );
    trackpad.position.set(0, -0.955, 1.43);
    laptop.add(trackpad);
    const lid = new THREE.Group();
    lid.position.set(0, -0.97, -0.92);
    lid.rotation.x = -0.13;
    laptop.add(lid);
    const screenFrame = box(4.87, 3.08, 0.115, 0.09, silver);
    screenFrame.position.set(0, 1.54, 0);
    lid.add(screenFrame);
    const screenBezel = box(4.74, 2.96, 0.025, 0.07, dark);
    screenBezel.position.set(0, 1.55, 0.069);
    lid.add(screenBezel);
    const loader = new THREE.TextureLoader();
    let disposed = false;
    const texture = loader.load(
      "/portfolio/carbon-screen.webp",
      () => {
        if (!disposed) onReady();
      },
      undefined,
      () => onFailure(),
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    const secondTexture = loader.load("/portfolio/vertex-screen.webp");
    secondTexture.colorSpace = THREE.SRGBColorSpace;
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      toneMapped: false,
    });
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(4.53, 2.55),
      screenMaterial,
    );
    screen.position.set(0, 1.55, 0.09);
    lid.add(screen);
    const webcam = new THREE.Mesh(
      new THREE.CircleGeometry(0.016, 12),
      new THREE.MeshBasicMaterial({ color: 0x787878 }),
    );
    webcam.position.set(0, 2.95, 0.095);
    lid.add(webcam);
    // A second, genuinely three-dimensional device enters the responsive chapter.
    const phone = new THREE.Group();
    scene.add(phone);
    const phoneBody = box(1.15, 2.3, 0.13, 0.12, silver);
    phone.add(phoneBody);
    const phoneBezel = box(1.08, 2.23, 0.025, 0.11, dark);
    phoneBezel.position.z = 0.073;
    phone.add(phoneBezel);
    const phoneCanvas = document.createElement("canvas");
    phoneCanvas.width = 480;
    phoneCanvas.height = 960;
    const ctx = phoneCanvas.getContext("2d")!;
    ctx.fillStyle = "#101114";
    ctx.fillRect(0, 0, 480, 960);
    ctx.fillStyle = "#eeeeee";
    ctx.font = "bold 22px Arial";
    ctx.fillText("CARBONMONARCH", 35, 100);
    ctx.font = "bold 67px Arial";
    ctx.fillText("Engineered", 35, 235);
    ctx.fillText("in Carbon.", 35, 310);
    ctx.font = "24px Arial";
    ctx.fillStyle = "#aaaaaa";
    ctx.fillText("Made for the everyday.", 35, 375);
    ctx.fillStyle = "#e5e5e2";
    ctx.beginPath();
    ctx.roundRect(35, 420, 410, 65, 8);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.font = "22px Arial";
    ctx.fillText("Explore the collection   ↗", 65, 462);
    ctx.fillStyle = "#282a2d";
    ctx.fillRect(35, 535, 410, 300);
    ctx.fillStyle = "#c9c9c6";
    ctx.font = "bold 80px Arial";
    ctx.fillText("CM", 160, 710);
    ctx.font = "19px Arial";
    ctx.fillText("DESIGNED FOR EVERY DAY.", 75, 785);
    const phoneTexture = new THREE.CanvasTexture(phoneCanvas);
    phoneTexture.colorSpace = THREE.SRGBColorSpace;
    const phoneScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.99, 2.05),
      new THREE.MeshBasicMaterial({ map: phoneTexture, toneMapped: false }),
    );
    phoneScreen.position.z = 0.091;
    phone.add(phoneScreen);
    const speaker = box(0.26, 0.045, 0.01, 0.02, keyMat);
    speaker.position.set(0, 1.045, 0.099);
    phone.add(speaker);
    // A sculptural orbit and moving light beads lead the eye between chapters.
    const orbit = new THREE.Group();
    scene.add(orbit);
    orbit.rotation.set(1.12, 0.18, -0.22);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.35, 0.009, 6, 160),
      glowMat,
    );
    orbit.add(ring);
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.57, 0.003, 4, 160),
      new THREE.MeshBasicMaterial({
        color: 0xbdbdbd,
        transparent: true,
        opacity: 0.22,
      }),
    );
    orbit.add(ring2);
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    orbit.add(bead);
    const panel = new THREE.Group();
    scene.add(panel);
    const panelBox = box(
      2.1,
      1.3,
      0.06,
      0.08,
      new THREE.MeshStandardMaterial({
        color: 0x1d2024,
        metalness: 0.55,
        roughness: 0.25,
      }),
    );
    panel.add(panelBox);
    const panelCanvas = document.createElement("canvas");
    panelCanvas.width = 640;
    panelCanvas.height = 380;
    const pc = panelCanvas.getContext("2d")!;
    pc.fillStyle = "#151719";
    pc.fillRect(0, 0, 640, 380);
    pc.fillStyle = "#ddd";
    pc.font = "23px Arial";
    pc.fillText("YOUR NEXT CUSTOMER", 35, 60);
    pc.font = "bold 39px Arial";
    pc.fillText("Let’s talk business.", 35, 130);
    pc.strokeStyle = "#777";
    pc.strokeRect(35, 173, 570, 65);
    pc.font = "24px Arial";
    pc.fillStyle = "#aaa";
    pc.fillText("Your email address", 55, 215);
    pc.fillStyle = "#eee";
    pc.fillRect(35, 263, 570, 70);
    pc.fillStyle = "#111";
    pc.font = "bold 24px Arial";
    pc.fillText("Send an enquiry                  ↗", 55, 307);
    const panelTexture = new THREE.CanvasTexture(panelCanvas);
    panelTexture.colorSpace = THREE.SRGBColorSpace;
    const panelScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.99, 1.18),
      new THREE.MeshBasicMaterial({ map: panelTexture, toneMapped: false }),
    );
    panelScreen.position.z = 0.041;
    panel.add(panelScreen);
    const resize = () => {
      const w = root.clientWidth,
        h = root.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.position.z = innerWidth < 501 ? 14 : w / h < 1 ? 15 : 11.8;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(root);
    resize();
    let visible = true;
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    });
    observer.observe(root);
    let frame = 0,
      last = 0,
      time = 0;
    const lerp = THREE.MathUtils.lerp;
    const clamp = THREE.MathUtils.clamp;
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!visible || document.hidden || now - last < 1000 / 45) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (playing.current) time += dt;
      const p = clamp(progress.current, 0, 3);
      const a = clamp(p, 0, 1),
        b = clamp(p - 1, 0, 1),
        c = clamp(p - 2, 0, 1);
      const targetY =
        lerp(-0.45, 0.62, a) + b * -0.48 + c * 0.3 + rotation.current;
      laptop.rotation.y = lerp(laptop.rotation.y, targetY, 0.065);
      laptop.rotation.x = lerp(
        laptop.rotation.x,
        0.1 + a * 0.08 - b * 0.16,
        0.065,
      );
      laptop.rotation.z = lerp(
        laptop.rotation.z,
        -0.075 + a * 0.12 - b * 0.075,
        0.065,
      );
      laptop.position.set(
        -b * 0.28 - c * 0.35,
        0.02 + Math.sin(time * 0.75) * 0.055,
        0.0,
      );
      laptop.scale.setScalar(1 - b * 0.13 - c * 0.06);
      lid.rotation.x = lerp(-0.13, -0.4, a) + b * 0.22;
      phone.scale.setScalar(Math.max(0.001, b));
      phone.position.set(
        1.65 + b * 0.4,
        -0.2 + Math.sin(time * 0.9 + 1) * 0.08,
        1 + b * 0.25,
      );
      phone.rotation.set(0.05, -0.32 + rotation.current * 0.25, 0.08);
      panel.scale.setScalar(Math.max(0.001, c));
      panel.position.set(0.9, -0.5, 2.2);
      panel.rotation.set(-0.05, -0.14 + rotation.current * 0.1, 0.03);
      orbit.rotation.z = -0.22 + p * 0.25 + time * 0.022;
      orbit.rotation.x = 1.12 - p * 0.15;
      bead.position.set(
        Math.cos(time * 0.42) * 3.35,
        Math.sin(time * 0.42) * 3.35,
        0,
      );
      screenMaterial.map = p > 0.65 && p < 1.6 ? secondTexture : texture;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);
    const lost = (e: Event) => {
      e.preventDefault();
      onFailure();
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      observer.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          for (const m of Array.isArray(o.material) ? o.material : [o.material])
            m.dispose();
        }
      });
      texture.dispose();
      secondTexture.dispose();
      phoneTexture.dispose();
      panelTexture.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress, rotation, playing, onReady, onFailure]);
  return <div ref={host} className="device-canvas" aria-hidden="true" />;
}
