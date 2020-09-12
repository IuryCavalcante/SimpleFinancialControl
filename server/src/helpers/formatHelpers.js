const formatterNumber = Intl.NumberFormat('pt-BR');
const formatterCurrency = Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});
const formatterPercent = Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 2,
});
var options = {
  year: 'numeric',
  day: 'numeric',
  month: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};
const formatterDate = Intl.DateTimeFormat('pt-BR', options);

function formatNumber(value) {
  return formatterNumber.format(value);
}

function formatCurrency(value) {
  return formatterCurrency.format(value);
}

function formatPercent(value) {
  return formatterPercent.format(value);
}

function formatShortMonth(year, month, day) {
  const date = new Date(2020, 1 - 1, 1);
  return formatterDate.format(date);
}

export { formatNumber, formatCurrency, formatPercent, formatShortMonth };
