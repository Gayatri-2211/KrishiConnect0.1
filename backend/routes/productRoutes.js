const express = require('express');
const multer = require('multer');
const Product = require('../models/Product'); // Ensure this model includes location
const router = express.Router();

// ✅ Storage configuration for images
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ POST Route - Add a product
router.post('/add', upload.single('image'), async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('File:', req.file);

      // ✅ Ensure location is properly received
      const { name, price, description, contact, category, location, quantity, manufacturedDate, deliveryOptions, qualityGrade, sellerName } = req.body;
      if (!location) {
        return res.status(400).json({ error: "Location is required!" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      const product = new Product({ 
        name, 
        price, 
        description, 
        contact, 
        category, 
        location, 
        imageUrl, 
        quantity, 
        manufacturedDate, 
        deliveryOptions: deliveryOptions ? deliveryOptions.split(',') : [], // Convert to array
        qualityGrade, 
        sellerName 
      });
      await product.save();
      res.json({ message: 'Product added successfully', product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add product' });
    }
});

// ✅ GET Route - Fetch all products (including new fields)
router.get('/get', async (req, res) => {
    try {
      const products = await Product.find({}, 'name price description contact category location imageUrl quantity manufacturedDate deliveryOptions qualityGrade sellerName');
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
});

module.exports = router;
