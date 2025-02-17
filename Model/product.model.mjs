import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: Number,
  rating: Number,
  quantity: Number,
  images: String,
  thumbnail: String,
}, { collection: "products" }); //linking to existing collection

const Product = mongoose.model("Product", productSchema);

export default Product;