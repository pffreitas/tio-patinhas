

const formatCurrency = (value: number) => (new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value));
const formatPercentage = (value: number) => (new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 0 }).format(value));

export { formatCurrency, formatPercentage }
