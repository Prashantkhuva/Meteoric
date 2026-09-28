create or replace function get_proposal_with_lead(proposal_id bigint, token text)
returns jsonb
language sql
security definer
as $$
  select jsonb_build_object(
    'id', p.id,
    'title', p.title,
    'status', p.status,
    'content', p.content,
    'pricing', p.pricing,
    'currency', p.currency,
    'timeline', p.timeline,
    'terms', p.terms,
    'sent_at', p.sent_at,
    'created_at', p.created_at,
    'updated_at', p.updated_at,
    'share_token', p.share_token,
    'lead', case when l.id is not null then jsonb_build_object(
      'name', l.name,
      'email', l.email,
      'phone', l.phone
    ) else null end
  )
  from proposals p
  left join leads l on l.id = p.lead_id
  where p.id = proposal_id and p.share_token = token;
$$;

grant execute on function get_proposal_with_lead to anon;
