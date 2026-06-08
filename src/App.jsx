import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [sortBy, setSortBy] = useState("stars");
  const [loading, setLoading] = useState(false);

  const searchUser = async () => {
    if (!username.trim()) {
      alert("Please enter a GitHub username");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/github/${username}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "User not found");
      }

      setUser(data.user);
      setRepos(data.repos);
    } catch (error) {
      setUser(null);
      setRepos([]);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sortedRepos = [...repos].sort((a, b) => {
    if (sortBy === "stars") {
      return b.stargazers_count - a.stargazers_count;
    }

    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    if (sortBy === "updated") {
      return new Date(b.updated_at) - new Date(a.updated_at);
    }

    return 0;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1>GitHub Repo Explorer</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter GitHub Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "12px",
            width: "300px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <button
          onClick={searchUser}
          style={{
            marginLeft: "10px",
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Search
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            marginLeft: "10px",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          <option value="stars">Stars</option>
          <option value="name">Name</option>
          <option value="updated">Last Updated</option>
        </select>
      </div>

      {loading && <h3>Loading...</h3>}

      {user && (
        <div
          style={{
            marginTop: "30px",
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
            width: "400px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <img
            src={user.avatar_url}
            alt=""
            width="120"
            style={{ borderRadius: "50%" }}
          />

          <h2>{user.name || user.login}</h2>

          <p>{user.bio}</p>

          <p>Followers: {user.followers}</p>

          <p>Following: {user.following}</p>

          <p>Public Repos: {user.public_repos}</p>

          <p>@{user.login}</p>

          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#60a5fa" }}
          >
            View GitHub Profile
          </a>
        </div>
      )}

      {sortedRepos.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            maxWidth: "900px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2>Repositories</h2>

          {sortedRepos.map((repo) => (
            <div
              key={repo.id}
              style={{
                background: "#1e293b",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
                textAlign: "left",
              }}
            >
              <h3>{repo.name}</h3>

              <p>
                {repo.description || "No description available"}
              </p>

              <p>⭐ Stars: {repo.stargazers_count}</p>

              <p>
                🍴 Forks: {repo.forks_count}
              </p>

              <p>
                Language:{" "}
                {repo.language || "Not Specified"}
              </p>

              <p>
                Updated:{" "}
                {new Date(
                  repo.updated_at
                ).toLocaleDateString()}
              </p>

              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#60a5fa" }}
              >
                Open Repository
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;