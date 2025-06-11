export default function formatSeasonValue(item: { start: string; end: string }) {
  if (item.start === "All" || item.end === "All") {
    return "All Year";
  }
  return `${item.start} until ${item.end}`;
}