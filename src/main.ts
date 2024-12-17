import * as core from "@actions/core";
import {Octokit} from "@octokit/core";

const GITHUB_TOKEN = core.getInput("github-token") || process.env["GITHUB_TOKEN"];
const REPO = core.getInput("repo") || process.env["REPO"];
const EVENT_TYPE = core.getInput("event-type") || process.env["EVENT_TYPE"];
const REF = core.getInput("ref") || process.env["REF"];

async function run(): Promise<void> {
    if (!GITHUB_TOKEN) {
        core.error(`Input "GITHUB_TOKEN" not provided`);
        return;
    }

    if (!REPO) {
        core.error(`Input "REPO" not provided`);
        return;
    }

    if (!EVENT_TYPE) {
        core.error(`Input "EVENT_TYPE" not provided`);
        return;
    }

    if (!REF) {
        core.error(`Input "REF" not provided`);
        return;
    }

    const repoSplit = REPO.split("/");
    const repoOwner = repoSplit[0];
    const repoName = repoSplit[1];

    const octokit = new Octokit({auth: GITHUB_TOKEN});

    const response = await octokit.request("POST /repos/{owner}/{repo}/dispatches", {
        owner: repoOwner,
        repo: repoName,
        event_type: EVENT_TYPE,
        client_payload: {
            unit: false,
            integration: true,
            ref: REF
        },
        headers: {
            "X-GitHub-Api-Version": "2022-11-28"
        }
    });

    core.info(`${response}`);
}

run();
