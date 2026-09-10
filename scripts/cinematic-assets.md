# Cinematic asset provenance

- Planet maps: Solar System Scope, https://www.solarsystemscope.com/textures/, CC BY 4.0. Based on NASA imagery, with source colour tuning and some reconstructed terrain. Mars obtained from https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_2k_mars.jpg. Converted to 2048 px WebP at quality 85.
- Marble diffuse and OpenGL normal map: Rob Tuytel, Poly Haven Marble 01, https://polyhaven.com/a/marble_01, CC0. Converted from the 1K JPG maps to WebP at quality 85.
- Posters: captured from our own Three.js scenes with all HTML overlays hidden; `scripts/cinema-posters.cjs` regenerates them from the local development site. The canvas renders the same models used interactively.
- `studio-environment.bin.gz`: generated with Three.js 0.186.0 RoomEnvironment and PMREMGenerator.fromScene(room, .04, .1, 100, {size:64}). The target is 336 x 256 RGBA half-float (Uint16), read with readRenderTargetPixels and gzip-compressed. It is loaded as a DataTexture with HalfFloatType, CubeUVReflectionMapping, LinearFilter, and LinearSRGBColorSpace. This avoids generating the filtered environment on visitors' devices. Three.js is MIT licensed.

Public attribution is available at /credits and linked in the footer.
