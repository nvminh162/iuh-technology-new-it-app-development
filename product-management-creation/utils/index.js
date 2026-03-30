const computeAmount = (price, quantity) => {
    return Number(price) * Number(quantity);
}

const statusLabel = (quantity) => {
    const q = Number(quantity);
    if (q === 0) return "Hết vé";
    else if (q <= 10) return "Sắp hết vé"
    else return "Còn vé";
}

const computeFinalAmount = (price, quantity, category) => {
    let amount = computeAmount(price, quantity);
    let discountRate = 0;
    if (category === 'PROMOTION') discountRate = 0.3; // 30%
    if (category === 'STANDARD' && quantity >= 10) discountRate = 0.15; // 15%
    const finalAmount = amount * (1 - discountRate);
    return { finalAmount, finalAmountLabel: discountRate > 0 ? "Được giảm giá" : "Không giảm giá" };
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(Number(value) || 0);
}

module.exports = { computeAmount, statusLabel, computeFinalAmount, formatCurrency }