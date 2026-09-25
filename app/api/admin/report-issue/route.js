import { authGuard, denyUnless, fail } from "../_lib/helpers";

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_TEAM_ID = process.env.LINEAR_TEAM_ID;

async function createLinearIssue({ title, description, labelIds }) {
  const mutation = `
    mutation IssueCreate($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue { id identifier url }
      }
    }
  `;

  const variables = {
    input: {
      title,
      description,
      teamId: LINEAR_TEAM_ID,
      labelIds: labelIds?.length ? labelIds : undefined,
    },
  };

  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: LINEAR_API_KEY,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || "Linear API error");
  }
  return json.data?.issueCreate?.issue;
}

async function findOrCreateLabel(name) {
  const query = `
    query { teams { nodes { id labels { nodes { id name } } } } }
  `;
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: LINEAR_API_KEY,
    },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  const teams = json.data?.teams?.nodes || [];
  for (const team of teams) {
    const label = team.labels?.nodes?.find((l) => l.name === name);
    if (label) return label.id;
  }

  const teamId = teams[0]?.id;
  if (!teamId) return null;

  const createMutation = `
    mutation IssueLabelCreate($input: IssueLabelCreateInput!) {
      issueLabelCreate(input: $input) { success issueLabel { id } }
    }
  `;
  const createRes = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: LINEAR_API_KEY,
    },
    body: JSON.stringify({
      query: createMutation,
      variables: { input: { name, teamId } },
    }),
  });
  const createJson = await createRes.json();
  return createJson.data?.issueLabelCreate?.issueLabel?.id || null;
}

export async function POST(request) {
  if (!LINEAR_API_KEY) return fail("Linear not configured", 500);

  const auth = await authGuard(request);
  if (!auth) return fail("Unauthorized", 401);
  const denied = await denyUnless(auth, "report");
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const { issueType, title, description, version, patch, platform, osVersion } =
    body || {};

  if (!title?.trim()) return fail("Missing title");
  if (!description?.trim()) return fail("Missing description");

  try {
    const shortTitle = title.length > 80 ? title.substring(0, 77) + "..." : title;

    const prefix =
      issueType === "bug"
        ? "[Bug]"
        : issueType === "suggestion"
          ? "[Suggestion]"
          : "[Feedback]";

    const descriptionMd = [
      "## Description",
      description,
      "",
      "## Type",
      issueType || "unknown",
      "",
      "## Device",
      `- Platform: ${platform || "unknown"}`,
      `- OS: ${osVersion || "unknown"}`,
      `- App: v${version || "?"} (patch ${patch ?? 0})`,
      "",
      ` Reported by ${auth.user.email} at ${new Date().toISOString()}`,
    ].join("\n");

    const mobileLabelId = await findOrCreateLabel("mobile");
    const userLabelId = await findOrCreateLabel("user-reported");
    const typeLabelId = await findOrCreateLabel(issueType || "feedback");
    const labelIds = [mobileLabelId, userLabelId, typeLabelId].filter(Boolean);

    const issue = await createLinearIssue({
      title: `[Mobile] ${prefix} ${shortTitle}`,
      description: descriptionMd,
      labelIds,
    });

    return Response.json({
      success: true,
      issue: issue
        ? { id: issue.id, url: issue.url, identifier: issue.identifier }
        : null,
    });
  } catch (err) {
    return fail(err.message || "Failed to create issue", 500);
  }
}
