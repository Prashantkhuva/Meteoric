export interface Lead {
  id?: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  services?: string | null;
  budget?: string | null;
  details?: string | null;
  source?: string | null;
  status?: string | null;
  ai_score?: number | null;
  ai_category?: string | null;
  ai_summary?: string | null;
}

export interface Client {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  status?: string;
}

export interface BankAccount {
  bank_name?: string | null;
  account_holder?: string | null;
  account_number?: string | null;
  iban?: string | null;
  swift_bic?: string | null;
  routing_number?: string | null;
  ifsc?: string | null;
  currency?: string | null;
  country?: string | null;
  upi_id?: string | null;
}

export interface InvoiceItem {
  description?: string | null;
  quantity?: number | string | null;
  rate?: number | string | null;
}

export interface PricingRow {
  description?: string | null;
  quantity?: number | string | null;
  rate?: number | string | null;
  amount?: number | string | null;
}

export interface NodeAttrs {
  level?: number;
  href?: string;
  [key: string]: unknown;
}

export interface ContentMark {
  type?: string;
  attrs?: NodeAttrs;
}

export interface ContentNode {
  type?: string;
  text?: string | null;
  attrs?: NodeAttrs;
  content?: ContentNode[];
  marks?: ContentMark[];
}

export interface ProposalContent {
  type?: string;
  content?: ContentNode[];
}

export interface Proposal {
  id?: number;
  title: string;
  status: string;
  currency: string;
  timeline?: string | null;
  terms?: string | null;
  pricing?: string | PricingRow[] | null;
  content?: ProposalContent | string | null;
  created_at?: string | null;
  sent_at?: string | null;
  share_token?: string | null;
}

export interface Invoice {
  id?: number;
  invoice_number: string;
  client?: Client | null;
  status: string;
  currency: string;
  subtotal?: number | string;
  tax?: number | string;
  total: number | string;
  items?: InvoiceItem[] | null;
  notes?: string | null;
  terms?: string | null;
  due_date?: string | null;
  paid_at?: string | null;
  created_at?: string | null;
  share_token?: string | null;
  bank_account?: BankAccount | null;
}
