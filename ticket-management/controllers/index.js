
const { getAll, getId } = require('../services')

const controller = {
    getAll: async (req, res) => {
        try {
            const tickets = await getAll();
            return res.render('index', { tickets })
            // return res.status(200).json(tickets)
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
    upsert: async (req, res) => {
        try {
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = { controller }