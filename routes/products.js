const express = require("express");
const router = express.Router();
const client = require("../database");

router.get("/get-products", async (req, res) => {
  const response = await client.query(`select * from products`);
  res.send(response.rows);
});

router.post("/post-product", async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const response = await client.query(
      `insert into products(name, description, price, image) values ($1, $2, $3, $4) RETURNING *`,
      [name, description, price, image]
    );
    res.send(response.rows);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/add-cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await client.query(
      `select * from products where id=${id}`
    );
    const rows = response.rows;
    if (rows.length) {
      const cart = await client.query(
        `select * from cart where productid=${id}`
      );
      if (cart.rows.length) {
        return res.status(500).send({
          message: "Product is already in cart",
        });
      }
      await client.query(
        `insert into cart(productid) values ($1) RETURNING *`,
        [id]
      );
      return res.send({
        message: "Product is successfully added to cart",
      });
    }
    return res.status(500).send({
      message: "Product is not found",
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/get-cart-items", async (req, res) => {
  try {
    const response = await client.query(
      `select cart.id as cartId, products.name as name, products.description as description, products.price as price, products.image as image
      from products join cart on cart.productid = products.id
      `
    );
    res.send(response.rows);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/delete-cart-item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await client.query(`delete from cart where id=${id}`);
    return res.send({
      message: "Product is deleted",
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/get-searched-product", async (req, res) => {
  try {
    let { searchText } = req.query;
    const response = await client.query(
      `select * from products where lower(name) like lower('%${searchText}%') order by name;`
    );
    res.send(response.rows);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
