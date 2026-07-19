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
    'currency', i.currency,
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
    ) else null end,
    'bank_account', case when b.id is not null then jsonb_build_object(
      'label', b.label,
      'bank_name', b.bank_name,
      'account_holder', b.account_holder,
      'account_number', b.account_number,
      'iban', b.iban,
      'swift_bic', b.swift_bic,
      'routing_number', b.routing_number,
      'ifsc', b.ifsc,
      'upi_id', b.upi_id,
      'currency', b.currency,
      'country', b.country
    ) else null end
  )
  from invoices i
  left join clients c on c.id = i.client_id
  left join bank_accounts b on b.id = i.bank_account_id
  where i.id = invoice_id and i.share_token = token;
$$;
