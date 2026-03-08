export function getFutureDateFormatted(daysAhead = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${day}/${month}/${year}`;
}
