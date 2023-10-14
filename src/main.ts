import * as core from "@actions/core";
import { Octokit } from "@octokit/core";

const GITHUB_TOKEN = core.getInput("github-token") || process.env["GITHUB_TOKEN"];
const OWNER = core.getInput("owner") || process.env["OWNER"];
const REPO = core.getInput("repo") || process.env["REPO"];
const EVENT_TYPE = core.getInput("event-type") || process.env["EVENT_TYPE"];


function shortCommitSha(sha: string) {
  return sha.substring(0, 7);
}

async function run(): Promise<void> {
  if (!GITHUB_TOKEN) {
    core.error(`Input "GITHUB_TOKEN" not provided`);
    return;
  }

  if (!OWNER) {
    core.error(`Input "OWNER" not provided`);
    return;
  }

  if (!REPO) {
    core.error(`Input "NIGHTLY_REPO" not provided`);
    return;
  }

  if (!EVENT_TYPE) {
    core.error(`Input "EVENT_TYPE" not provided`);
    return;
  }


  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  const response = await octokit.request("POST /repos/{owner}/{repo}/dispatches", {
    owner: OWNER,
    repo: REPO,
    event_type: EVENT_TYPE,
    client_payload: {
      unit: false,
      integration: true
    },
    headers: {
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  core.info(`${response}`);
}

run();
