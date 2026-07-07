import {
  debug, error, getInput, setFailed,
} from '@actions/core';
import { context, getOctokit } from '@actions/github';

class PullRequestChecker {
  constructor(repoToken) {
    this.client = getOctokit(repoToken);
  }

  async process() {
    const commits = await this.client.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/commits',
      {
        ...context.repo,
        pull_number: context.issue.number,
      },
    );

    debug(`${commits.data.length} commit(s) in the pull request`);

    let blockedCommits = 0;
    commits.data.forEach(({ commit: { message }, sha, url }) => {
      const isAutosquash = message.startsWith('fixup!') || message.startsWith('squash!');

      if (isAutosquash) {
        error(`Commit ${sha} is an autosquash commit: ${url}`);

        blockedCommits += 1;
      }
    });

    if (blockedCommits) {
      throw Error(`${blockedCommits} commit(s) need to be squashed`);
    }
  }
}

async function run() {
  try {
    await new PullRequestChecker(getInput('repo-token', { required: true })).process();
  } catch (err) {
    setFailed(err.message);
  }
}

// noinspection JSIgnoredPromiseFromCall
run();
