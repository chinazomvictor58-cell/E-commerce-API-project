const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let products = [
    { id: 1, name: "Laptop", price: 1200, stock: 10 },
    { id: 2, name: "Phone", price: 800, stock: 15 },
    { id: 3, name: "Headphones", price: 150, stock: 30 }
];
let cart = [];

app.get('/', (req, res) => { res.json({ message: "Welcome to the E-Commerce API Project" }); });
app.get('/api/products', (req, res) => { res.json(products); });
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});
app.post('/api/cart', (req, res) => {
    const { productId, quantity } = req.body;
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock" });
    cart.push({ productId: product.id, name: product.name, price: product.price, quantity });
    res.status(201).json({ message: "Item added to cart", cart });
});
app.get('/api/cart', (req, res) => { res.json(cart); });

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
