import * as git from "virtual:build-meta/git";

import "./index.css";

interface Detail {
  label: string;
  value: string | null;
  href?: string | null;
  notes?: Array<string | null>;
}

const formatDate = (value: string | null) => {
  if (!value) return null;

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const isLinkableUrl = (value: string | null | undefined): value is string =>
  value != null && /^https?:\/\//.test(value);

const renderValue = (detail: Detail) => {
  const value = detail.value ?? "Not available";
  const className = detail.value == null ? "meta-value is-muted" : "meta-value";
  const href = detail.href;

  if (isLinkableUrl(href)) {
    return `<a class="${className}" href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(value)}</a>`;
  }

  return `<span class="${className}">${escapeHtml(value)}</span>`;
};

const renderDetail = (detail: Detail) => {
  const notes =
    detail.notes?.filter((note): note is string => note != null && note.length > 0) ?? [];

  return `
    <div class="meta-row">
      <dt>${escapeHtml(detail.label)}</dt>
      <dd>
        ${renderValue(detail)}
        ${notes.map((note) => `<span class="meta-note">${escapeHtml(note)}</span>`).join("")}
      </dd>
    </div>
  `;
};

const details: Detail[] = [
  {
    label: "Repository",
    value: git.repositoryUrl,
    href: git.repositoryUrl,
  },
  {
    label: "Branch",
    value: git.branch,
  },
  {
    label: "Commit",
    value: git.shortSha,
    notes: [git.latestCommitMessage],
  },
  {
    label: "Author",
    value: git.commitAuthorName,
    notes: [git.commitAuthorEmail, formatDate(git.commitAuthorDate)],
  },
  {
    label: "Current tag",
    value: git.tag,
  },
  {
    label: "Latest tag",
    value: git.lastTag,
  },
];

const root = document.querySelector<HTMLDivElement>("#root");

if (root == null) {
  throw new Error("Missing #root element");
}

root.innerHTML = `
  <div class="page-shell">
    <header class="page-header">
      <p class="example-label">Rspack example</p>
      <h1>Build metadata</h1>
      <p>
        A small plain TypeScript page that imports <code>virtual:build-meta/git</code> and
        renders the generated Git metadata.
      </p>
    </header>

    <main class="meta-card" aria-labelledby="metadata-heading">
      <div class="card-header">
        <div>
          <p class="card-kicker">Virtual module</p>
          <h2 id="metadata-heading">Git metadata</h2>
        </div>
        <span class="card-badge">build time</span>
      </div>

      <dl class="meta-list">
        ${details.map(renderDetail).join("")}
      </dl>
    </main>
  </div>
`;
