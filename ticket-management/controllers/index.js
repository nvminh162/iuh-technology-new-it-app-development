const { v4: uuidv4 } = require('uuid')
const { getAll, getId, upsert, remove, uploadImage } = require('../services')
const { validateTicketInput, VALID_STATUS } = require('../validation')
const { calcAmounts } = require('../utils')

const controller = {
    getAll: async (req, res) => {
        try {
            const q = (req.query.q || "").trim().toLowerCase();
            const status = (req.query.status || "").trim();
            let tickets = await getAll();
            // filter q
            if (q) {
                tickets = tickets.filter((t) =>
                    String(t.eventName || "").toLowerCase().includes(q) ||
                    String(t.holderName || "").toLowerCase().includes(q)
                );
            }
            // filter status
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
            const ticketId = req.params.id || uuidv4();
            const isCreate = !req.params.id;

            const validationError = validateTicketInput(req.body);
            if (validationError) {
                const currentTicket = { ...req.body, ticketId };
                return res.currentTicketstatus(400).render('upsert', { ticket: currentTicket, error: validationError });
            }

            const existing = await getId(ticketId);

            const imageUrl = req.file ? await uploadImage(req.file) : (existing?.imageUrl || "");
            const quantity = Number(req.body.quantity);
            const pricePerTicket = Number(req.body.pricePerTicket);
            const amounts = calcAmounts(req.body.category, quantity, pricePerTicket);

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