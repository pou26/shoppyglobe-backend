import Product from "../Model/product.model.mjs";
import {isValidObjectId} from "../Middleware/validate.mjs"; 



export async function getProduct(req, res, next) {
    try {
      const products = await Product.find(); // Fetching from the existing collection

      if (products.length === 0) {
        return res.status(404).json({ msg: "No products found" });
    }

      res.json(products);
    } catch (error) {
        next(error);
    }
  };

  export async function getProductById(req,res,next){
    try{
        const { productId } = req.params;

        const product= await Product.findById(productId);

        if (!isValidObjectId(productId)) {
          return res.status(400).json({ msg: "Invalid product ID" });
      }

        if(!product){
            return res.status(404).json({msg:"No Products with this id"})
        }

        res.json(product);

    }catch(error){
        next(error);
    }
  }
