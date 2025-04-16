import type { SimpleGit } from "simple-git";
import parseGitUrl from "git-url-parse";
import { simpleGit } from "simple-git";
import { defineBuildMetaModule } from "../../module";

interface GitRepositoryInfo {
  branch?: string;
  sha?: string;
  shortSha?: string;
  latestCommitMessage?: string;
  commitAuthorName?: string;
  commitAuthorEmail?: string;
  commitAuthorDate?: string;
  commitCommitterName?: string;
  commitCommitterEmail?: string;
  commitCommitterDate?: string;
  tag?: string;
  tags?: string[];
  lastTag?: string;
  repositoryUrl?: string;
}

export default defineBuildMetaModule({
  name: "git",
  load: async () => {
    const git: SimpleGit = simpleGit();
    const info: GitRepositoryInfo = {};

    function generateOutput(data?: GitRepositoryInfo): string {
      const keys: Array<keyof GitRepositoryInfo> = [
        "repositoryUrl",
        "sha",
        "shortSha",
        "branch",
        "tag",
        "tags",
        "lastTag",
        "commitAuthorName",
        "commitAuthorEmail",
        "commitAuthorDate",
        "commitCommitterName",
        "commitCommitterEmail",
        "commitCommitterDate",
        "latestCommitMessage",
      ];

      return keys.map((key) =>
        `export const ${key} = ${data && data[key] !== undefined ? JSON.stringify(data[key]) : "null"}`,
      ).join("\n");
    }

    // skip all operations if not a git repo
    try {
      const isRepo = await git.checkIsRepo();
      if (!isRepo) {
        return generateOutput();
      }
    } catch (error) {
      console.error("failed to check if directory is a git repository:", error);
      return generateOutput();
    }

    // get branch information
    try {
      const branchInfo = await git.branch([]);
      info.branch = branchInfo.current;
    } catch (error) {
      console.error("failed to fetch branch information:", error);
    }

    // get commit information
    try {
      const log = await git.log(["-1"]);
      if (log.latest) {
        info.sha = log.latest.hash;
        info.shortSha = log.latest.hash?.slice(0, 10);
        info.latestCommitMessage = log.latest.message;
        info.commitAuthorName = log.latest.author_name;
        info.commitAuthorEmail = log.latest.author_email;
        info.commitAuthorDate = log.latest.date;
      }
    } catch (error) {
      console.error("failed to fetch commit information:", error);
    }

    // get committer information
    try {
      const committerInfo = await git.show(["-s", "--format=%cn%n%ce%n%cd"]);
      const committerLines = committerInfo.split("\n").map((line) => line.trim());

      if (committerLines.length >= 3) {
        info.commitCommitterName = committerLines[0];
        info.commitCommitterEmail = committerLines[1];
        info.commitCommitterDate = committerLines[2];
      }
    } catch (error) {
      console.error("failed to fetch committer information:", error);
    }

    // get tags information
    try {
      const hash = await git.revparse(["HEAD"]);
      const tagsResult = await git.tags(["--points-at", hash]);
      const allTags = await git.tags();

      info.tags = tagsResult.all;
      info.tag = tagsResult.all[tagsResult.all.length - 1];
      info.lastTag = allTags.latest;
    } catch (error) {
      console.error("failed to fetch tags information:", error);
    }

    // get github url
    try {
      const remotes = await git.getRemotes(true);
      const origin = remotes.find((remote) => remote.name === "origin");

      if (origin?.refs.fetch) {
        const parsed = parseGitUrl(origin.refs.fetch);
        if (parsed.resource === "github.com" && parsed.full_name) {
          info.repositoryUrl = `https://github.com/${parsed.full_name}`;
        }
      }
    } catch (error) {
      console.error("failed to fetch GitHub URL:", error);
    }

    return generateOutput(info);
  },
});
