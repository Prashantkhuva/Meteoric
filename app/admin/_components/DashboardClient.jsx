"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getStatus } from "@/lib/admin";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getGreeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

function getDateStr() {
  const now = new Date();
  return `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

export default function DashboardClient({ stats, conversionRate }) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">
            {getGreeting()}, Prashant
          </h1>
          <p className="mt-1 text-sm text-white/35">{getDateStr()}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Leads" value={stats.totalLeads} subtext="All time" />
        <KpiCard label="New" value={stats.newLeads} subtext="Awaiting contact" />
        <KpiCard label="Won" value={stats.wonLeads} subtext="Converted" />
        <KpiCard label="Clients" value={stats.totalClients} subtext="Active accounts" accent />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PipelineFunnel
            counts={{
              new: stats.newLeads,
              contacted: stats.contactedLeads,
              qualified: stats.qualifiedLeads,
              proposal: stats.proposalLeads,
              won: stats.wonLeads,
              lost: stats.lostLeads,
            }}
            total={stats.totalLeads}
          />
        </div>
        <div className="space-y-6">
          <ConversionCard total={stats.totalClients} conversionRate={conversionRate} />
          <QuickLinksCard />
        </div>
      </div>

      <div className="mt-6">
        <RecentLeadsTable leads={stats.recentLeads} />
      </div>
    </div>
  );
}

function KpiCard({ label, value, subtext, accent }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-white/[0.10]">
      <div className="flex items-center gap-2 mb-2">
        {accent && <span className="h-1.5 w-1.5 rounded-full bg-[#EAEFFF]" />}
        <p className="text-[11px] font-semibold tracking-wider text-white/35 uppercase">{label}</p>
      </div>
      <p className="text-[30px] font-bold tracking-tight text-white tabular-nums leading-none">{value}</p>
      {subtext && <p className="mt-2 text-xs text-white/25">{subtext}</p>}
    </div>
  );
}

function ConversionCard({ total, conversionRate }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-white/[0.10]">
      <p className="text-[11px] font-semibold tracking-wider text-white/35 uppercase mb-3">Conversion</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[30px] font-bold tracking-tight text-[#EAEFFF] tabular-nums">{conversionRate}%</span>
        <span className="text-xs text-white/25">rate</span>
      </div>
      <p className="mt-2 text-xs text-white/25">{total} client{total !== 1 ? "s" : ""}</p>
    </div>
  );
}

function QuickLinksCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-white/[0.10]">
      <p className="text-[11px] font-semibold tracking-wider text-white/35 uppercase mb-3">Quick Actions</p>
      <div className="space-y-2">
        <Link
          href="/admin/leads"
          className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-xs text-white/45 transition-all hover:border-white/[0.10] hover:text-white/70"
        >
          View all leads
          <ArrowRight size={12} className="text-white/20 group-hover:text-white/40 transition-colors" aria-hidden="true" />
        </Link>
        <Link
          href="/admin/clients"
          className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-xs text-white/45 transition-all hover:border-white/[0.10] hover:text-white/70"
        >
          Manage clients
          <ArrowRight size={12} className="text-white/20 group-hover:text-white/40 transition-colors" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function RecentLeadsTable({ leads }) {
  if (!leads || leads.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <h3 className="text-xs font-semibold tracking-tight text-white/70">Recent Leads</h3>
        <Link href="/admin/leads" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">
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
            {leads.map((lead) => {
              const st = getStatus(lead.status);
              return (
                <tr key={lead.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.015] last:border-0">
                  <td className="px-5 py-3">
                    <span className="text-xs text-white/60">{lead.name || lead.email || "\u2014"}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium"
                      style={{ color: st.color, borderColor: st.border, background: st.bg }}
                    >
                      <span className="h-1 w-1 rounded-full" style={{ background: st.color }} />
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[10px] text-white/25 tabular-nums">
                    {lead.created_at
                      ? new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "\u2014"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PipelineFunnel({ counts, total }) {
  const stages = [
    { key: "new", label: "New" },
    { key: "contacted", label: "Contacted" },
    { key: "qualified", label: "Qualified" },
    { key: "proposal", label: "Proposal" },
    { key: "won", label: "Won" },
    { key: "lost", label: "Lost" },
  ];

  if (!total || total === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6">
        <h2 className="text-sm font-semibold tracking-tight text-white">Pipeline Funnel</h2>
        <p className="mt-1 text-xs text-white/30">Lead progression by stage</p>
        <div className="flex items-center justify-center h-40 text-white/15 text-sm mt-4">
          No lead data yet
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...stages.map((s) => counts[s.key] || 0), 1);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold tracking-tight text-white">Pipeline Funnel</h2>
        <span className="text-xs text-white/30 tabular-nums">{total} total</span>
      </div>
      <p className="text-xs text-white/30 mb-6">Lead progression by stage</p>

      <div className="space-y-2">
        {stages.map((stage) => {
          const count = counts[stage.key] || 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          const barWidth = count > 0 ? Math.max((count / maxCount) * 100, 4) : 0;
          return (
            <div key={stage.key} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/50">
                  {stage.label}
                </span>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="text-sm font-medium text-white/80">{count}</span>
                  <span className="text-xs text-white/30 w-8 text-right">{pct.toFixed(0)}%</span>
                </div>
              </div>
              <div className="relative h-6 rounded-lg bg-white/[0.03] overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all duration-700"
                  style={{ width: `${barWidth}%`, background: `linear-gradient(90deg, rgba(234,239,255,0.15), rgba(234,239,255,0.08))` }}
                />
                {count > 0 && (
                  <span className="absolute inset-0 flex items-center px-2.5 text-xs text-white/50 tabular-nums">
                    {count} lead{count !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
