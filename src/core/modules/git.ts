import type { SimpleGit } from "simple-git";
import { simpleGit } from "simple-git";
import { defineBuildMetaModule } from "../../module";

export default defineBuildMetaModule({
  name: "git",
  load: async () => {
    const git = simpleGit();
    console.log(await git.checkIsRepo());
    console.log(await git.branch([]));
    // const info = await getRepoInfo(root, options?.git);
    return [
      `export const branch = ${(await git.branch([])).current};`,
    ].join("\n");
  },
});
