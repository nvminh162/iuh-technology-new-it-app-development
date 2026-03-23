
const { getAll, getId, upsert, remove, uploadImage } = require('../services')

const VALID_CATEGORIES = ["Standard", "VIP", "VVIP"];
const VALID_STATUS = ["Upcoming", "Sold", "Cancelled"];

const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const validateTicketInput = (body) => {
    const quantity = Number(body.quantity);
    const pricePerTicket = Number(body.pricePerTicket);
    const eventDate = new Date(body.eventDate);

    if (!body.eventName || !body.holderName) {
        return "eventName và holderName là bắt buộc";
    }
    if (!VALID_CATEGORIES.includes(body.category)) {
        return "category chỉ nhận Standard / VIP / VVIP";
    }
    if (!VALID_STATUS.includes(body.status)) {
        return "status chỉ nhận Upcoming / Sold / Cancelled";
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
        return "quantity phải > 0";
    }
    if (!Number.isFinite(pricePerTicket) || pricePerTicket <= 0) {
        return "pricePerTicket phải > 0";
    }
    if (Number.isNaN(eventDate.getTime())) {
        return "eventDate không hợp lệ";
    }
    if (eventDate < startOfToday()) {
        return "eventDate không được nhỏ hơn ngày hiện tại";
    }
    return null;
};

const computeAmounts = (category, quantity, pricePerTicket) => {
    const totalAmount = quantity * pricePerTicket;
    let discountRate = 0;
    if (category === "VIP" && quantity >= 4) discountRate = 0.1;
    if (category === "VVIP" && quantity >= 2) discountRate = 0.15;
    const finalAmount = totalAmount * (1 - discountRate);
    return {
        totalAmount,
        finalAmount,
        discountLabel: discountRate > 0 ? "Duoc giam gia" : "Khong giam gia"
    };
};

const generateTicketId = () => `TICKET-${Date.now()}`;

const controller = {
    getAll: async (req, res) => {
        try {
            const q = (req.query.q || "").trim().toLowerCase();
            const status = (req.query.status || "").trim();
            let tickets = await getAll();

            if (q) {
                tickets = tickets.filter((t) =>
                    String(t.eventName || "").toLowerCase().includes(q) ||
                    String(t.holderName || "").toLowerCase().includes(q)
                );
            }
            if (status && VALID_STATUS.includes(status)) {
                tickets = tickets.filter((t) => t.status === status);
            }

            return res.render('index', { tickets, q, status })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const ticket = await getId(id)
            if (!ticket) {
                return res.status(404).render('id', { ticket: null })
            }
            return res.render('id', { ticket })
            // return res.status(200).json(ticket)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getUpsertForm: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.render('upsert', { ticket: null, error: null });
            }
            const ticket = await getId(id);
            return res.render('upsert', { ticket: ticket || null, error: null });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    upsert: async (req, res) => {
        try {
            const ticketId = req.params.id || generateTicketId();
            const isCreate = !req.params.id;

            const validationError = validateTicketInput(req.body);
            if (validationError) {
                const currentTicket = { ...req.body, ticketId };
                return res.status(400).render('upsert', { ticket: currentTicket, error: validationError });
            }

            const existing = await getId(ticketId);
            if (isCreate && !req.file) {
                const currentTicket = { ...req.body, ticketId };
                return res.status(400).render('upsert', { ticket: currentTicket, error: "Them moi bat buoc chon anh" });
            }
            const imageUrl = req.file ? await uploadImage(req.file) : (existing?.imageUrl || "");
            const quantity = Number(req.body.quantity);
            const pricePerTicket = Number(req.body.pricePerTicket);
            const amounts = computeAmounts(req.body.category, quantity, pricePerTicket);

            const item = {
                ...existing,
                ...req.body,
                ...amounts,
                quantity,
                pricePerTicket,
                ticketId,
                imageUrl,
                createdAt: existing?.createdAt || new Date().toISOString()
            };
            await upsert(item);
            return res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    remove: async (req, res) => {
        try {
            await remove(req.params.id);
            return res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = { controller }