import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const searchUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/github/${username}`
      );

      const data = await response.json();

      setUser(data.user);
      setRepos(data.repos);
    } catch (error) {
      alert("User not found");
    }
  };

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

      {user && (
        <div
          style={{
            marginTop: "40px",
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

          <h2>{user.name}</h2>

          <p>@{user.login}</p>

          <p>Followers: {user.followers}</p>

          <p>Public Repos: {user.public_repos}</p>

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
      {repos.length > 0 && (
  <div
    style={{
      marginTop: "30px",
      width: "100%",
      maxWidth: "800px",
    }}
  >
    <h2 style={{ marginBottom: "20px" }}>Repositories</h2>

    {repos.map((repo) => (
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

        <p>{repo.description || "No description available"}</p>

        <p>⭐ Stars: {repo.stargazers_count}</p>
        <p>🍴 Forks: {repo.forks_count}</p>
        <p>Language: {repo.language}</p>
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