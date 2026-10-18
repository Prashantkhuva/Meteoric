# Decision Thresholds (Shadow Mode)

Design note for the AI lead-triage decision layer. **No automatic actions.**
Nothing in this document is wired to change lead data.

## What runs today (Phase 1, live 2026-10-17)

- Model: `typesafe/jev-1.13` (pinned, never a `latest` alias) via
  `POST https://openrouter.ai/api/alpha/decisions`.
- Trigger: lead **create AND update** paths (contact form, admin add/edit,
  status change, follow-up change, cal.com booking import), fire-and-forget
  after the HTTP response (`after()`), gated by `AI_DECISIONS_ENABLED`
  (local `true`, default `false`).
- Re-run guard: sha256 input-hash stored on each decision; identical input
  skips the provider call (no API spend, no duplicate row).
- Deterministic spam pre-filter (`src/lib/decisions/spam-rules.ts`):
  disposable domains, <20-char details without services/budget, link-only
  text, digit-heavy text, ad-pattern regex. Match → `source='rules'`,
  quality `spam`, no Jev call.
- Output stored in `public.decisions` (`result` jsonb + top-level
  `confidence`, `model`, `model_version`, `source`):
  - `quality`: `hot | warm | cold | spam`
  - `suggested_next_status`: subset of `VALID_LEAD_STATUSES`
  - `service_category`: `web | saas | mobile | other`
  - `result.probabilities` (full per-choice distribution), `result.runner_up`,
    `result.factors` (top-3 rule-based explainers), `result.usage_cost`
- Input state (`buildState`): name, email, phone, company, services, budget,
  timeline, details, source, current_status, follow_up_at/time/status/note.
- Status column stays `shadow`. The lead row is never modified.
- Live smoke (2026-10-17): hot SaaS lead → `hot/conf 1.0/saas/discovery`,
  cost ~$0.00003, model_version `typesafe/jev-1.13-20260917`, 1.1s.

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
Disagreements must carry a verdict reason
(`wrong_quality|wrong_status|wrong_category|spam_label_wrong|other`).

## Jev known weak spots

Per provider docs: arithmetic, date handling, distractor text, adversarial
input. Lead text is user-submitted — inputs are HTML-stripped,
control-char-stripped, and length-capped before the call, but prompt-injection
risk remains. Because output is stored (never executed/applied), worst case
today is a wrong badge.

## Accuracy workflow

1. Web: `/admin/decisions` — accuracy cards (total, reviewed, agreement %,
   avg confidence) + recent table with quality distribution bars, top-3
   factors, Jev/Rules source badge.
2. Review: Agree / Disagree (web: reason-code picker on Disagree; mobile:
   bottom-sheet reason list). Records `verdict`, `verdict_reason`,
   `reviewed_by`, `reviewed_at`.
3. Mobile: lead list shows a colored `AI <quality>` chip; detail screen shows
   the full decision + review buttons.

## Failure behavior

Provider errors (bad key, 4xx/429/5xx after retries, timeout, malformed
answer) are caught in `runDecisionForLead` — logged as `[decisions] skipped:`
and the request completes normally. Decision layer can be deleted without
touching lead creation code paths.

## Deploy checklist

- Supabase: migration `20261017000001_decision_phase1.sql` applied (2026-10-17).
- Local `.env` / `.env.local`: `AI_DECISIONS_ENABLED=true`,
  `DECISIONS_PROVIDER=jev`, `OPENROUTER_API` (or `_KEY`) set.
- **Vercel: set the same three env vars in the dashboard before deploy** —
  `.env.vercel` mirror does not carry them yet.

