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

create or replace function get_invoice_with_client(invoice_id bigint, token text)
returns jsonb
language sql
security definer
as $$
  select jsonb_build_object(
    'id', i.id,
    'invoice_number', i.invoice_number,
    'status', i.status,
    'items', i.items,
    'subtotal', i.subtotal,
    'tax', i.tax,
    'total', i.total,
    'notes', i.notes,
    'terms', i.terms,
    'due_date', i.due_date,
    'sent_at', i.sent_at,
    'paid_at', i.paid_at,
    'created_at', i.created_at,
    'updated_at', i.updated_at,
    'share_token', i.share_token,
    'client', case when c.id is not null then jsonb_build_object(
      'name', c.name,
      'email', c.email,
      'company', c.company,
      'phone', c.phone
    ) else null end
  )
  from invoices i
  left join clients c on c.id = i.client_id
  where i.id = invoice_id and i.share_token = token;
$$;

grant execute on function get_proposal_with_lead to anon;
grant execute on function get_invoice_with_client to anon;
