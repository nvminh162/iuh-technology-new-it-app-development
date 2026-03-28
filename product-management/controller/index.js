const { findAll, findById, save, deleteById } = require("../service");
const { computeAmount, statusLabel, computeFinalAmount } = require('../utils')
const { validation } = require("../validation")

const renderAllController = async (req, res) => {
  const { name, category } = req.query;
  let items = await findAll();

  if (name) {
    items = items.filter(item => item.name?.toLowerCase().includes(name.toLowerCase()));
  }

  if (category && category !== "ALL") {
    items = items.filter(item => item.category === category);
  }

  return res.render("index", { items, computeAmount, statusLabel, computeFinalAmount });
};

const renderFormController = async (req, res) => {
  const { id } = req.params;
  const item = id ? await findById(id) : null;
  return res.render("form", { item, error: null });
};

const saveController = async (req, res) => {
  const invalid = validation(req.body);
  if (invalid) {
    const item = { ...req.body, ...(req.params.id ? { id: req.params.id } : {}) }; // gắn lại data cũ vào form
    return res.render("form", { item, error: invalid });
  }

  try {
    await save(req.params.id, req.body, req.file);
    return res.redirect("/");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteByIdController = async (req, res) => {
  try {
    await deleteById(req.params.id);
    return res.redirect("/");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = { renderAllController, renderFormController, saveController, deleteByIdController };
