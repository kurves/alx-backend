const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

function getItemById(id) {
  return listProducts.find((product) => product.itemId === parseInt(id, 10));
}

module.exports = { listProducts, getItemById };

const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();
client.on('error', (err) => console.log('Redis client not connected to the server:', err));
client.on('connect', () => console.log('Redis client connected to the server'));

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = { client, getAsync, setAsync };

// 9-stock.js
const express = require('express');
const { listProducts, getItemById } = require('./products');
const { getAsync, setAsync } = require('./redisClient');

const app = express();
const PORT = 1245;

// Function to reserve stock by item ID
async function reserveStockById(itemId, stock) {
  await setAsync(`item.${itemId}`, stock);
}

// Function to get the current reserved stock by item ID
async function getCurrentReservedStockById(itemId) {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : null;
}

// Route to get the list of all products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Route to get the details of a specific product by itemId
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = reservedStock !== null
    ? product.initialAvailableQuantity - reservedStock
    : product.initialAvailableQuantity;

  res.json({
    itemId: product.itemId,
    itemName: product.itemName,
    price: product.price,
    initialAvailableQuantity: product.initialAvailableQuantity,
    currentQuantity: currentQuantity
  });
});

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = reservedStock !== null
    ? product.initialAvailableQuantity - reservedStock
    : product.initialAvailableQuantity;

  if (currentQuantity <= 0) {
    return res.json({ status: 'Not enough stock available', itemId: product.itemId });
  }

  await reserveStockById(itemId, (reservedStock || 0) + 1);
  res.json({ status: 'Reservation confirmed', itemId: product.itemId });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

