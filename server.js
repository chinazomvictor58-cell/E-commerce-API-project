
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const filePath = path.join(__dirname, 'product.json');
let cart = [];

// Helper functions to handle the JSON file database
const readData = () => {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// 1. GET all products from JSON file
app.get('/api/products', (req, res) => {
    const products = readData();
    res.json(products);
});

// 2. POST - Add a new product into JSON file
app.post('/api/products', (req, res) => {
    const products = readData();
    const { name, price, stock } = req.body;
    
    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        name,
        price,
        stock
    };
    
    products.push(newProduct);
    writeData(products);
    res.status(201).json({ message: "Product added to database", product: newProduct });
});

// 3. PATCH - Update product details inside JSON file
app.patch('/api/products/:id', (req, res) => {
    const products = readData();
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, price, stock } = req.body;
    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;

    writeData(products);
    res.json({ message: "Product updated in database", product });
});

// 4. DELETE - Remove a product completely from JSON file
app.delete('/api/products/:id', (req, res) => {
    let products = readData();
    const id = parseInt(req.params.id);
    const productExists = products.some(p => p.id === id);

    if (!productExists) return res.status(404).json({ message: "Product not found" });

    products = products.filter(p => p.id !== id);
    writeData(products);
    res.json({ message: "Product deleted from database successfully" });
});

// 5. POST - Add an item to the shopping cart
app.post('/api/cart', (req, res) => {
    const products = readData();
    const { productId, quantity } = req.body;
    const product = products.find(p => p.id === productId);
    
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock" });

    cart.push({ productId: product.id, name: product.name, price: product.price, quantity });
    res.status(201).json({ message: "Item added to cart", cart });
});

// 6. GET - View cart details
app.get('/api/cart', (req, res) => {
    res.json(cart);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
