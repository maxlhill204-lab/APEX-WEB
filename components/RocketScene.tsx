import { useEffect, useRef } from "react";
import * as T from "three";
export default function RocketScene({
  progress,
}: {
  progress: React.RefObject<number>;
}) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = host.current;
    if (!root) return;
    let renderer: T.WebGLRenderer;
    try {
      renderer = new T.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.toneMapping = T.ACESFilmicToneMapping;
    root.appendChild(renderer.domElement);
    const scene = new T.Scene(),
      camera = new T.PerspectiveCamera(35, 1, 0.1, 100);
    scene.add(new T.HemisphereLight(0xffecd8, 0x32303a, 2));
    const light = new T.DirectionalLight(0xffffff, 4);
    light.position.set(-5, 6, 8);
    scene.add(light);
    const rim = new T.DirectionalLight(0x84baff, 3);
    rim.position.set(4, -2, -4);
    scene.add(rim);
    const rocket = new T.Group();
    scene.add(rocket);
    const white = new T.MeshPhysicalMaterial({
      color: 0xd4d1cb,
      metalness: 0.65,
      roughness: 0.22,
      clearcoat: 0.6,
    });
    const dark = new T.MeshStandardMaterial({
      color: 0x282b2e,
      metalness: 0.85,
      roughness: 0.23,
    });
    const tan = new T.MeshStandardMaterial({
      color: 0xa98e69,
      metalness: 0.7,
      roughness: 0.3,
    });
    const edgeMaterial = new T.LineBasicMaterial({
      color: 0x766044,
      transparent: true,
      opacity: 0,
    });
    const surfaces: T.Material[] = [white, dark, tan];
    const add = (
      geometry: T.BufferGeometry,
      material: T.Material,
      y: number,
    ) => {
      const m = new T.Mesh(geometry, material);
      m.position.y = y;
      rocket.add(m);
      const edges = new T.LineSegments(
        new T.EdgesGeometry(geometry, 24),
        edgeMaterial,
      );
      m.add(edges);
      return m;
    };
    add(new T.CylinderGeometry(0.56, 0.56, 5.2, 64, 10), white, 0);
    add(new T.ConeGeometry(0.56, 1.75, 64), white, 3.47);
    for (const y of [-2.5, -1.9, 0.3, 2.55])
      add(new T.CylinderGeometry(0.568, 0.568, 0.1, 64), dark, y);
    add(new T.CylinderGeometry(0.49, 0.65, 0.65, 48, 2, true), dark, -2.9);
    for (let i = 0; i < 4; i++) {
      const shape = new T.Shape();
      shape.moveTo(0.5, -1.2);
      shape.lineTo(1.25, -2.65);
      shape.lineTo(0.5, -2.55);
      shape.closePath();
      const fin = add(
        new T.ExtrudeGeometry(shape, {
          depth: 0.07,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.025,
          bevelThickness: 0.02,
        }),
        tan,
        0,
      );
      fin.rotation.y = (i * Math.PI) / 2;
    }
    for (let i = 0; i < 3; i++) {
      const g = new T.CylinderGeometry(0.13, 0.21, 0.4, 24);
      const nozzle = add(g, dark, -3.2);
      nozzle.position.x = Math.cos(i * 2.094) * 0.27;
      nozzle.position.z = Math.sin(i * 2.094) * 0.27;
    }
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 256;
    labelCanvas.height = 1024;
    const c = labelCanvas.getContext("2d")!;
    c.clearRect(0, 0, 256, 1024);
    c.fillStyle = "#262421";
    c.font = "bold 66px Arial";
    c.textAlign = "center";
    ["A", "P", "E", "X"].forEach((v, i) => c.fillText(v, 128, 230 + i * 120));
    c.font = "26px monospace";
    c.fillText("01", 128, 900);
    const labelTexture = new T.CanvasTexture(labelCanvas);
    const label = add(
      new T.PlaneGeometry(0.42, 1.7),
      new T.MeshBasicMaterial({ map: labelTexture, transparent: true }),
      0.8,
    );
    label.position.z = 0.565;
    surfaces.push(label.material);
    const plumeMaterial = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: T.DoubleSide,
      blending: T.AdditiveBlending,
      uniforms: { power: { value: 1 } },
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec2 vUv;uniform float power;void main(){float a=pow(vUv.y,1.5)*power;gl_FragColor=vec4(mix(vec3(.35,.55,1.),vec3(1.,.85,.6),vUv.y),a*.7);}`,
    });
    const plume = add(
      new T.ConeGeometry(0.65, 5, 48, 1, true),
      plumeMaterial,
      -5.8,
    );
    plume.rotation.z = Math.PI;
    const panelEdges = new T.LineSegments(
      new T.EdgesGeometry(new T.CylinderGeometry(0.56, 0.56, 5.2, 16, 8), 2),
      edgeMaterial,
    );
    rocket.add(panelEdges);
    const noseWire = new T.LineSegments(
      new T.EdgesGeometry(new T.ConeGeometry(0.56, 1.75, 12), 1),
      edgeMaterial,
    );
    noseWire.position.y = 3.47;
    rocket.add(noseWire);
    const guides = new T.Group();
    scene.add(guides);
    for (const y of [-3.3, 0, 4.35]) {
      guides.add(
        new T.Line(
          new T.BufferGeometry().setFromPoints([
            new T.Vector3(-2.5, y, 0),
            new T.Vector3(2.5, y, 0),
          ]),
          edgeMaterial,
        ),
      );
    }
    guides.add(
      new T.Line(
        new T.BufferGeometry().setFromPoints([
          new T.Vector3(-2, -3.3, 0),
          new T.Vector3(-2, 4.35, 0),
        ]),
        edgeMaterial,
      ),
    );
    const streaks = Array.from({ length: 48 }, (_, i) => {
      const depth = i % 3,
        length = depth === 0 ? 4 : depth === 1 ? 2.2 : 0.8;
      const line = new T.Line(
        new T.BufferGeometry().setFromPoints([
          new T.Vector3(0, 0, 0),
          new T.Vector3(0.04, length, 0),
        ]),
        new T.LineBasicMaterial({
          color: depth === 0 ? 0xc3d6ed : 0x9aafc7,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      line.position.set(
        (i % 2 ? 1 : -1) * (3 + (i % 11) * 1.8),
        0,
        -depth * 13 - 2,
      );
      scene.add(line);
      return line;
    });
    let mobile = false,
      visible = false,
      frame = 0,
      previous = -1;
    const resize = () => {
      mobile = root.clientWidth < 700;
      renderer.setSize(root.clientWidth, root.clientHeight);
      camera.aspect = root.clientWidth / root.clientHeight;
      camera.updateProjectionMatrix();
      previous = -1;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(root);
    resize();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      previous = -1;
    });
    io.observe(root);
    const clamp = (x: number) => Math.max(0, Math.min(1, x));
    const smooth = (x: number) => {
      const v = clamp(x);
      return v * v * (3 - 2 * v);
    };
    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden || previous === progress.current) return;
      const p = progress.current;
      previous = p;
      const schematic = smooth((p - 0.32) / 0.2);
      rocket.position.set(
        T.MathUtils.lerp(0, mobile ? -9 : -5.5, smooth((p - 0.65) / 0.12)),
        T.MathUtils.lerp(-3, 0, smooth(p / 0.22)),
        0,
      );
      rocket.rotation.y = T.MathUtils.lerp(p * 7, 0.25, schematic);
      rocket.rotation.z = T.MathUtils.lerp(-0.12, 0, schematic);
      rocket.scale.setScalar(mobile ? T.MathUtils.lerp(1, 0.62, schematic) : 1);
      camera.position.set(
        0,
        T.MathUtils.lerp(0, 1, smooth(p / 0.25)),
        mobile ? 24 : 18,
      );
      camera.lookAt(0, 0.3, 0);
      surfaces.forEach((m) => {
        m.transparent = true;
        m.opacity = 1 - schematic;
        m.depthWrite = schematic < 0.1;
      });
      edgeMaterial.opacity = schematic;
      guides.visible = !mobile;
      guides.position.copy(rocket.position);
      guides.scale.copy(rocket.scale);
      plumeMaterial.uniforms.power.value = 1 - schematic;
      plume.visible = schematic < 0.99;
      streaks.forEach((line, i) => {
        const depth = i % 3,
          speed = depth === 0 ? 175 : depth === 1 ? 112 : 65;
        line.position.y = 25 - ((p * speed + i * 3.71) % 50);
        line.material.opacity =
          (1 - smooth((p - 0.27) / 0.12)) * (depth === 0 ? 0.45 : 0.3);
        line.visible = p < 0.4;
      });
      renderer.render(scene, camera);
    };
    render();
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      const geos = new Set<T.BufferGeometry>(),
        mats = new Set<T.Material>();
      scene.traverse((o) => {
        const m = o as T.Mesh;
        if (m.geometry) geos.add(m.geometry);
        if (m.material)
          (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) =>
            mats.add(x),
          );
      });
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      labelTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress]);
  return <div className="rocket-renderer" ref={host} aria-hidden="true" />;
}
