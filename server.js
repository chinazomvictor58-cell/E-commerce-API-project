
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Sample Data
let products = [
    { id: 1, name: "Laptop", price: 1200, stock: 10 },
    { id: 2, name: "Phone", price: 800, stock: 15 },
    { id: 3, name: "Headphones", price: 150, stock: 30 }
];

let cart = [];

// 1. GET all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// 2. POST - Add a new product (Lecturer Request)
app.post('/api/products', (req, res) => {
    const { name, price, stock } = req.body;
    const newProduct = {
        id: products.length + 1,
        name,
        price,
        stock
    };
    products.push(newProduct);
    res.status(201).json({ message: "Product added successfully", product: newProduct });
});

// 3. PATCH - Update an existing product's details (Lecturer Request)
app.patch('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, price, stock } = req.body;
    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;

    res.json({ message: "Product updated successfully", product });
});

// 4. DELETE - Remove a product from the database (Lecturer Request)
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) return res.status(404).json({ message: "Product not found" });

    const deletedProduct = products.splice(productIndex, 1);
    res.json({ message: "Product deleted successfully", product: deletedProduct[0] });
});

// 5. POST - Add an item to the cart
app.post('/api/cart', (req, res) => {
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
