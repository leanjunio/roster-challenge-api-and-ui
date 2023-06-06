export function formatToCAD(amount: number) {
  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });

  return formatter.format(amount);
}