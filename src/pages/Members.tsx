import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Download,
  Eye,
  Trash2,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { AdminSidebar } from '../components/AdminSidebar';
import { getAllRegistrations, deleteRegistration } from '../firebase/firestore';
import { Registration, FilterState } from '../types/registration';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { formatDate, exportMembersToCSV } from '../utils/csvExport';

export const Members: React.FC = () => {
  const [members, setMembers] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    level: 'all',
    ctf: 'all',
    hackathon: 'all',
  });

  // Modal State
  const [viewingMember, setViewingMember] = useState<Registration | null>(null);
  const [deletingMember, setDeletingMember] = useState<Registration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMembers = async () => {
    try {
      setRefreshing(true);
      const data = await getAllRegistrations();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter & Search Logic (Works together)
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // 1. Search (name, email, mobile)
      if (filters.search.trim()) {
        const query = filters.search.trim().toLowerCase();
        const matchesName = m.name?.toLowerCase().includes(query);
        const matchesEmail = m.email?.toLowerCase().includes(query);
        const matchesMobile = m.mobile?.includes(query);
        if (!matchesName && !matchesEmail && !matchesMobile) return false;
      }

      // 2. Level filter
      if (filters.level !== 'all' && m.hackingLevel !== filters.level) {
        return false;
      }

      // 3. Wolf CTF filter
      if (filters.ctf !== 'all' && m.attendedWolfCTF !== filters.ctf) {
        return false;
      }

      // 4. Wolf Hackathons filter
      if (filters.hackathon !== 'all' && m.attendedWolfHackathons !== filters.hackathon) {
        return false;
      }

      return true;
    });
  }, [members, filters]);

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingMember?.id) return;
    setIsDeleting(true);
    try {
      await deleteRegistration(deletingMember.id);
      setMembers((prev) => prev.filter((m) => m.id !== deletingMember.id));
      setDeletingMember(null);
    } catch (err) {
      console.error('Failed to delete member:', err);
      alert('Failed to delete member. Please verify authorization.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    exportMembersToCSV(filteredMembers, `tvm_hackers_hub_members_${Date.now()}.csv`);
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col lg:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#2A2A2A]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-wider text-white uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF1A1A] animate-ping" />
              MEMBER <span className="text-[#FF1A1A]">MANAGEMENT</span>
            </h1>
            <p className="text-xs font-mono text-[#999999] mt-1">
              SEARCH, AUDIT, FILTER AND EXPORT REGISTERED COMMUNITY OPERATIVES
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchMembers}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2.5 bg-[#111111] hover:bg-[#181818] border border-[#2A2A2A] hover:border-[#FF1A1A] rounded text-xs font-mono text-[#E5E5E5] transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FF1A1A] ${refreshing ? 'animate-spin' : ''}`} />
              <span>SYNC</span>
            </button>

            <button
              onClick={handleExport}
              disabled={filteredMembers.length === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[#111111] hover:bg-[#181818] border border-[#FF1A1A] text-white hover:text-[#FF1A1A] font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_10px_rgba(255,26,26,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5 text-[#FF1A1A]" />
              <span>EXPORT CSV ({filteredMembers.length})</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-4 sm:p-5 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-[#FF1A1A] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Search by name, email or mobile..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#080808] border border-[#2A2A2A] focus:border-[#FF1A1A] rounded text-white placeholder-[#666666] text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#FF1A1A] transition-all"
              />
            </div>

            {/* Level Filter */}
            <div className="md:col-span-2">
              <select
                value={filters.level}
                onChange={(e) => setFilters((prev) => ({ ...prev, level: e.target.value }))}
                className="w-full py-2.5 px-3 bg-[#080808] border border-[#2A2A2A] focus:border-[#FF1A1A] rounded text-white text-xs font-mono focus:outline-none transition-all cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Wolf CTF Filter */}
            <div className="md:col-span-2">
              <select
                value={filters.ctf}
                onChange={(e) => setFilters((prev) => ({ ...prev, ctf: e.target.value }))}
                className="w-full py-2.5 px-3 bg-[#080808] border border-[#2A2A2A] focus:border-[#FF1A1A] rounded text-white text-xs font-mono focus:outline-none transition-all cursor-pointer"
              >
                <option value="all">Wolf CTF: All</option>
                <option value="yes">Wolf CTF: Yes</option>
                <option value="no">Wolf CTF: No</option>
              </select>
            </div>

            {/* Hackathon Filter */}
            <div className="md:col-span-2">
              <select
                value={filters.hackathon}
                onChange={(e) => setFilters((prev) => ({ ...prev, hackathon: e.target.value }))}
                className="w-full py-2.5 px-3 bg-[#080808] border border-[#2A2A2A] focus:border-[#FF1A1A] rounded text-white text-xs font-mono focus:outline-none transition-all cursor-pointer"
              >
                <option value="all">Hackathons: All</option>
                <option value="yes">Hackathons: Yes</option>
                <option value="no">Hackathons: No</option>
              </select>
            </div>
          </div>

          {/* Active Filter Counter */}
          <div className="flex items-center justify-between text-xs font-mono text-[#999999] pt-2 border-t border-[#2A2A2A]/50">
            <span>
              Showing <strong className="text-white">{filteredMembers.length}</strong> of{' '}
              <strong className="text-white">{members.length}</strong> members
            </span>
            {(filters.search || filters.level !== 'all' || filters.ctf !== 'all' || filters.hackathon !== 'all') && (
              <button
                onClick={() => setFilters({ search: '', level: 'all', ctf: 'all', hackathon: 'all' })}
                className="text-[#FF1A1A] hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Members Table */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" text="ACCESSING MEMBER DATABASE..." />
          </div>
        ) : (
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#080808] text-[#999999] uppercase tracking-wider border-b border-[#2A2A2A]">
                  <tr>
                    <th className="py-3.5 px-4 w-12">#</th>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Mobile</th>
                    <th className="py-3.5 px-4">Level</th>
                    <th className="py-3.5 px-4">Wolf CTF</th>
                    <th className="py-3.5 px-4">Hackathons</th>
                    <th className="py-3.5 px-4">Registered</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredMembers.map((member, index) => (
                    <tr key={member.id} className="hover:bg-[#181818] transition-colors">
                      <td className="py-3.5 px-4 text-[#666666]">{index + 1}</td>
                      <td className="py-3.5 px-4 text-white font-bold whitespace-nowrap">{member.name}</td>
                      <td className="py-3.5 px-4 text-[#E5E5E5] whitespace-nowrap">{member.email}</td>
                      <td className="py-3.5 px-4 text-[#999999] whitespace-nowrap">{member.mobile}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold whitespace-nowrap ${
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
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {member.attendedWolfCTF === 'yes' ? (
                          <span className="text-[#22C55E] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> YES
                          </span>
                        ) : (
                          <span className="text-[#666666]">NO</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {member.attendedWolfHackathons === 'yes' ? (
                          <span className="text-[#22C55E] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> YES {member.hackathonCount ? `(${member.hackathonCount})` : ''}
                          </span>
                        ) : (
                          <span className="text-[#666666]">NO ({member.hackathonCount || 'New member'})</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#999999] whitespace-nowrap">
                        {formatDate(member.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Action */}
                          <button
                            onClick={() => setViewingMember(member)}
                            className="p-1.5 rounded bg-[#080808] hover:bg-[#222222] border border-[#2A2A2A] hover:border-white text-[#E5E5E5] transition-colors"
                            title="View Details"
                            aria-label={`View details for ${member.name}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Action */}
                          <button
                            onClick={() => setDeletingMember(member)}
                            className="p-1.5 rounded bg-[#1a0505] hover:bg-[#FF1A1A] border border-[#FF1A1A]/50 hover:border-[#FF1A1A] text-[#FF1A1A] hover:text-white transition-all shadow-[0_0_8px_rgba(255,26,26,0.3)]"
                            title="Delete Member"
                            aria-label={`Delete member ${member.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-[#666666]">
                        No members found matching your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Member Details Modal */}
        <Modal
          isOpen={!!viewingMember}
          onClose={() => setViewingMember(null)}
          title="MEMBER DETAILS"
        >
          {viewingMember && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-[#080808] border border-[#2A2A2A] rounded space-y-3">
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#888888] uppercase">Full Name:</span>
                  <span className="col-span-2 text-white font-bold">{viewingMember.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#888888] uppercase">Email:</span>
                  <span className="col-span-2 text-[#FF1A1A] font-semibold select-all">
                    {viewingMember.email}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#888888] uppercase">Mobile:</span>
                  <span className="col-span-2 text-white font-semibold">{viewingMember.mobile}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#888888] uppercase">Hacking Level:</span>
                  <span className="col-span-2 uppercase text-white font-bold">
                    {viewingMember.hackingLevel}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#888888] uppercase">Wolf CTF:</span>
                  <span className="col-span-2 uppercase text-white">
                    {viewingMember.attendedWolfCTF}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-[#2A2A2A]">
                  <span className="text-[#888888] uppercase">Hackathons:</span>
                  <span className="col-span-2 uppercase text-white">
                    {viewingMember.attendedWolfHackathons} {viewingMember.hackathonCount ? `(${viewingMember.hackathonCount})` : ''}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#888888] uppercase">Registered Date:</span>
                  <span className="col-span-2 text-[#999999]">
                    {formatDate(viewingMember.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setViewingMember(null)}
                  className="px-4 py-2 bg-[#FF1A1A] hover:bg-[#FF3333] text-white rounded font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_10px_rgba(255,26,26,0.4)]"
                >
                  CLOSE
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deletingMember}
          onClose={() => setDeletingMember(null)}
          title="CONFIRM DELETION"
          maxWidth="max-w-md"
        >
          {deletingMember && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-[#1a0505] border border-[#FF1A1A] rounded flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#FF1A1A] flex-shrink-0" />
                <div>
                  <p className="text-white font-bold mb-1">
                    Are you sure you want to delete this member?
                  </p>
                  <p className="text-[#999999] mb-2">
                    Target: <strong className="text-[#FF1A1A]">{deletingMember.name}</strong> (
                    {deletingMember.email})
                  </p>
                  <p className="text-[#FF3333] font-bold">This action cannot be undone.</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingMember(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-[#080808] hover:bg-[#181818] border border-[#2A2A2A] text-[#E5E5E5] rounded font-mono text-xs font-semibold uppercase transition-all"
                >
                  CANCEL
                </button>

                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-5 py-2 bg-[#FF1A1A] hover:bg-[#FF3333] text-white rounded font-mono text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(255,26,26,0.6)] flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>DELETING...</span>
                    </>
                  ) : (
                    <span>DELETE MEMBER</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
};
