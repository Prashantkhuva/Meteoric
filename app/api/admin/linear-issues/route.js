import { authGuard, fail } from "../_lib/helpers";

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_TEAM_ID = process.env.LINEAR_TEAM_ID;

async function linearQuery(query, variables) {
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: LINEAR_API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || "Linear API error");
  }
  return json.data;
}

async function listIssues({ status, assignee, search, limit = 50, after }) {
  const filters = [{ team: { id: { eq: LINEAR_TEAM_ID } } }];
  if (status && status !== "all") {
    filters.push({ state: { name: { eq: status } } });
  }
  if (assignee && assignee !== "all") {
    if (assignee === "unassigned") {
      filters.push({ assignee: { is: { eq: null } } });
    } else {
      filters.push({ assignee: { displayName: { eq: assignee } } });
    }
  }
  if (search?.trim()) {
    filters.push({ title: { contains: search.trim() } });
  }

  const query = `
    query Issues($filter: IssueFilter, $first: Int, $after: String) {
      issues(filter: { and: $filter }, first: $first, after: $after, orderBy: createdAt) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id identifier title url priority estimate
          state { name color }
          assignee { displayName avatarUrl }
          labels { nodes { name } }
          createdAt updatedAt
        }
      }
    }
  `;

  const data = await linearQuery(query, {
    filter: filters.length === 1 ? filters[0] : { and: filters },
    first: limit,
    after: after || null,
  });

  const issues = data.issues.nodes.map((n) => ({
    id: n.id,
    identifier: n.identifier,
    title: n.title,
    url: n.url,
    priority: n.priority,
    estimate: n.estimate,
    state: n.state.name,
    stateColor: n.state.color,
    assignee: n.assignee?.displayName || null,
    assigneeAvatar: n.assignee?.avatarUrl || null,
    labels: n.labels.nodes.map((l) => l.name),
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  }));

  return {
    issues,
    hasNextPage: data.issues.pageInfo.hasNextPage,
    endCursor: data.issues.pageInfo.endCursor,
  };
}

async function updateIssue({ issueId, title, stateId, assigneeId, priority, comment }) {
  const updates = {};
  if (title) updates.title = title;
  if (stateId) updates.stateId = stateId;
  if (assigneeId !== undefined) updates.assigneeId = assigneeId || null;
  if (priority !== undefined) updates.priority = priority;

  const mutation = `
    mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) {
        success
        issue { id identifier title url state { name color } assignee { displayName } }
      }
    }
  `;

  const data = await linearQuery(mutation, {
    id: issueId,
    input: updates,
  });

  const issue = data.issueUpdate?.issue;

  if (comment?.trim() && issue) {
    const commentMutation = `
      mutation CommentCreate($input: CommentCreateInput!) {
        commentCreate(input: $input) { success comment { id } }
      }
    `;
    await linearQuery(commentMutation, {
      input: { body: comment, issueId },
    });
  }

  return issue;
}

async function getIssueStates() {
  const query = `
    query TeamStates($teamId: String!) {
      workflowStates(filter: { team: { id: { eq: $teamId } }, type: { eq: "unstarted" } }) {
        nodes { id name color }
      }
    }
  `;
  const data = await linearQuery(query, { teamId: LINEAR_TEAM_ID });
  return data.workflowStates.nodes;
}

export async function GET(request) {
  if (!LINEAR_API_KEY) return fail("Linear not configured", 500);

  const auth = await authGuard(request);
  if (!auth) return fail("Unauthorized", 401);

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "all";
    const assignee = url.searchParams.get("assignee") || "all";
    const search = url.searchParams.get("search") || "";
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const after = url.searchParams.get("after");

    const result = await listIssues({ status, assignee, search, limit, after });
    const states = await getIssueStates();

    return Response.json({
      success: true,
      ...result,
      states,
    });
  } catch (err) {
    return fail(err.message || "Failed to fetch issues", 500);
  }
}

export async function PATCH(request) {
  if (!LINEAR_API_KEY) return fail("Linear not configured", 500);

  const auth = await authGuard(request);
  if (!auth) return fail("Unauthorized", 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const { issueId, title, stateId, assigneeId, priority, comment } = body || {};
  if (!issueId) return fail("Missing issueId");

  try {
    const issue = await updateIssue({
      issueId,
      title,
      stateId,
      assigneeId,
      priority,
      comment,
    });
    return Response.json({ success: true, issue });
  } catch (err) {
    return fail(err.message || "Failed to update issue", 500);
  }
}
