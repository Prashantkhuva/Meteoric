"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, AlertTriangle } from "lucide-react";
import { KPICard } from "./KPICard";
import { StatusBadge } from "./StatusBadge";
import { LeadsTrendChart } from "./LeadsTrendChart";
import { RevenueTrendChart } from "./RevenueTrendChart";
import { LeadFormModal } from "./LeadFormModal";
import { useToast } from "./ToastContext";
import { addLead } from "../actions";
import { formatShort } from "@/lib/supabase/admin";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function DashboardClient({ stats, conversionRate, monthlyLeadData, monthlyRevenue, userName, invoiceOutstanding, invoiceRevenue, overdueCount, invoiceCount, leadsMomChange, revenueMomChange, clientsMom, recentClients, overdueInvoices, recentInvoices, projectStats }) {
  const now = new Date();
  const hour = now.getHours();
  const [greeting] = useState(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
  const [dateStr] = useState(`${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
  const [showAddLead, setShowAddLead] = useState(false);
  const addToast = useToast();

  async function handleAddLead(formData) {
    const result = await addLead(formData);
    if (result?.error) {
      addToast(result.error, "error");
      return;
    }
    setShowAddLead(false);
    addToast("Lead added", "success");
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">
            {greeting}, {userName || "Admin"}
          </h1>
          <p className="mt-1 text-sm text-white/35">{dateStr}</p>
        </div>
        <button
          onClick={() => setShowAddLead(true)}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <Plus size={15} />
          Add Lead
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Total Leads" value={stats.totalLeads} subtext="All time" trend={leadsMomChange != null ? Math.round(leadsMomChange * 10) / 10 : undefined} />
        <KPICard label="Clients" value={stats.totalClients} subtext={clientsMom != null && clientsMom !== 0 ? `${clientsMom >= 0 ? "+" : ""}${clientsMom} this month` : "Active accounts"} />
        <KPICard label="Revenue" value={`$${invoiceRevenue.toFixed(0)}`} subtext="Paid invoices" accent trend={revenueMomChange != null ? Math.round(revenueMomChange * 10) / 10 : undefined} />
        <KPICard label="Outstanding" value={`$${invoiceOutstanding.toFixed(0)}`} subtext={`${overdueCount} overdue of ${invoiceCount} invoices`} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Total Projects" value={projectStats?.total || 0} subtext="All time" />
        <KPICard label="Active" value={projectStats?.active || 0} subtext="In progress" />
        <KPICard label="Completed" value={projectStats?.completed || 0} subtext="Done" />
        <KPICard label="On Hold" value={projectStats?.onHold || 0} subtext="Paused" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <LeadsTrendChart data={monthlyLeadData} />
          <RevenueTrendChart data={monthlyRevenue} />
        </div>
        <div className="space-y-6">
          <ConversionCard total={stats.totalClients} conversionRate={conversionRate} funnel={stats} />
          <OverdueCard invoices={overdueInvoices} count={overdueCount} />
          <QuickLinksCard onAddLead={() => setShowAddLead(true)} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RecentLeadsTable leads={stats.recentLeads} />
        <RecentClientsTable clients={recentClients} />
      </div>

      <div className="mt-6">
        <RecentInvoicesTable invoices={recentInvoices} />
      </div>

      <LeadFormModal open={showAddLead} lead={null} onClose={() => setShowAddLead(false)} onSubmit={handleAddLead} />
    </div>
  );
}

function ConversionCard({ total, conversionRate, funnel }) {
  const stages = [
    { key: "inquiry", label: "Inquiry", value: funnel?.inquiryLeads || 0 },
    { key: "discovery", label: "Discovery", value: funnel?.discoveryLeads || 0 },
    { key: "proposal", label: "Proposal", value: funnel?.proposalLeads || 0 },
    { key: "in_progress", label: "In Progress", value: funnel?.inProgressLeads || 0 },
    { key: "completed", label: "Completed", value: funnel?.completedLeads || 0 },
  ];
  const max = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-white/[0.10]">
      <p className="text-[11px] font-semibold tracking-wider text-white/35 uppercase mb-3">Conversion</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[30px] font-bold tracking-tight text-[#EAEFFF] tabular-nums">{conversionRate}%</span>
        <span className="text-xs text-white/35">rate</span>
      </div>
      <p className="mt-2 text-xs text-white/35">{total} client{total !== 1 ? "s" : ""}</p>
      <div className="mt-4 space-y-2.5">
        {stages.map((s) => (
          <div key={s.key}>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-white/40">{s.label}</span>
              <span className="text-white/70 tabular-nums">{s.value}</span>
            </div>
            <div className="h-1.5 bg-white/[0.04]">
              <div
                className="h-full bg-[#EAEFFF]/50 transition-all duration-500"
                style={{ width: `${(s.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverdueCard({ invoices, count }) {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="border border-white/[0.06] bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-white/[0.10]">
        <p className="text-[11px] font-semibold tracking-wider text-white/35 uppercase mb-3">Overdue Invoices</p>
        <p className="text-sm text-white/25">No overdue invoices — all clear</p>
      </div>
    );
  }
  return (
    <div className="border border-red-500/15 bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-red-500/25">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold tracking-wider text-red-400/70 uppercase">Overdue Invoices</p>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-red-400 tabular-nums">
          <AlertTriangle size={11} />
          {count}
        </span>
      </div>
      <div className="space-y-2.5">
        {invoices.map((inv) => (
          <Link
            key={inv.id}
            href="/admin/invoices"
            className="group flex items-center justify-between gap-2 border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 transition-all hover:border-red-500/20 hover:bg-red-500/[0.03]"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/70 truncate">{inv.client?.name || "Unknown client"}</p>
              <p className="text-[10px] text-white/30 tabular-nums mt-0.5">
                {inv.invoice_number} · due {formatShort(inv.due_date)}
              </p>
            </div>
            <span className="text-xs font-semibold text-red-400/90 tabular-nums shrink-0">
              {inv.currency || "USD"} {Number(inv.total).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function QuickLinksCard({ onAddLead }) {
  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-white/[0.10]">
      <p className="text-[11px] font-semibold tracking-wider text-white/35 uppercase mb-3">Quick Actions</p>
      <div className="space-y-2">
        <button
          onClick={onAddLead}
          className="group flex w-full items-center justify-between border border-[#EAEFFF]/15 bg-[#EAEFFF]/5 px-3.5 py-2.5 text-xs text-[#EAEFFF]/70 transition-all hover:border-[#EAEFFF]/30 hover:text-[#EAEFFF]"
        >
          Add new lead
          <Plus size={12} className="text-[#EAEFFF]/25 group-hover:text-[#EAEFFF]/40 transition-colors" />
        </button>
        <Link
          href="/admin/leads"
          className="group flex items-center justify-between border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-xs text-white/45 transition-all hover:border-white/[0.10] hover:text-white/70"
        >
          View all leads
          <ArrowRight size={12} className="text-white/25 group-hover:text-white/40 transition-colors" />
        </Link>
        <Link
          href="/admin/clients"
          className="group flex items-center justify-between border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-xs text-white/45 transition-all hover:border-white/[0.10] hover:text-white/70"
        >
          Manage clients
          <ArrowRight size={12} className="text-white/25 group-hover:text-white/40 transition-colors" />
        </Link>
        <Link
          href="/admin/invoices"
          className="group flex items-center justify-between border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-xs text-white/45 transition-all hover:border-white/[0.10] hover:text-white/70"
        >
          View invoices
          <ArrowRight size={12} className="text-white/25 group-hover:text-white/40 transition-colors" />
        </Link>
        <Link
          href="/admin/projects"
          className="group flex items-center justify-between border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-xs text-white/45 transition-all hover:border-white/[0.10] hover:text-white/70"
        >
          View projects
          <ArrowRight size={12} className="text-white/25 group-hover:text-white/40 transition-colors" />
        </Link>
      </div>
    </div>
  );
}

function RecentLeadsTable({ leads }) {
  if (!leads || leads.length === 0) return null;

  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <h3 className="text-xs font-semibold tracking-tight text-white/70">Recent Leads</h3>
        <Link href="/admin/leads" className="text-[11px] text-white/35 hover:text-white/50 transition-colors">
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Name</th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Status</th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
                <td className="px-5 py-3">
                  <span className="text-xs text-white/60">{lead.name || lead.email || "\u2014"}</span>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-5 py-3 text-[10px] text-white/35 tabular-nums">
                  {lead.created_at
                    ? new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "\u2014"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecentClientsTable({ clients }) {
  if (!clients || clients.length === 0) return null;

  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <h3 className="text-xs font-semibold tracking-tight text-white/70">Recent Clients</h3>
        <Link href="/admin/clients" className="text-[11px] text-white/35 hover:text-white/50 transition-colors">
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Name</th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Company</th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Date</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
                <td className="px-5 py-3">
                  <span className="text-xs text-white/60">{client.name || client.email || "\u2014"}</span>
                </td>
                <td className="px-5 py-3 text-xs text-white/35">{client.company || "\u2014"}</td>
                <td className="px-5 py-3 text-[10px] text-white/35 tabular-nums">
                  {client.created_at
                    ? new Date(client.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "\u2014"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecentInvoicesTable({ invoices }) {
  if (!invoices || invoices.length === 0) return null;

  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <h3 className="text-xs font-semibold tracking-tight text-white/70">Recent Invoices</h3>
        <Link href="/admin/invoices" className="text-[11px] text-white/35 hover:text-white/50 transition-colors">
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Invoice</th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Client</th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Amount</th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
                <td className="px-5 py-3 text-xs text-white/60 tabular-nums">{inv.invoice_number}</td>
                <td className="px-5 py-3 text-xs text-white/45">{inv.client?.name || "\u2014"}</td>
                <td className="px-5 py-3 text-xs text-white/60 tabular-nums">
                  {inv.currency || "USD"} {Number(inv.total).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={inv.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}