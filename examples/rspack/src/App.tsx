import { useState } from "react";
import * as git from "virtual:build-meta/git";
import "./App.css";

function App() {
  const [showGitInfo, setShowGitInfo] = useState(false);

  return (
    <div className="app">
      <main className="container">
        <section className="welcome-section">
          <h1 className="heading">Build Meta Example</h1>
          <p className="text-muted">
            A simple demonstration of using
            {" "}
            <code>unplugin-build-meta</code>
            {" "}
            to display Git repository information.
          </p>
        </section>

        <section className="git-section">
          <div className="section-header">
            <h2 className="subheading">Repository Information</h2>
            <button
              className="btn"
              onClick={() => setShowGitInfo(!showGitInfo)}
            >
              {showGitInfo ? "Hide Details" : "Show Details"}
            </button>
          </div>

          {showGitInfo && (
            <div className="git-details">
              {git.repositoryUrl && (
                <div className="git-item">
                  <div className="git-label">Repository</div>
                  <a href={git.repositoryUrl} target="_blank" rel="noreferrer" className="git-link">
                    {git.repositoryUrl}
                  </a>
                </div>
              )}

              <div className="git-item">
                <div className="git-label">Branch</div>
                <div className="git-value">{git.branch || "Not available"}</div>
              </div>

              <div className="git-item">
                <div className="git-label">Latest Commit</div>
                <div className="git-value">{git.shortSha || "Not available"}</div>
                {git.latestCommitMessage && (
                  <div className="git-commit-message">
                    "
                    {git.latestCommitMessage}
                    "
                  </div>
                )}
              </div>

              {git.commitAuthorName && (
                <div className="git-item">
                  <div className="git-label">Author</div>
                  <div className="git-value">
                    {git.commitAuthorName}
                    {git.commitAuthorEmail && <span className="git-email">{git.commitAuthorEmail}</span>}
                    {git.commitAuthorDate && (
                      <span className="git-date">
                        on
                        {" "}
                        {new Date(git.commitAuthorDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {git.tag && (
                <div className="git-item">
                  <div className="git-label">Current Tag</div>
                  <div className="git-value">{git.tag}</div>
                </div>
              )}

              {git.lastTag && git.lastTag !== git.tag && (
                <div className="git-item">
                  <div className="git-label">Latest Tag</div>
                  <div className="git-value">{git.lastTag}</div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p className="text-xs text-muted">
          Built with unplugin-build-meta
        </p>
      </footer>
    </div>
  );
}

export default App;
