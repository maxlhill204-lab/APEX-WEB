const sharp=require('sharp');
(async()=>{await sharp('public/portfolio/carbon-monarch-thumbnail.png').resize(1400).grayscale().webp({quality:88}).toFile('public/portfolio/carbon-screen.webp');await sharp('public/portfolio/vertexlab-thumbnail.png').resize(1400).grayscale().webp({quality:88}).toFile('public/portfolio/vertex-screen.webp')})();
