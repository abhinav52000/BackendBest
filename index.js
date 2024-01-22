const connectToMongo = require("./db");
const express = require("express");

connectToMongo();
const app = express();

app.use(express.text());
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  res.send("{Hello world}");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/createPosts", require("./routes/auth"));

app.listen(port, () => {
  console.log(`The Db is running at http://localhost:${port}`);
});
