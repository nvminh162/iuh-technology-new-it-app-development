const { findAll, findById } = require("../service");

const getAll = async (req, res) => {
  const items = await findAll();
  return res.render("index", { items });
};

const getId = async (req, res) => {
  const { id } = req.params;
  const item = id ? await findById(id) : null;
  return res.render("form", { item });
};

module.exports = { getAll, getId };
