import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldAlert,
  Award,
  Cpu,
  Trophy,
  ArrowUpRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { AdminSidebar } from '../components/AdminSidebar';
import { getAllRegistrations, calculateStats } from '../firebase/firestore';
import { Registration, DashboardStats } from '../types/registration';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatDate } from '../utils/csvExport';

export const Dashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    basic: 0,
    intermediate: 0,
    advanced: 0,
    wolfCTF: 0,
    wolfHackathons: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const data = await getAllRegistrations();
      setRegistrations(data);
      setStats(calculateStats(data));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Percentages for charts
  const basicPct = stats.total > 0 ? Math.round((stats.basic / stats.total) * 100) : 0;
  const interPct = stats.total > 0 ? Math.round((stats.intermediate / stats.total) * 100) : 0;
  const advPct = stats.total > 0 ? Math.round((stats.advanced / stats.total) * 100) : 0;

  const ctfPct = stats.total > 0 ? Math.round((stats.wolfCTF / stats.total) * 100) : 0;
  const hackPct = stats.total > 0 ? Math.round((stats.wolfHackathons / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Dashboard Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#2A2A2A]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF1A1A] animate-ping" />
              <h1 className="text-2xl sm:text-3xl font-display font-black tracking-wider text-white uppercase">
                SECURITY <span className="text-[#FF1A1A]">OPERATIONS DASHBOARD</span>
              </h1>
            </div>
            <p className="text-xs font-mono text-[#999999] mt-1">
              TVM HACKERS HUB • MEMBER ANALYTICS & REGISTRATION METRICS
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 bg-[#111111] hover:bg-[#181818] border border-[#2A2A2A] hover:border-[#FF1A1A] rounded text-xs font-mono text-[#E5E5E5] transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FF1A1A] ${refreshing ? 'animate-spin' : ''}`} />
              <span>SYNC DATA</span>
            </button>

            <Link
              to="/hacker/members"
              className="flex items-center gap-2 px-4 py-2 bg-[#FF1A1A] hover:bg-[#FF3333] text-white rounded font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_10px_rgba(255,26,26,0.4)]"
            >
              <Users className="w-3.5 h-3.5" />
              <span>VIEW ALL MEMBERS</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" text="LOADING METRICS & COMMUNITY INTEL..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Total Members */}
              <div className="bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A] rounded-lg p-4 transition-all hover:shadow-[0_0_15px_rgba(255,26,26,0.3)]">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#999999] mb-1">
                  TOTAL MEMBERS
                </p>
                <p className="text-3xl font-display font-black text-[#FF1A1A]">{stats.total}</p>
                <span className="text-[10px] font-mono text-[#666666] mt-1 block">Registered</span>
              </div>

              {/* Basic */}
              <div className="bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A] rounded-lg p-4 transition-all">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#999999] mb-1">
                  BASIC
                </p>
                <p className="text-3xl font-display font-black text-white">{stats.basic}</p>
                <span className="text-[10px] font-mono text-[#999999] mt-1 block">{basicPct}% of total</span>
              </div>

              {/* Intermediate */}
              <div className="bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A] rounded-lg p-4 transition-all">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#999999] mb-1">
                  INTERMEDIATE
                </p>
                <p className="text-3xl font-display font-black text-white">{stats.intermediate}</p>
                <span className="text-[10px] font-mono text-[#999999] mt-1 block">{interPct}% of total</span>
              </div>

              {/* Advanced */}
              <div className="bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A] rounded-lg p-4 transition-all">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#999999] mb-1">
                  ADVANCED
                </p>
                <p className="text-3xl font-display font-black text-white">{stats.advanced}</p>
                <span className="text-[10px] font-mono text-[#999999] mt-1 block">{advPct}% of total</span>
              </div>

              {/* Wolf CTF */}
              <div className="bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A] rounded-lg p-4 transition-all">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#999999] mb-1">
                  WOLF CTF
                </p>
                <p className="text-3xl font-display font-black text-[#FF1A1A]">{stats.wolfCTF}</p>
                <span className="text-[10px] font-mono text-[#999999] mt-1 block">{ctfPct}% played</span>
              </div>

              {/* Wolf Hackathons */}
              <div className="bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A] rounded-lg p-4 transition-all">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#999999] mb-1">
                  HACKATHONS
                </p>
                <p className="text-3xl font-display font-black text-[#FF1A1A]">{stats.wolfHackathons}</p>
                <span className="text-[10px] font-mono text-[#999999] mt-1 block">{hackPct}% attended</span>
              </div>
            </div>

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Level Distribution Chart */}
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-6">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#2A2A2A]">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#FF1A1A]" />
                    Hacking Skill Distribution
                  </h3>
                  <span className="text-[10px] font-mono text-[#999999]">{stats.total} total members</span>
                </div>

                <div className="space-y-5">
                  {/* Basic Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-white">Basic (Foundations)</span>
                      <span className="text-[#999999]">{stats.basic} ({basicPct}%)</span>
                    </div>
                    <div className="h-3 bg-[#080808] rounded-full overflow-hidden border border-[#2A2A2A]">
                      <div
                        className="h-full bg-white transition-all duration-500 rounded-full"
                        style={{ width: `${basicPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Intermediate Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-white">Intermediate (CTF / Scripting)</span>
                      <span className="text-[#999999]">{stats.intermediate} ({interPct}%)</span>
                    </div>
                    <div className="h-3 bg-[#080808] rounded-full overflow-hidden border border-[#2A2A2A]">
                      <div
                        className="h-full bg-[#8B0000] transition-all duration-500 rounded-full"
                        style={{ width: `${interPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Advanced Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-white">Advanced (Vulnerability / Exploit)</span>
                      <span className="text-[#FF1A1A] font-bold">{stats.advanced} ({advPct}%)</span>
                    </div>
                    <div className="h-3 bg-[#080808] rounded-full overflow-hidden border border-[#2A2A2A]">
                      <div
                        className="h-full bg-[#FF1A1A] shadow-[0_0_8px_#FF1A1A] transition-all duration-500 rounded-full"
                        style={{ width: `${advPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Participation Chart */}
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-6">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#2A2A2A]">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#FF1A1A]" />
                    Event Participation Breakdown
                  </h3>
                  <span className="text-[10px] font-mono text-[#999999]">Wolf Arena</span>
                </div>

                <div className="grid grid-cols-2 gap-4 h-44 items-end pt-4 pb-2 border-b border-[#2A2A2A]">
                  {/* Wolf CTF Column */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-mono font-bold text-[#FF1A1A]">{stats.wolfCTF}</span>
                    <div
                      className="w-16 bg-gradient-to-t from-[#8B0000] to-[#FF1A1A] rounded-t border border-[#FF1A1A] transition-all duration-500 shadow-[0_0_12px_rgba(255,26,26,0.3)]"
                      style={{ height: `${Math.max(ctfPct, 12)}%` }}
                    />
                    <span className="text-xs font-mono text-white">Wolf CTF ({ctfPct}%)</span>
                  </div>

                  {/* Wolf Hackathons Column */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-mono font-bold text-white">{stats.wolfHackathons}</span>
                    <div
                      className="w-16 bg-gradient-to-t from-[#2A2A2A] to-white rounded-t border border-white/50 transition-all duration-500"
                      style={{ height: `${Math.max(hackPct, 12)}%` }}
                    />
                    <span className="text-xs font-mono text-white">Hackathons ({hackPct}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-[#2A2A2A] flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FF1A1A]" />
                    Recent Member Registrations
                  </h3>
                  <p className="text-xs text-[#999999] mt-0.5 font-mono">Latest registrations received</p>
                </div>

                <Link
                  to="/hacker/members"
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#FF1A1A] hover:text-[#FF3333] transition-colors"
                >
                  <span>FULL DIRECTORY</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#080808] text-[#999999] uppercase tracking-wider border-b border-[#2A2A2A]">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Level</th>
                      <th className="py-3 px-4">CTF</th>
                      <th className="py-3 px-4">Hackathon</th>
                      <th className="py-3 px-4">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]">
                    {registrations.slice(0, 5).map((member) => (
                      <tr key={member.id} className="hover:bg-[#181818] transition-colors">
                        <td className="py-3.5 px-4 text-white font-bold">{member.name}</td>
                        <td className="py-3.5 px-4 text-[#999999]">{member.email}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              member.hackingLevel === 'advanced'
                                ? 'bg-[#FF1A1A]/20 text-[#FF1A1A] border border-[#FF1A1A]'
                                : member.hackingLevel === 'intermediate'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-white/10 text-white border border-white/20'
                            }`}
                          >
                            {member.hackingLevel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {member.attendedWolfCTF === 'yes' ? (
                            <span className="text-[#22C55E] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> YES
                            </span>
                          ) : (
                            <span className="text-[#666666]">NO</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {member.attendedWolfHackathons === 'yes' ? (
                            <span className="text-[#22C55E] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> YES
                            </span>
                          ) : (
                            <span className="text-[#666666]">NO</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#999999] whitespace-nowrap">
                          {formatDate(member.createdAt)}
                        </td>
                      </tr>
                    ))}
                    {registrations.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#666666]">
                          No member registrations recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
