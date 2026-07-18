// Currency and misc formatting shared by store + admin.
// Pakistani audience: "Rs. 100,000" / "Rs. 1,000,000" comma grouping.

export function formatRs(price, unit) {
  if (price === null || price === undefined || price === "") return "—";
  const value = Number(price);
  if (Number.isNaN(value)) return "—";
  if (unit === "Per Watt") {
    return `Rs. ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/W`;
  }
  return `Rs. ${Math.round(value).toLocaleString("en-US")}`;
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatDateFull(iso) {
  if (!iso) return "";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
