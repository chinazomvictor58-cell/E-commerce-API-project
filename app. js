const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Path matching the folder structure in the image sidebar
const filePath = path.join(__dirname, 'data', 'products.json');
let cart = [];

const readData = () => {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// 1. GET all products
app.get('/api/v1/products', (req, res) => {
    const products = readData();
    res.status(200).json({
        status: "success",
        results: products.length,
        data: { products }
    });
});

// 2. GET a single product by ID (Matches lines 34-38 in your image)
app.get('/api/v1/products/:id', (req, res) => {
    const products = readData();
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            status: "fail",
            message: "Product not found"
        });
    }

    res.status(200).json({
        status: "success",
        data: { product }
    });
});

// 3. POST - Create a new product (Matches lines 40-50 in your image)
app.post('/api/v1/products', (req, res) => {
    const products = readData();
    const body = req.body;
    
    // Calculates new ID based on the last item's ID
    const newId = products[products.length - 1].id + 1;
    const newProduct = Object.assign({ id: newId }, body);
    
    products.push(newProduct);
    writeData(products);

    res.status(201).json({
        status: "success",
        data: {
            product: newProduct
        }
    });
});

// 4. PATCH - Update an existing product
app.patch('/api/v1/products/:id', (req, res) => {
    const products = readData();
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            status: "fail",
            message: "Product not found"
        });
    }

    Object.assign(product, req.body);
    writeData(products);

    res.status(200).json({
        status: "success",
        data: { product }
    });
});

// 5. DELETE - Remove a product
app.delete('/api/v1/products/:id', (req, res) => {
    let products = readData();
    const id = parseInt(req.params.id);
    const productExists = products.some(p => p.id === id);

    if (!productExists) {
        return res.status(404).json({
            status: "fail",
            message: "Product not found"
        });
    }

    products = products.filter(p => p.id !== id);
    writeData(products);

    res.status(204).json({
        status: "success",
        data: null
    });
});

// 6. POST - Add item to cart
app.post('/api/v1/cart', (req, res) => {
    const products = readData();
    const { productId, quantity } = req.body;
    const product = products.find(p => p.id === productId);
    
    if (!product) return res.status(404).json({ status: "fail", message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ status: "fail", message: "Not enough stock" });

    cart.push({ productId: product.id, name: product.name, price: product.price, quantity });
    res.status(201).json({ status: "success", data: { cart } });
});

// 7. GET - View cart
app.get('/api/v1/cart', (req, res) => {
    res.status(200).json({ status: "success", data: { cart } });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
