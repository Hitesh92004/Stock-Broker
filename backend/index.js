require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { HoldingsModel } = require("./model/HoldingsModels");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

// Validate MongoDB URL
if (!uri) {
  console.error("ERROR: MONGO_URL environment variable is not set!");
  process.exit(1);
}

const app = express();

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running", timestamp: new Date() });
});

app.get('/allHoldings', async (req, res) => {
  try {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    console.error("Error fetching holdings:", err.message);
    res.status(500).json({ error: "Error fetching holdings" });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    console.error("Error fetching positions:", err.message);
    res.status(500).json({ error: "Error fetching positions" });
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({});
    res.json(allOrders);
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });
    await newOrder.save();
    res.json({ message: "Order saved!", order: newOrder });
  } catch (err) {
    console.error("Error saving order:", err.message);
    res.status(500).json({ error: "Error saving order" });
  }
});

// Start the Server
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ DB Connected!");
    app.listen(PORT, () => {
      console.log(`✅ App started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });