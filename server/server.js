const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/api/github/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const user = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const repos = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );

    res.json({
      user: user.data,
      repos: repos.data,
    });
  } catch (error) {
    res.status(404).json({
      message: "User not found",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});