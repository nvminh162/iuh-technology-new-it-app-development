const VALID_CATEGORIES = ["Standard", "VIP", "VVIP"];
const VALID_STATUS = ["Upcoming", "Sold", "Cancelled"];

// const startOfToday = () => {
//     const d = new Date();
//     d.setHours(0, 0, 0, 0);
//     return d;
// };

const validateTicketInput = (body) => {
//     const quantity = Number(body.quantity);
//     const pricePerTicket = Number(body.pricePerTicket);
//     const eventDate = new Date(body.eventDate);

//     if (!body.eventName || !body.holderName) {
//         return "eventName và holderName là bắt buộc";
//     }
//     if (!VALID_CATEGORIES.includes(body.category)) {
//         return "category chỉ nhận Standard / VIP / VVIP";
//     }
//     if (!VALID_STATUS.includes(body.status)) {
//         return "status chỉ nhận Upcoming / Sold / Cancelled";
//     }
//     if (!Number.isFinite(quantity) || quantity <= 0) {
//         return "quantity phải > 0";
//     }
//     if (!Number.isFinite(pricePerTicket) || pricePerTicket <= 0) {
//         return "pricePerTicket phải > 0";
//     }
//     if (Number.isNaN(eventDate.getTime())) {
//         return "eventDate không hợp lệ";
//     }
//     if (eventDate < startOfToday()) {
//         return "eventDate không được nhỏ hơn ngày hiện tại";
//     }
    return null;
};

module.exports = { validateTicketInput, VALID_CATEGORIES, VALID_STATUS }