import { SEO } from "@/components/SEO";
export default function Credits() {
  return (
    <>
      <SEO
        title="Visual credits — APEXWEB"
        description="Sources and licences for the materials used in the APEXWEB cinematic experience."
      />
      <section className="section container legal-page">
        <h1>Visual credits.</h1>
        <p>
          The cinematic models, camera choreography and interface are made for
          APEXWEB.
        </p>
        <h2>Planetary textures</h2>
        <p>
          Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune
          maps by{" "}
          <a href="https://www.solarsystemscope.com/textures/">
            Solar System Scope
          </a>
          , used under{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/">
            Creative Commons Attribution 4.0
          </a>
          . These maps are based on NASA imagery and elevation data, with colour
          adjustments and some reconstructed terrain. We resized and compressed
          them for the web; Earth is also used to draw the illuminated globe.
          The Mars map was obtained from its Wikimedia Commons mirror.
          Distances, planet sizes and camera paths are art-directed, not to
          scientific scale. The black hole and distant systems are illustrative.
        </p>
        <h2>Rendering and marks</h2>
        <p>
          The live experience uses physically based real-time rendering,
          environment reflections and a planar desk reflection. It does not use
          full path tracing. The Apple mark on the illustrative laptop is from
          Simple Icons (CC0); Apple is a trademark of Apple Inc. No affiliation
          is implied.
        </p>
        <h2>Desk material</h2>
        <p>
          <a href="https://polyhaven.com/a/wood_table_001">
            Wood Table 001 by Dimitrios Savva and Rico Cilliers, Poly Haven
          </a>
          , used under CC0. Diffuse and normal maps were resized and
          compressed for the web.
        </p>
      </section>
    </>
  );
}
