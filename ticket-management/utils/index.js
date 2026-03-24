const calcAmounts = (category, quantity, pricePerTicket) => {
    const totalAmount = quantity * pricePerTicket;
    let discountRate = 0;
    if (category === "VIP" && quantity >= 4) discountRate = 0.1;
    if (category === "VVIP" && quantity >= 2) discountRate = 0.15;
    const finalAmount = totalAmount * (1 - discountRate);
    return {
        totalAmount,
        finalAmount,
        discountLabel: discountRate > 0 ? "Được giảm giá" : "Không được giảm"
    };
};

module.exports = { calcAmounts }