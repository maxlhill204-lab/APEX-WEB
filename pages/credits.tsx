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
          Earth, Mars, Jupiter and Neptune maps by{" "}
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
        </p>
        <h2>Marble material</h2>
        <p>
          <a href="https://polyhaven.com/a/marble_01">
            Marble 01 by Rob Tuytel, Poly Haven
          </a>
          , used under CC0. Diffuse and normal maps were resized and compressed
          for the web.
        </p>
      </section>
    </>
  );
}
