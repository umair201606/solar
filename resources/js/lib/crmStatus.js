// Shared status metadata for CRM projects (admin + client portal).
// Status colors always ship with their text label — never color alone.
export const CRM_STATUSES = [
  { id: "starting-soon", label: "Starting Soon", chip: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  { id: "in-progress", label: "In Progress", chip: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  { id: "delayed", label: "Delayed", chip: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  { id: "called-off", label: "Called Off", chip: "bg-red-50 text-red-600", dot: "bg-red-400" },
  { id: "completed", label: "Completed", chip: "bg-[#041a12] text-[#d4ff00]", dot: "bg-[#041a12]" },
];

export const statusMeta = (id) =>
  CRM_STATUSES.find((s) => s.id === id) || { id, label: id, chip: "bg-gray-100 text-gray-500", dot: "bg-gray-400" };
