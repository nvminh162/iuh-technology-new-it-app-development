const validation = (item) => {
  const name = item?.name || "";
  const customer = item?.customer || "";
  const quantity = Number(item.quantity);
  const price = Number(item.price);
  const expiry = item?.expiry || "";

  if (name.length <= 5) {
    return "Customer > 5 ký tự";
  }
  if (customer.length <= 5) {
    return "Customer > 5 ký tự";
  }
  if (quantity < 0) {
    return "Quantity >= 0";
  }
  if (price < 0) {
    return "Price >= 0";
  }
  if (expiry < new Date().toISOString().split("T")[0]) {
    return "Expiry must be greater than today";
  }
  return null;
};

module.exports = { validation };
