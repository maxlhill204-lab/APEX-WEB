import * as T from "three";
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => {
  const x = clamp(v);
  return x * x * (3 - 2 * x);
};
// Art-directed distances and radii. The mapped bodies retain fixed world positions;
// the camera travels between them instead of translating planets through the viewport.
export function createSolarSystem(
  scene: T.Scene,
  load: (name: string, srgb?: boolean) => T.Texture,
) {
  const system = new T.Group();
  scene.add(system);
  const specs: [string, number, number, number, number][] = [
    ["sun", 7, -34, 5, -48],
    ["mercury", 0.5, -24, -3, -30],
    ["venus_surface", 1, -17, 3, -20],
    ["earth_daymap", 1.2, -6, 1, -12],
    ["mars", 2.1, 14, 2, -22],
    ["jupiter", 3.2, -17, -3, -52],
    ["saturn", 3.2, 20, 3, -80],
    ["uranus", 1.6, -12, 8, -101],
    ["neptune", 2.6, 8, -2, -118],
  ];
  const bodies = specs.map(([name, r, x, y, z], i) => {
    const material =
      i === 0
        ? new T.MeshBasicMaterial({
            map: load(`${name}.webp`),
            color: 0xffcf87,
          })
        : new T.MeshStandardMaterial({
            map: load(`${name}.webp`),
            roughness: 0.94,
            metalness: 0,
          });
    const mesh = new T.Mesh(new T.SphereGeometry(r, 64, 48), material);
    mesh.position.set(x, y, z);
    mesh.rotation.z = i === 7 ? 1.4 : 0.1;
    system.add(mesh);
    return mesh;
  });
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 128;
  const ctx = glowCanvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.1, "rgba(255,255,255,.75)");
  gradient.addColorStop(0.35, "rgba(255,255,255,.12)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const glowTexture = new T.CanvasTexture(glowCanvas);
  const glow = (
    color: number,
    x: number,
    y: number,
    z: number,
    w: number,
    h = w,
  ) => {
    const s = new T.Sprite(
      new T.SpriteMaterial({
        map: glowTexture,
        color,
        transparent: true,
        blending: T.AdditiveBlending,
        depthWrite: false,
        opacity: 0.7,
      }),
    );
    s.position.set(x, y, z);
    s.scale.set(w, h, 1);
    system.add(s);
    return s;
  };
  glow(0xff8e39, -34, 5, -48, 48);
  glow(0x4678ed, 27, 6, -95, 68);
  glow(0xcb8b66, -45, -15, -120, 90, 35);
  glow(0xffcf9e, -34, 5, -47, 75, 0.7);
  // A broad banded ring with transparent gaps, oriented with Saturn's axial tilt.
  const ringMaterial = new T.ShaderMaterial({
    transparent: true,
    side: T.DoubleSide,
    depthWrite: false,
    uniforms: { tint: { value: new T.Color("#c8af87") } },
    vertexShader: `varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:
      `varying vec3 vP;uniform vec3 tint;void main(){float r=length(vP.xy);float band=.5+.5*sin(r*95.);float gap=smoothstep(.0,.045,abs(r-4.75));float alpha=(.22+.44*band)*gap;gl_FragColor=vec4(tint*(.6+.4*band),alpha);#include <colorspace_fragment>}`.replace(
        ";#include",
        ";\n#include",
      ),
  });
  const rings = new T.Mesh(new T.RingGeometry(3.9, 6.6, 160), ringMaterial);
  rings.rotation.set(1.12, 0.14, -0.25);
  bodies[6].add(rings);
  const sunLight = new T.PointLight(0xffe3b6, 260, 0, 1);
  sunLight.position.copy(bodies[0].position);
  system.add(sunLight);
  let seed = 79;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const positions = new Float32Array(1900 * 3),
    colors = new Float32Array(1900 * 3);
  for (let i = 0; i < 1900; i++) {
    const a = rnd() * Math.PI * 2,
      z = rnd() * 2 - 1,
      r = 180 + rnd() * 260;
    const q = Math.sqrt(1 - z * z);
    positions.set(
      [Math.cos(a) * q * r, z * r, Math.sin(a) * q * r - 60],
      i * 3,
    );
    const c = new T.Color().setHSL(0.55 + rnd() * 0.15, 0.2, 0.4 + rnd() * 0.5);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  const starMaterial = new T.PointsMaterial({
    size: 2.0,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    map: glowTexture,
    blending: T.AdditiveBlending,
  });
  const stars = new T.Points(
    new T.BufferGeometry()
      .setAttribute("position", new T.BufferAttribute(positions, 3))
      .setAttribute("color", new T.BufferAttribute(colors, 3)),
    starMaterial,
  );
  scene.add(stars);
  const satellites: T.Group[] = [];
  for (let j = 0; j < 3; j++) {
    const g = new T.Group();
    g.position.set(j === 0 ? -42 : 48, 15 - j * 13, -95 - j * 48);
    g.rotation.x = 0.65 + j * 0.3;
    g.rotation.z = j * 0.5;
    system.add(g);
    satellites.push(g);
    const star = new T.Mesh(
      new T.SphereGeometry(0.45, 16, 12),
      new T.MeshBasicMaterial({ color: 0xffe2b4 }),
    );
    g.add(star);
    for (let k = 0; k < 4; k++) {
      const r = 2 + k * 1.1;
      const pts = Array.from(
        { length: 129 },
        (_, n) =>
          new T.Vector3(
            Math.cos((n / 128) * Math.PI * 2) * r,
            0,
            Math.sin((n / 128) * Math.PI * 2) * r,
          ),
      );
      g.add(
        new T.Line(
          new T.BufferGeometry().setFromPoints(pts),
          new T.LineBasicMaterial({
            color: 0xcbb59b,
            transparent: true,
            opacity: 0.2,
          }),
        ),
      );
      const orb = new T.Mesh(
        new T.SphereGeometry(0.12 + k * 0.035, 12, 8),
        new T.MeshStandardMaterial({ color: k % 2 ? 0x688fad : 0xbdaa8d }),
      );
      orb.position.set(Math.cos(k * 2) * r, 0, Math.sin(k * 2) * r);
      g.add(orb);
    }
  }
  const hole = new T.Group();
  hole.position.set(-11, 5, -92);
  hole.rotation.set(0.4, 0.3, 0.5);
  system.add(hole);
  hole.add(
    new T.Mesh(
      new T.SphereGeometry(2, 48, 32),
      new T.MeshBasicMaterial({ color: 0x000000 }),
    ),
  );
  const accretion = new T.Mesh(
    new T.RingGeometry(2.15, 5, 128),
    new T.ShaderMaterial({
      transparent: true,
      side: T.DoubleSide,
      depthWrite: false,
      uniforms: { time: { value: 0 } },
      vertexShader: `varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec3 vP;uniform float time;void main(){float r=length(vP.xy);float a=atan(vP.y,vP.x);float waves=.5+.5*sin(r*38.+a*4.-time*3.);float edge=1.-smoothstep(2.1,5.,r);gl_FragColor=vec4(mix(vec3(.6,.2,.04),vec3(1.,.82,.5),edge),edge*(.25+waves*.65));\n#include <colorspace_fragment>}`,
    }),
  );
  accretion.rotation.x = 1.0;
  hole.add(accretion);
  const lens = new T.Mesh(
    new T.TorusGeometry(2.2, 0.055, 12, 128),
    new T.MeshBasicMaterial({ color: 0xffe5b6 }),
  );
  hole.add(lens);
  const meteors = Array.from({ length: 5 }, (_, i) => {
    const g = new T.BufferGeometry().setFromPoints([
      new T.Vector3(),
      new T.Vector3(4, 1.5, 0),
    ]);
    const line = new T.Line(
      g,
      new T.LineBasicMaterial({
        color: 0xd8e9ff,
        transparent: true,
        opacity: 0,
      }),
    );
    system.add(line);
    return line;
  });
  const posKeys = [
    [2, 0, 0, 7],
    [2.55, -2, 1, 9],
    [3.3, -3, 2, 9],
    [3.85, 4, 6, -5],
    [4.25, 11, 3, -12],
    [4.85, 13, 3, -14],
    [5.15, 4, 7, -40],
    [5.6, 17, 5, -65],
    [6.15, 19, 4, -68],
    [6.45, -3, 8, -86],
    [6.85, 5, -1, -106],
    [7.4, 7, -1, -108],
    [8.25, 40, 210, 430],
  ];
  const lookKeys = [
    [2, 0, 0, 0],
    [2.55, -1.8, 0, 0],
    [3.3, -1.8, 0, 0],
    [3.85, 11, 2, -22],
    [4.25, 11, 2, -22],
    [4.85, 11.5, 2, -22],
    [5.15, 14, 3, -75],
    [5.6, 16, 3, -80],
    [6.15, 16, 3, -80],
    [6.45, -7, 5, -92],
    [6.85, 4.5, -2, -118],
    [7.4, 4.5, -2, -118],
    [8.25, 0, 0, -62],
  ];
  const interpolate = (keys: number[][], p: number) => {
    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
    const a = keys[i],
      b = keys[i + 1],
      t = ease((p - a[0]) / (b[0] - a[0]));
    return new T.Vector3(
      T.MathUtils.lerp(a[1], b[1], t),
      T.MathUtils.lerp(a[2], b[2], t),
      T.MathUtils.lerp(a[3], b[3], t),
    );
  };
  const fades = new Map<T.Material, number>();
  system.traverse((o) => {
    const m = (o as T.Mesh).material;
    if (m) {
      for (const mat of Array.isArray(m) ? m : [m]) {
        if (!fades.has(mat)) fades.set(mat, mat.opacity);
        mat.transparent = true;
      }
    }
  });
  return {
    update(
      p: number,
      camera: T.PerspectiveCamera,
      mobile: boolean,
      rotation: number,
    ) {
      const position = interpolate(posKeys, p),
        target = interpolate(lookKeys, p);
      if (mobile && p > 2.05 && p < 7.6) {
        position.z += ease((p - 2.05) / 0.4) * 9;
        target.y += ease((p - 2.05) / 0.4) * 3;
        target.x += ease((p - 2.05) / 0.4) * 2;
      }
      camera.position.copy(position);
      camera.lookAt(target);
      system.visible = p > 3.15;
      stars.visible = true;
      starMaterial.opacity = 0.8 * (1 - ease((p - 7.65) / 0.6));
      fades.forEach((alpha, m) => (m.opacity = alpha * ease((p - 3.15) / 0.7)));
      bodies.forEach((b, i) => (b.rotation.y = (p - 3.3) * 5.8 + i + rotation));
      satellites.forEach((g, i) => (g.rotation.y = p * 0.65 + i));
      accretion.material.uniforms.time.value = p * 4;
      meteors.forEach((m, i) => {
        const t = (p * 0.7 + i * 0.21) % 1;
        m.position.set(10 - t * 45, 12 - t * 16, -30 - i * 23);
        m.material.opacity = Math.sin(t * Math.PI) * 0.5;
      });
    },
    dispose() {
      glowTexture.dispose();
    },
  };
}
