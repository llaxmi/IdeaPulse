import cors from "cors";
import express from "express";
import run from "./vectorStore.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/results", async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const result = await run(data.question);
    console.log(result);
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
