 export default function formatSeasonValue(item: string) {
    if (item.start === "All" || item.end === "All") {
      return "All Year";
    }
  }