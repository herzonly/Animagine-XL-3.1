const { GradioClient } = require("@gradio/client")

async function generateImage(
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
) {
  try {
    const client = await GradioClient.connect("https://fffiloni-animagine-xl-3-1.hf.space/")

    const result = await client.predict("/predict", [
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
    ])

    return result.data
  } catch (error) {
    console.error("Error generating image:", error)
    throw error
  }
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  )

  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const {
      prompt,
      negativePrompt = "",
      seed = 0,
      width = 512,
      height = 512,
      guidanceScale = 7,
      steps = 20,
      sampler = "DPM++ 2M Karras",
      aspectRatio = "1024 x 1024",
      stylePreset = "(None)",
      qualityPreset = "(None)",
      useUpscaler = true,
      upscaleStrength = 0.5,
      upscaleBy = 1.2,
      addQualityTags = true,
    } = req.body

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" })
    }

    const imageData = await generateImage(
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
    )

    return res.status(200).json({ success: true, imageData })
  } catch (error) {
    console.error("Error:", error)
    return res.status(500).json({ error: "Failed to generate image", details: error.message })
  }
}
