const { client } = require('@gradio/client');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
};
