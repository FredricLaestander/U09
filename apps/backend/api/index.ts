import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Vad du vill /Ella");
});

app.listen(process.env.PORT, () => {
  console.log(`server ready on http://localhost:${process.env.PORT}`);
});

export default app;
