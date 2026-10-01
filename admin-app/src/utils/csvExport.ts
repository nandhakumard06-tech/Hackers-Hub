import { Registration } from '../types/registration';

export function formatDate(timestamp: any): string {
  if (!timestamp) return 'N/A';
  try {
    if (typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    }
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      const d = new Date(timestamp);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short',
        });
      }
    }
    return String(timestamp);
  } catch (err) {
    return 'N/A';
  }
}

export function exportMembersToCSV(members: Registration[], filename = 'tvm_hackers_hub_members.csv') {
  const headers = [
    'Name',
    'Email',
    'Mobile',
    'Ethical Hacking Level',
    'Wolf CTF',
    'Wolf Hackathons',
    'Registration Date',
  ];

  const escapeCSV = (field: any): string => {
    const stringValue = field === null || field === undefined ? '' : String(field);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const rows = members.map((m) => [
    escapeCSV(m.name),
    escapeCSV(m.email),
    escapeCSV(m.mobile),
    escapeCSV(m.hackingLevel.toUpperCase()),
    escapeCSV(m.attendedWolfCTF.toUpperCase()),
    escapeCSV(
      m.hackathonCount
        ? `${m.attendedWolfHackathons.toUpperCase()} (${m.hackathonCount})`
        : m.attendedWolfHackathons.toUpperCase()
    ),
    escapeCSV(formatDate(m.createdAt)),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
