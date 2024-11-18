"use server";

// import { octokit } from "@/lib/octokit-client";

export async function GetTotalCommits() {
  try {
    // const res = await octokit.request("GET /search/commits?q=author:mixin27");
    const response = await fetch(
      "https://api.github.com/search/commits?q=author:mixin27",
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    const data = JSON.parse(await response.text());
    const totalCount: number | null = data.total_count as number;
    return totalCount ?? 0;
  } catch (error) {
    return 0;
  }
}
