const { findAll, findById, add, deleteById } = require("../service");
const {
  computeAmount,
  statusLabel,
  computeFinalAmount,
  formatCurrency,
} = require("../utils");
const { validation } = require("../validation");

const controller = {
  renderAll: async (req, res) => {
    const { name, category, status, expiryFrom, expiryTo } = req.query;
    let items = await findAll();

    if (name) {
      const keyword = name.toLowerCase();
      items = items.filter(
        (item) =>
          item.name?.toLowerCase().includes(keyword) ||
          item.customer?.toLowerCase().includes(keyword),
      );
    }

    if (category && category !== "ALL") {
      items = items.filter((item) => item.category === category);
    }

    if (status && status !== "ALL") {
      items = items.filter(
        (item) => statusLabel(item?.quantity || 0) === status,
      ); //filter without dynamodb
    }

    if (expiryFrom) {
      items = items.filter((item) => item.expiry >= expiryFrom);
    }

    if (expiryTo) {
      items = items.filter((item) => item.expiry <= expiryTo);
    }

    return res.render("index", {
      items,
      computeAmount,
      statusLabel,
      computeFinalAmount,
      formatCurrency,
    });
  },
  renderForm: async (req, res) => {
    return res.render("form", { error: null });
  },

  add: async (req, res) => {
    const invalid = validation(req.body);
    if (invalid) return res.render("form", { error: invalid });

    try {
      await add(req.body, req.file);
      return res.redirect("/");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },
  deleteById: async (req, res) => {
    try {
      await deleteById(req.params.id);
      return res.redirect("/");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },
};

module.exports = { controller };
