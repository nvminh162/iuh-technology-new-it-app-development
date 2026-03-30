const { controller } = require("../../product-management-creation/controller");
const { findAll, findById, save, deleteById } = require("../service");
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
    const { id } = req.params;
    const item = id ? await findById(id) : null;
    return res.render("form", { item, error: null });
  },

  save: async (req, res) => {
    const invalid = validation(req.body);
    if (invalid) {
      const item = {
        ...req.body,
        ...(req.params.id ? { id: req.params.id } : {}),
      }; // gắn lại data cũ vào form
      return res.render("form", { item, error: invalid }); // item: for update get from URL
    }

    try {
      await save(req.params.id, req.body, req.file);
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
