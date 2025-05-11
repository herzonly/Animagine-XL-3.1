import express from "express";
import { client } from "@gradio/client";
import * as eventsource from "eventsource";

global.EventSource = eventsource;

const app = express();

app.get("/", (req, res) => {
  res.send("Gradio API is running");
});

app.get("/generate", async (req, res) => {
  const { prompt, negative_prompt } = req.query;
  if (!prompt || !negative_prompt) {
    return res.status(400).json({ error: "Missing prompt or negative_prompt" });
  }

  try {
    const gradioApp = await client("Asahina2K/animagine-xl-3.1");
    const result = await gradioApp.predict("/run", [
      prompt,
      negative_prompt,
      0,
      512,
      512,
      1,
      1,
      "DPM++ 2M Karras",
      "1024 x 1024",
      "(None)",
      "(None)",
      true,
      0,
      1,
      true
    ]);
    res.json(result.data);
  } catch (e) {
    console.error("Generation error:", e);
    res.status(500).json({ error: "Failed to generate", details: e.toString() });
  }
});

export default app;
