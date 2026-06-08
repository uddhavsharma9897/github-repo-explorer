const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// In-Memory Cache
// ======================

const cache = {};

// ======================
// Home Route
// ======================

app.get("/", (req, res) => {
  res.send("GitHub Repo Explorer Backend Running");
});

// ======================
// GitHub User Route
// ======================

app.get("/api/github/:username", async (req, res) => {
  try {
    const username = req.params.username;

    // Check Cache
    if (
      cache[username] &&
      Date.now() - cache[username].timestamp < 60000
    ) {
      console.log(`Serving ${username} from cache`);

      return res.json(cache[username].data);
    }

    // GitHub User
    const userResponse = await axios.get(
      `https://api.github.com/users/${username}`
    );

    // GitHub Repositories
    const repoResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );

    const responseData = {
      user: userResponse.data,
      repos: repoResponse.data,
    };

    // Save to Cache
    cache[username] = {
      data: responseData,
      timestamp: Date.now(),
    };

    console.log(`Fetched ${username} from GitHub`);

    res.json(responseData);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "GitHub user not found",
      });
    }

    if (error.response?.status === 403) {
      return res.status(403).json({
        message:
          "GitHub API rate limit exceeded. Please try again later.",
      });
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ======================

app.listen(5000, () => {
  console.log("Server running on port 5000");
});