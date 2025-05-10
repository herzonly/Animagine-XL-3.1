const express = require('express');
const { client } = require('@gradio/client');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate', async (req, res) => {
  try {
    const {
      prompt,
      negativePrompt,
      seed,
      width,
      height,
      guidanceScale,
      steps,
      sampler,
      aspectRatio,
      stylePreset,
      qualityPreset,
      useUpscaler,
      upscaleStrength,
      upscaleBy,
      addQualityTags,
    } = req.body;

    const gradioApp = await client("Asahina2K/animagine-xl-3.1");
    const result = await gradioApp.predict("/run", [
      prompt,
      negativePrompt || "",
      seed || 0,
      width || 512,
      height || 512,
      guidanceScale || 7,
      steps || 20,
      sampler || "DPM++ 2M Karras",
      aspectRatio || "1024 x 1024",
      stylePreset || "(None)",
      qualityPreset || "(None)",
      useUpscaler !== undefined ? useUpscaler : true,
      upscaleStrength !== undefined ? upscaleStrength : 0,
      upscaleBy !== undefined ? upscaleBy : 1,
      addQualityTags !== undefined ? addQualityTags : true,
    ]);

    if (!result.data || !result.data[0]) {
      return res.status(500).json({ error: "Failed to generate image" });
    }

    return res.json({ imageUrl: result.data[0] });
  } catch (error) {
    console.error("Error generating image:", error);
    return res.status(500).json({ 
      error: "An error occurred while generating the image",
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app
