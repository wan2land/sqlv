
export function formatDate(d: Date): string {
  return `${d.getFullYear() % 100}${fmt(d.getMonth() + 1)}${fmt(d.getDate())}_${fmt(d.getHours())}${fmt(d.getMinutes())}${fmt(d.getSeconds())}`
}

function fmt(digit: number): string {
  return digit >= 10 ? "" + digit : "0" + digit
}
