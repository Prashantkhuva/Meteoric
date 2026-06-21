"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { KPICard } from "./KPICard";
import { StatusBadge } from "./StatusBadge";
import { LeadsTrendChart } from "./LeadsTrendChart";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function DashboardClient({ stats, conversionRate, monthlyLeadData, userName }) {
  const [greeting, setGreeting] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
    setDateStr(`${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
  }, []);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">
            {greeting}, {userName || "Admin"}
          </h1>
          <p className="mt-1 text-sm text-white/35">{dateStr}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Total Leads" value={stats.totalLeads} subtext="All time" />
        <KPICard label="Inquiry" value={stats.inquiryLeads} subtext="New leads" />
        <KPICard label="Completed" value={stats.completedLeads} subtext="Delivered" />
        <KPICard label="Clients" value={stats.totalClients} subtext="Active accounts" accent />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LeadsTrendChart data={monthlyLeadData} />
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

function ConversionCard({ total, conversionRate }) {
  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-white/[0.10]">
      <p className="text-[11px] font-semibold tracking-wider text-white/35 uppercase mb-3">Conversion</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[30px] font-bold tracking-tight text-[#EAEFFF] tabular-nums">{conversionRate}%</span>
        <span className="text-xs text-white/35">rate</span>
      </div>
      <p className="mt-2 text-xs text-white/35">{total} client{total !== 1 ? "s" : ""}</p>
    </div>
  );
}

function QuickLinksCard() {
  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-white/[0.10]">
      <p className="text-[11px] font-semibold tracking-wider text-white/35 uppercase mb-3">Quick Actions</p>
      <div className="space-y-2">
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
