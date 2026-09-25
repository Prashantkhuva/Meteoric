import { authGuard, denyUnless, fail } from "../_lib/helpers";

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_TEAM_ID = process.env.LINEAR_TEAM_ID;

async function createLinearIssue({ title, description, label }) {
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
      labelIds: label ? [label] : undefined,
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

  // Create label on first team
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

  const { error, stack, screen, version, patch, platform, osVersion, fatal } =
    body || {};

  if (!error) return fail("Missing error field");

  try {
    const shortError =
      error.length > 80 ? error.substring(0, 77) + "..." : error;

    const description = [
      "## Error",
      error,
      "",
      "## Screen",
      screen || "unknown",
      "",
      "## Stack Trace",
      "```",
      stack || "no stack trace",
      "```",
      "",
      "## Device",
      `- Platform: ${platform || "unknown"}`,
      `- OS: ${osVersion || "unknown"}`,
      `- App: v${version || "?"} (patch ${patch ?? 0})`,
      `- Fatal: ${fatal ? "yes" : "no"}`,
      "",
      ` Reported by ${auth.user.email} at ${new Date().toISOString()}`,
    ].join("\n");

    // Find or create the "mobile" label
    const mobileLabelId = await findOrCreateLabel("mobile");
    const autoLabelId = await findOrCreateLabel("auto-reported");

    const labelIds = [mobileLabelId, autoLabelId].filter(Boolean);

    const issue = await createLinearIssue({
      title: `[Mobile] ${shortError}`,
      description,
      label: undefined,
    });

    // Attach labels separately if we have them
    if (issue?.id && labelIds.length > 0) {
      const labelMutation = `
        mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
          issueUpdate(id: $id, input: $input) { success }
        }
      `;
      await fetch("https://api.linear.app/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: LINEAR_API_KEY,
        },
        body: JSON.stringify({
          query: labelMutation,
          variables: {
            id: issue.id,
            input: {
              labelIds,
            },
          },
        }),
      });
    }

    return Response.json({
      success: true,
      issue: issue
        ? { id: issue.id, url: issue.url, identifier: issue.identifier }
        : null,
    });
  } catch (err) {
    return fail(err.message || "Failed to create Linear issue", 500);
  }
}
