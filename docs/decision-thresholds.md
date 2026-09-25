# Decision Thresholds (Shadow Mode)

Design note for the AI lead-triage decision layer. **No automatic actions.**
Nothing in this document is wired to change lead data today.

## What runs today

- Model: `typesafe/jev-1.13` (pinned, never a `latest` alias) via
  `POST https://openrouter.ai/api/alpha/decisions`.
- Trigger: every lead creation path (contact form, admin add, CSV import),
  fire-and-forget after the HTTP response (`after()`), gated by
  `AI_DECISIONS_ENABLED` (default `false`).
- Output: three typed answers stored in `public.decisions`
  (`result` jsonb + top-level `confidence`, `model`, `model_version`):
  - `quality`: `hot | warm | cold | spam`
  - `suggested_next_status`: subset of `VALID_LEAD_STATUSES`
  - `service_category`: `web | saas | mobile | other`
- Status column stays `shadow`. The lead row is never modified.

## Proposed thresholds (future — requires sign-off)

| Condition | Proposed effect | Status |
|---|---|---|
| `quality = spam` AND `confidence >= 0.95` | Auto-set lead status `lost`, skip notifications | NOT implemented |
| `quality = hot` AND `confidence >= 0.90` | Keep existing hot-lead email alert path | NOT implemented |
| `suggested_next_status` differs from lead status | Show suggestion chip only (already live on mobile detail) | Implemented as display-only |
| `confidence < 0.50` on any field | Exclude from accuracy stats weighting | NOT implemented |

The agreement rate on `/admin/decisions` is the gate: only consider
automation if reviewed decisions show sustained agreement (target: ≥ 90%
agreement over ≥ 50 reviewed decisions) and no spam misclassifications.

## Jev known weak spots

Per provider docs: arithmetic, date handling, distractor text, adversarial
input. Lead text is user-submitted — inputs are HTML-stripped,
control-char-stripped, and length-capped before the call, but prompt-injection
risk remains. Because output is stored (never executed/applied), worst case
today is a wrong badge.

## Accuracy workflow

1. Web: `/admin/decisions` — accuracy cards (total, reviewed, agreement %,
   avg confidence) + recent table.
2. Review: Agree / Disagree buttons (web table row, mobile lead detail).
   Records `verdict`, `reviewed_by`, `reviewed_at`.
3. Mobile: lead list shows a colored `AI <quality>` chip; detail screen shows
   the full decision + review buttons.

## Failure behavior

Provider errors (bad key, 4xx/429/5xx after retries, timeout, malformed
answer) are caught in `runDecisionForLead` — logged as `[decisions] skipped:`
and the request completes normally. Decision layer can be deleted without
touching lead creation code paths.
